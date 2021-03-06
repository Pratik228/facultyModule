const express = require("express");
const app = express();

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "faculty_module",
});
connection.connect(function (err) {
  if (!err) {
    console.log("Database is connected ...");
  } else {
    console.log("Error connecting database ...");
  }
});

// Setting public direction
app.use(express.static(__dirname + "/public"));
// Set ejs template
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.render('home');
});

// Login Page
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { id, password } = req.body;
  console.log(id, password);

  connection.query("SELECT * FROM Faculty WHERE id = ?", [id], function (
    error,
    results,
    fields
  ) {
    if (error) {
      res.send({
        code: 400,
        failed: "error ocurred",
      });
    } else {
      if (results.length > 0) {
        const comparision = password === results[0].password;
        if (comparision) {
          res.send({
            code: 200,
            success: "login sucessfull",
          });
        } else {
          res.send({
            code: 204,
            success: "Id and password does not match",
          });
        }
      } else {
        res.send({
          code: 206,
          success: "Id does not exits",
        });
      }
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  connection.query("INSERT INTO Faculty SET ?", req.body, function (
    error,
    results,
    fields
  ) {
    if (error) {
      res.send({
        code: 400,
        failed: "error ocurred",
      });
    } else {
      //   res.send({
      //     code: 200,
      //     success: "user registered sucessfully",
      //   });
      res.redirect("/login");
    }
  });
});



// Fields Routes
// Faculty Events Attended Page
app.get('/faculty/eventsAttended', (req,res)=>{
  res.render('fields/fac_eventsAttended');
})

// Faculty Club Activities Page
app.get('/faculty/clubActivities', (req,res)=>{
  res.render('fields/fac_clubActivities');
})

// Faculty Awards Page
app.get('/faculty/Awards', (req,res)=>{
  res.render('fields/fac_awards');
})












// Server Running at port 3000
app.listen("3000", () => {
  console.log("Server Started ... http://localhost:3000");
});
