// external modules import
const File = require('../models/fileModel');
const router = require('express').Router();

router.get('/:uuid', async (req, res) => {
  try {
    // find the file in the database
    const file = await File.findOne({ uuid: req.params.uuid });

    // check if the file exists
    if (!file) {
      return res
        .status(404)
        .json({ error: 'Your due time has expired/File does not exist' });
    }
    return res.status(200).json({
      uuid: file.uuid,
      filename: file.filename,
      filesize: file.size,
      download: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (err) {
    // send error response if there is no file
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
