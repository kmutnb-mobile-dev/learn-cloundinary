var cloudinary = require('cloudinary');
var express = require('express');
var fs = require('fs');
var multer = require('multer');
var app = express();

cloudinary.config({
  cloud_name: 'fitm',
  api_key: '418999862618864',
  api_secret: 'jf8C-q43_U0IovGmjg0su29kRqs'
});


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(multer({
  dest: './uploads/'
}));

app.post('/upload', function(request, response) {
  console.log(request.files.image.path);


  stream = cloudinary.uploader.upload_stream(function(result) {
    console.log(result);
    response.send('Done:<br/> <img src="' + result.url + '"/><br/>' +
      cloudinary.image(result.public_id, {
        format: "png",
        width: 100,
        height: 130,
        crop: "fill"
      }));
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