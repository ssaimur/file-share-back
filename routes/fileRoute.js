// external modules
const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { v4: uuid4 } = require('uuid');

// internal modules
const File = require('../models/fileModel');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage, limits: { fileSize: 1000000 * 25 } }).single(
  'fileToShare'
);

// upload the file in the databse
router.post('/', (req, res) => {
  // store the file
  upload(req, res, async (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    }

    // validate the request
    if (!req.file) {
      return res.status(400).json({ error: 'You should include a file!' });
    }

    // srote file information in database
    const fileCreds = {
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    };

    const file = await File.create(fileCreds);
    return res
      .status(200)
      .json({ file: `${process.env.APP_BASE_URL}/files/${file.uuid}` });
  });
});

// route for sending files trough email\
router.post('/send', async (req, res) => {
  console.log(req.body);
  const { uuid, emailTo, emailFrom } = req.body;

  // check if all the fields are provided
  if (!uuid || !emailTo || !emailFrom) {
    res.status(422).json({ error: 'All the field are required' });
  }

  try {
    // get the data from database
    const file = await File.findOne({ uuid: uuid });

    //  check if the email already sent
    if (file.seder) {
      return res.status(422).json({ error: 'Email already sent' });
    }

    file.sender = emailFrom;
    file.reciever = emailTo;

    const response = await file.save();

    require('../services/emailService')({
      from: emailFrom,
      to: emailTo,
      subject: 'Firegram file sharing',
      text: `${emailFrom} shared a file with you`,
      html: require('../services/emailTemplate')({
        emailFrom: emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
        size: parseInt(file.size / 1000) + 'KB',
        expires: '24 hours',
      }),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log({ err });
    // send server side error message
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
