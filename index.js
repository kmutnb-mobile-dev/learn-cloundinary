var cloudinary = require('cloudinary');
var express = require('express');
var fs = require('fs');
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var format = require('util').format;

var app = express();

cloudinary.config({
  cloud_name: 'fitm',
  api_key: '418999862618864',
  api_secret: 'jf8C-q43_U0IovGmjg0su29kRqs'
});

var imagesDB = null;
MongoClient.connect('mongodb://root:1234@kahana.mongohq.com:10093/bikrme', function(err, db) {
  if (err) throw err;
  imagesDB = db.collection('images');
});


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(multer({
  dest: './uploads/'
}));

app.get('/images', function(request, res) {
  imagesDB.find().toArray(function(err, results) {
    if (err) res.send({
      error: 1
    });
    else res.send(results);
  });
});

app.post('/upload', function(request, response) {
  console.log(request.files.image.path);
  stream = cloudinary.uploader.upload_stream(function(result) {
    imagesDB.insert(result, function(err, docs) {
      if (err) response.send({
        error: 1
      });
      else {
        fs.unlink('./'+request.files.image.path, function(err) {
          if (err) throw err;
          console.log('successfully deleted /tmp/hello');
        });
        response.redirect('/index.html');
      }
    });
  }, {
    public_id: request.body.title
  });

  fs.createReadStream(request.files.image.path, {
    encoding: 'binary'
  }).on('data', stream.write).on('end', stream.end);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});