var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var todo = require('./routes/todo');


var app = express();

var port = process.env.PORT || 3003;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/todo', todo);

// GET/POST/PUT CALLS
var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/todo';
}

pg.connect(connectionString, function(err, client, done){
  if (err) {
    console.log('Error connecting to DB!', err);
    
  } else {
    var query = client.query('CREATE TABLE IF NOT EXISTS todos (' +
                              'id SERIAL PRIMARY KEY,' +
                              'item varchar(180) NOT NULL,' +
                              'description varchar(10000) NOT NULL);'
  );
    query.on('end', function(){
      console.log('Successfully ensured schema exists');
      done();
    });

    query.on('error', function(error) {
      console.log('Error creating schema!', error);

      done();
    });
  }
});






app.get('/*', function(req, res){
  var filename = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '/public/', filename));
});

app.listen(port, function(){
  console.log('Listening for requests on port', port);
});
