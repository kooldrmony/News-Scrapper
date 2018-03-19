//This section sets up all the variables that require all of the npm packages and folders needed for this file
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var request = require('request');

var PORT = 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://<dbuser>:<dbpassword>@ds215089.mlab.com:15089/heroku_pl1nb0sf";

// This section iInitializes the Express npm package
var app = express();

// This section sets up the middleware that is to be used 

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// This section sets up the connection to the "si" database in MongoDB by passing in the MONGODB_URI variable from above
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// This section sets up the routes that are to be used/called

// This section sets up a "scrape" GET route for scraping stories from the SportsIllustrated website
//Using axios and cheerio
app.get("/scrape", function(req, res) {

  request('http://www.si.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.

  // axios.get("http://www.si.com/").then(function(response) {
  
    var $ = cheerio.load(response.data);

    // This section sets up what to scrape from the website
    $("article h2").each(function(i, element) {
      
      var result = {};

      // This section sets up to return the headline and url for every story scraped
      result.headline = $(this)
        .children("a")
        .text();
      result.summary = $(this)
        .parent("div")
        .text();
      result.url = $(this)
        .children("a")
        .attr("href");

      // This section creates a new story witht the information set up above
      db.Story.create(result)
        .then(function(dbStory) {
      
          console.log(dbStory);
        })
        .catch(function(err) {
          // This section sets up a catch function to return an error message to the client if one is encountered
          return res.json(err);
        });
    });

    // This section sets up a message to be displayed if scrape was successful if no error was found
    res.send("Scrape Complete");
  });
});

// This section sets up a get route to find all of the stories in the database
app.get("/stories", function(req, res) {
  
  db.Story.find({})
    .then(function(dbStory) {
    
      res.json(dbStory);
    })
    .catch(function(err) {
    
      res.json(err);
    });
});

// This section sets up another get route for grabbing a specific story by searching by id
app.get("/stories/:id", function(req, res) {
  
    db.Story.findOne({ _id: req.params.id })
    // This section populates a comment if one was associated with the selected comment
    .populate("comment")
    .then(function(dbStory) {
      
      res.json(dbStory);
    })
    .catch(function(err) {
      
      res.json(err);
    });
});

// This section sets up a post route that will allow for updating a comment
app.post("/stories/:id", function(req, res) {
  // This section creates a new comment
  db.Comment.create(req.body)
    .then(function(dbComment) {
      
      return db.Story.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
    })
    .then(function(dbStory) {
      
      res.json(dbStory);
    })
    .catch(function(err) {
      
      res.json(err);
    });
});

// This section sets up the app.listen function that enables the server
app.listen(process.env.PORT || 3000, function() {
  console.log("App running on port " + PORT + "!");
});
