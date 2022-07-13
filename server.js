const express = require('express');
const bodyParser = require('body-parser'); //Body parser Deprecated!
const cors = require('cors');
const Users = require('./Controllers/Users');
const path = require('path');




const app = express();
app.use(cors())
app.use(express.json()); // Has body-parser!

// set the port

const port = process.env.PORT || 8082;

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/split-payments/compute', (req,res) => {Users.Users(req,res)})



app.listen( port, () => {
  console.log( `server running http://localhost:${ port }` );
  console.log( `press CTRL+C to stop server` );
});
