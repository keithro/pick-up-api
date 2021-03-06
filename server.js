require('dotenv').config();
const express = require('express');
// const morgan = require('morgan');
const cors = require('cors');

const usersController = require('./controllers/usersController');
const eventsController = require('./controllers/eventsController');
const authController = require('./controllers/authController');

// CREATE A NEW INSTANCE OF EXPRESS
const app = express();

const PORT = process.env.PORT;


// MIDDLEWARE
app.use(cors());
// Parses incoming URL-encoded data:
app.use(express.urlencoded({ extended: false }));
// Parses incoming JSON-encoded data from req.body:
app.use(express.json());
// app.use(morgan('combined'));


// ROUTES
app.get('/', (req, res)=>{
  res.send('pick-up api');
  // res.redirect('/events')
});

app.use('/user', usersController);
app.use('/events', eventsController);
app.use('/auth', authController);


// ACTIVATE THE SERVER TO LISTEN ON THE PORT
// app.listen(PORT, () => {
//   console.log(`Express server listening on port ${PORT}`);
// });


app.set("port", process.env.PORT || 4000);

app.listen(app.get("port"), () => {
  console.log(`✅ PORT: ${app.get("port")} 🌟`);
});