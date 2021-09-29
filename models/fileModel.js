const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    uuid: { type: String, required: true },
    sender: { type: String },
    reciever: { type: String },
  },
  { timestamps: true }
);

const File = mongoose.model('File', fileSchema);

module.exports = File;
