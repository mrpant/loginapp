var express = require('express');
var router = express.Router();

// Get Company

var Company = require('../models/company');
var Product = require('../models/product');

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		isLogin = true;
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}

router.get('/',ensureAuthenticated, function(req, res){

	Company.companyList(function(err, company){
		console.log("req param===",company);
		if(err){
			throw err;
		
		}else{
			
			res.render('company-view',{'companyList':company});   
		}
	});

});

router.get('/company-add',ensureAuthenticated, function(req, res){
	res.render('company-add');
});

router.get('/:companyId/product-assign-to-company',ensureAuthenticated, function(req, res){
	var companyList = [];

	Product.productList(function(err, product){
		console.log("req param===",req.params);
		if(err){
			throw err;
		}else{
			
			Company.getCompanyDetails(req.params.companyId, function(err, companyDetails){
				
				product.forEach(element => {
						var objectCreation = {};
						if(companyDetails.productId.indexOf(element._id) != -1){
							objectCreation.isChecked = true;
						}else{
							objectCreation.isChecked = false;
						}
						objectCreation.name = element.name;
						objectCreation._id = element._id;
						companyList.push(objectCreation);
				});
				console.log("company list..",companyList);
				//console.log("key-==",key);

				res.render('assign-product',{'companyList' : companyList, companyId : req.params.companyId}); 

			});
		}
	});
});



router.post('/product-assign-update/:companyId',ensureAuthenticated, function(req, res){
	
	console.log("assign update company===",req.body);

	Company.assignProductToCompany(req.params.companyId,req.body,function(err, company){
		console.log("assign update===",company);
		res.redirect('/company');
	});

});

router.post('/create',ensureAuthenticated, function(req, res){

	console.log("request data====",req.body);

	if(req.body.companyId  == null){

	var companyObj = new Company({
			name : req.body.name,
  			email: req.body.email,
  			country: req.body.email,
			location: req.body.location,
			phone : req.body.phone,
			website :  req.body.website  
			});

	console.log("response data make ====",companyObj);
	Company.createCompany(companyObj,function(err, company){
		if(err) throw err;
		console.log("sucess===========",company);
	});

	req.flash('success_msg', "Your Record has been saved");

	}else{

		var companyObj = {
			name : req.body.name,
  			email: req.body.email,
  			country: req.body.email,
			location: req.body.location,
			phone : req.body.phone,
			website :  req.body.website  
			};

	console.log("response data make ====",companyObj);
	Company.update(req.body.companyId,companyObj,function(err, company){
		if(err) throw err;
		console.log("sucess===========",company);
	});

	req.flash('success_msg', "Your Record has been Updated");

	}

	res.redirect('/company');
});


router.get('/:companyId/update-view',ensureAuthenticated, function(req, res){

	Company.getCompanyDetails(req.params.companyId,function(err,company){
		res.render('company-add',{'companyDetails':company});
	});
});


router.post('/:companyId/delete',ensureAuthenticated, function(req, res){
	
	Company.delete(req.params.companyId,function(err,company){
			res.redirect('/company');
	});

	req.flash('error_msg', "Your Record has been Deleted");
});


module.exports = router;