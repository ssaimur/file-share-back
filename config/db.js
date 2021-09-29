const mongoose = require('mongoose');

const connectDb = () => {
  const url = process.env.MONGO_URI;

  const connection = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connection
    .then(() => console.log('connected to database ...'))
    .catch((err) => console.log({ err }));
};

module.exports = connectDb;
