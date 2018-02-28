var express = require('express');
var router = express.Router();
var isLogin = false;
// Get Homepage
var Device = require('../models/device');

router.get('/', ensureAuthenticated, function(req, res){
	Device.deviceList(function(err, device){
		console.log("req param===",device);
		if(err){
			throw err;
		}else{
			res.render('device-view',{'deviceList' : device});  
		}
	});
});

// Login
router.get('/login',function(req, res){
	if(isLogin){
		res.redirect('/');
	}else{
		res.render('login');
	}
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		isLogin = true;
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		//res.redirect('/login');
		res.render('login');
	}
}

module.exports = router;