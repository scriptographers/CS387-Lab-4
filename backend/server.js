const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// test route
app.get("/", (req, res) => {
  console.log(req.query); // Try /?skip=0&limit=10
  res.json({ message: "Backend works" });
});

// set port as 4000 and listen for requests
app.listen(4000, () => {
  console.log(`Server is running on http://localhost:4000`);
});
