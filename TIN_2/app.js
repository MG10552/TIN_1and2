/* jshint devel: true, node: true */
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var judges = [];

app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.jsonp({
      'Status': "OK"
            });
});

app.post("/api/judge", function (req, res) {
    res.json({
        "Status": req.body.lname
    });
});

var server = app.listen(3000, function () {
        console.log("Server -> port_3000");
});

//TODO: zrobić sędziów dodaj do mongo, odczytaj, usuń, edytuj RESTem, HTTP

var mongo = require('mongodb');

var MongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost:3000/server1';

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);

    var collection = db.collection('judges');

    var judge1 = {name: 'a', lname: 'b'};
    var judge2 = {name: 'c', lname: 'd'};
    var judge3 = {name: 'e', lname: 'f'};

    collection.post([judge1, judge2, judge3], function (err, result) {
         if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d into judges with "_id":', result.length, result);
      }
      db.close();
    });
  }

/*if ()
console.log("ERROR, cannot add judge. Judge with such name might already exist.")
else
console.log("New Judges has been added");
*/
