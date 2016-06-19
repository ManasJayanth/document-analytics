var express = require('express');
var router = express.Router();
var multer  = require('multer');
var http = require('http');

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/assets/pdfs');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});


var upload = multer({ storage : storage}).single('pdfFile');
router.put('/api/pdf', upload, function(req, res, next) {
  res.status(200).send(req.file.filename);
});


router.put('/api/email', upload, function(req, res, next) {
  // ping `http://ipinfo.io/${req.connection.remoteAddress}` and get location
  http.get(`http://ipinfo.io/${req.connection.remoteAddress}`, ipinfoResponse => {
    let buf = '';
    ipinfoResponse.on('data', chunk => {
      buf += chunk;
    });
    ipinfoResponse.on('end', chunk => {
      console.log(JSON.parse(buf));
    });
  });
  res.status(200).send(req.body.email);
});

module.exports = router;
