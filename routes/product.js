var express = require('express');
var router = express.Router();
var multer = require('multer');
var exphbs = require('express-handlebars');
// Get Product

var Product = require('../models/product');
var Device = require('../models/device');
var File = require('../models/files');



function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		isLogin = true;
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}


var storage = multer.diskStorage({
	destination: function (request, file, callback) {
	  callback(null,'./uploads');
	},
	filename: function (request, file, callback) {
	  console.log(file);
	  callback(null, Date.now()+"-"+file.originalname)
	}
});





var upload = multer({storage: storage}).array('uploadedImages', 5);
router.get('/',ensureAuthenticated, function(req, res){

	Product.productList(function(err, product){
		if(err) throw err;
		console.log("product list ===========",product);
		res.render('product-view',{'productList' : product});  
	});
});

router.get('/product-add',ensureAuthenticated ,function(req, res){
	res.render('product-add');
});

router.get('/:productId/device-assign-to-product',ensureAuthenticated, function(req, res){
	var deviceList = [];

	Device.deviceList(function(err, device){
		console.log("req param===",req.params);
		if(err){
			throw err;
		}else{
			
			Product.getProductDetails(req.params.productId, function(err, productDetails){
				
				device.forEach(element => {
						var objectCreation = {};
						if(productDetails.deviceId.indexOf(element._id) != -1){
							objectCreation.isChecked = true;
						}else{
							objectCreation.isChecked = false;
						}
						objectCreation.deviceName = element.deviceName;
						objectCreation._id = element._id;
						deviceList.push(objectCreation);
				});
				console.log("device list..",deviceList);
				//console.log("key-==",key);

				res.render('assign-device',{'deviceList' : deviceList, productId : req.params.productId}); 

			});
		}
	});
});

router.post('/device-assign-update/:productId',ensureAuthenticated, function(req, res){
	
	console.log("assign update===",req.params);

	Product.assignDeviceToProduct(req.params.productId,req.body,function(err, product){
		console.log("assign update===",product);
		res.redirect('/product');
	});
	
});

router.get('/:productId/file-view',ensureAuthenticated, function(req, res){

	filesArray = [];	
	File.fileList(function(err, file){
	
		if(err){ throw err;
		}else{
			file.forEach((element)=>{
				filesObj = {};
				filesObj['name'] = element.name;
				filesObj['fileType'] = element.fileType;
				filesObj['url'] = element.url;
				filesObj['size'] = element.size;
				filesObj['productId'] = element.productId;
				filesObj['_id'] = element._id;
				if(element.fileType.split('/')[0] == "image"){
					filesObj['isImage'] = true;
				}else{
					filesObj['isImage'] = false;
				}
				filesArray.push(filesObj);
			});
		}
		console.log("product list ===========",filesArray);
		
		res.render('file-view',{'product_file_Id':req.params.productId,'fileList':filesArray});
	});
});


router.get('/:productId/file-add', ensureAuthenticated,function(req, res){

	res.render('file-add',{'productId':req.params.productId});
});


router.post('/:productId/create-files',ensureAuthenticated, function(req, res){
	
	filesArray = [];
	
	upload(req, res, function(err) {
		if(err) {
		  console.log('Error Occured',err);
		  return;
		}

		if(req.files){

				req.files.forEach((element)=>{

					var fileObj = new File({
						name : element.filename,
						fileType : element.mimetype,
						url : element.filename,
						size : element.size,
						productId : req.params.productId
						});

						File.createFiles(fileObj,function(err, file){
							if(err) throw err;
							console.log("sucess===========",file);
						});

				});	

		}

		// request.files is an object where fieldname is the key and value is the array of files 
	
		console.log(req.files);
		res.end('Your Files Uploaded');
		console.log('Photo Uploaded');
	});
	req.flash('success_msg', "Your Record has been Created");
	res.redirect('/product/'+req.params.productId+'/'+'file-view');
});


router.post('/create', ensureAuthenticated,function(req, res){

	console.log("request data====",req.body);

	if(req.body.productId  == null){	

	var productObj = new Product({
			name : req.body.name,
  			type: req.body.type,
  			ads_location: req.body.ads_location,
			ads_period: req.body.ads_period
			});

	console.log("response data make ====",productObj);
	Product.createProduct(productObj,function(err, product){
		if(err) throw err;
		console.log("sucess===========",product);
	});
	req.flash('success_msg', "Your Record has been Saved");
	}else{
		var productObj = {
			name : req.body.name,
  			type: req.body.type,
  			ads_location: req.body.ads_location,
			ads_period: req.body.ads_period
			};

			Product.update(req.body.productId,productObj,function(err, product){
				if(err) throw err;
				console.log("sucess===========",product);
			});
			req.flash('success_msg', "Your Record has been Updated");
	}

	res.redirect('/product');
});


router.get('/:productId/files-assign/:fileId', ensureAuthenticated,function(req, res){

	File.fileDetails(req.params.fileId,function(err, file){

				filesObj = {};
				filesObj['name'] = file.name;
				filesObj['fileType'] = file.fileType;
				filesObj['url'] = file.url;
				filesObj['size'] = file.size;
				filesObj['productId'] = file.productId;
				filesObj['_id'] = file._id;
				if(file.fileType.split('/')[0] == "image"){
					filesObj['isImage'] = true;
				}else{
					filesObj['isImage'] = false;
				}
				console.log("filesobj",filesObj);

				Device.deviceList(function(err, device){
					console.log("req param===",req.params);
					if(err){
						throw err;
					}else{
						res.render('file-assign',{'productId':req.params.productId,'fileId':req.params.fileId,'fileDetails':filesObj,'deviceList':device});
					}
				});

	});


	

	
});


router.post('/:productId/files-assign/:fileId/files-update-duration', ensureAuthenticated,function(req, res){
		console.log("request data",req.body);
	 File.updateFilesDuration(req.params.fileId,req.body,function(err, file){

		console.log("update data ==",file);
	}); 
	req.flash('success_msg', "Your Record has been Updated");
	res.redirect('/product/'+req.params.productId+'/file-view');

});

router.get('/:productId/update-view',ensureAuthenticated, function(req, res){

	Product.getProductDetails(req.params.productId,function(err,product){
		res.render('product-add',{'productDetails':product});
	});
});

router.get('/:productId/update-view/:fileId',ensureAuthenticated, function(req, res){

	File.getFileDetails(req.params.fileId,function(err,file){
		res.render('file-add',{'fileDetails':file,'productId':req.params.productId});
	});
});

router.post('/:fileId/file-delete',ensureAuthenticated, function(req, res){
	
	File.delete(req.params.fileId,function(err,file){
		res.redirect('/product/'+req.body.productId+'/file-view');
	});
	req.flash('error_msg', "Your Record has been Deleted");
});

router.post('/:productId/product-delete',ensureAuthenticated, function(req, res){
	
	Product.delete(req.params.productId,function(err,product){
			res.redirect('/product');
	});
	req.flash('error_msg', "Your Record has been Deleted");
});

module.exports = router;