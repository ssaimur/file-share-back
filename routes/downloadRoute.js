const File = require('../models/fileModel');

const router = require('express').Router();

router.get('/:uuid', async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });

    // check if lthe file exists
    if (!file) {
      return res
        .status(404)
        .json({ error: 'File does not exists/File has been expired' });
    }

    // genrate the download file path
    const filePath = `${__dirname}/../${file.path}`;
    return res.download(filePath);
  } catch (err) {
    // send the error
    res.status(500).json({ error: 'there was a server side error' });
  }
});

module.exports = router;
