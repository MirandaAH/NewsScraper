var express = require("express");
var exphbs = require('express-handlebars');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");
var Article = require('./models/Article.js');
var Note = require('./models/Note.js');

mongoose.Promise = Promise;

var app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost/NewsScraper");

var db = mongoose.connection;
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});


//Routes
app.get('/', function(req,res){
  res.render('home');
});


var results=[];
  //NYT Scraper
app.get('/scrape', function(req, res){

  request("https://www.nytimes.com/", function(error, response, html) {

      var $ = cheerio.load(html);
      $("h2.story-heading").each(function(i, element) {

        var title = $(element).text();
        var link = $(element).children("a").attr("href");
        results.push({
          id: i,
          title: title,
          link: link
        });
      });
      res.render("article", {results: results});
  });
});
    //Save Article
app.get('/save/:id', function(req, res){
  var id = req.params.id;

  var entry = new Article(results[id]);
  entry.save(function(err,doc){
    if(err){
      console.log(err);
    }
    else {
      console.log(doc);
    }
  });
})
    //Get
app.get('/saved', function(req, res){
  Article.find({}, function(error, doc){
    if(error){
      console.log(error);
    }
    else {
      res.json(doc);
      console.log(doc);
    }
  })
});






app.listen(3000, function(){
  console.log("App running on port 3000!")
});
