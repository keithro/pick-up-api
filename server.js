require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');


// CREATE A NEW INSTANCE OF EXPRESS
const app = express();

const PORT = process.env.PORT;


// MIDDLEWARE
app.use(cors());
// Parses incoming URL-encoded data:
app.use(express.urlencoded({ extended: false }));
// Parses incoming JSON-encoded data:
app.use(express.json());
app.use(morgan('combined'));


// ROUTES
app.get('/', (req, res)=>{
  // console.log('REQUEST: ', req)
  // console.log('RESPONSE: ', res)
  res.send('<h1>HOLA PINCHE MUNDO!</h1>');
});


// ACTIVATE THE SERVER TO LISTEN ON THE PORT
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});