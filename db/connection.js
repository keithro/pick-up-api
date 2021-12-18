const mongoose = require('mongoose');

// set the uri for connecting to our local mongodb
let mongoURI = ''

if (process.env.NODE_ENV === "production") {
  mongoURI = process.env.DB_URL;
} else {
  mongoURI = "mongodb://127.0.0.1/pickup-api";
}

mongoose.connect(mongoURI)
  .then((instance) => {
    console.log(`Connected to db: ${instance.connections[0].name}`)
  })
  .catch((e) => console.log('DB connection failed', e))


// mongoose.connect('mongodb://127.0.0.1/pickup-api')
// .then(() => console.log('MongoDB Connected Guy'))
// .catch((e) => console.log('DB connection failed', e))

module.exports = mongoose;
