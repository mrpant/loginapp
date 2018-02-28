var express = require('express');
var multer = require('multer');
var router = express.Router();


var storage = multer.diskStorage({
	destination: function (request, file, callback) {
	  callback(null,'./uploads');
	},
	filename: function (request, file, callback) {
	  console.log(file);
	  callback(null, file.originalname)
	}
});

var upload = multer({storage: storage}).array('uploadedImages', 5);

// Get Files
router.get('/', function(req, res){
	res.render('file-view');  
});

router.get('/file-add', function(req, res){
	res.render('file-add');
});


router.post('/create', function(req, res){
	

	upload(req, res, function(err) {
		if(err) {
		  console.log('Error Occured',err);
		  return;
		}
		// request.files is an object where fieldname is the key and value is the array of files 
		console.log(req.files);
		res.end('Your Files Uploaded');
		console.log('Photo Uploaded');
	});

	res.redirect('/file');
});



module.exports = router;