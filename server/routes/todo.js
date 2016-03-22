var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var todos = express.Router();
var pg = require('pg');
var randomNumber = require('./customModule.js');

var app = express();


var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/todo';
}


todos.post('/', function(req, res) {

  console.log('body: ', req.body);
  var item = req.body.item;
  var description = req.body.description;
  var money = "."+randomNumber(1,5);

  console.log('money before parseFloat: ', money);
  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];


      var query = client.query('INSERT INTO todos (item, description, money) VALUES ($1,$2,$3) ' +
                                'RETURNING id, item, description, money', [ item, description, money]);

      query.on('row', function(row){
        result.push(row);
      });
       money = "."+randomNumber(1,5);

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});


todos.get('/', function(req, res) {


  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];


      var query = client.query('SELECT * FROM todos ORDER BY id DESC;');

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        return res.json(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});



todos.put('/', function(req, res) {

  console.log('body: ', req.body);
  var id = req.body.id;
  var completed = req.body.completed;




  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];


                                // SQL Query > Update Data
      var query = client.query("UPDATE todos SET completed=($1) WHERE id=($2)", [completed, id]);

      // SQL Query > Update Data
// var query = client.query("UPDATE todos SET item=($1), discription=($2), completed=($3) WHERE id=($4)", [item, discription, completed, id]);



      query.on('row', function(row){
        result.push(row);
      });
      // quantity = randomNumber;

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});


todos.delete('/', function(req, res) {
  console.log('body: ', req.body);
  var id = req.body.id;

  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];


      // var query = client.query('DELETE FROM todos USING id WHERE id = id;');
      var query = client.query("DELETE FROM todos WHERE id=($1)", [id]);

      // DELETE FROM films USING producers WHERE producer_id = producers.id
      // DELETE FROM todos USING id WHERE id = id;'
      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        return res.json(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

module.exports = todos;
