const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/pickup-api')
.then(() => console.log('MongoDB Connected Guy'))
.catch((e) => console.log(e))

module.exports = mongoose;
