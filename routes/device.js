var express = require('express');
var router = express.Router();

var Device = require('../models/device');

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		isLogin = true;
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}

// Get Device
router.get('/',ensureAuthenticated, function(req, res){
	console.log("sdadssadaad");
	Device.deviceList(function(err, device){
		console.log("req param===",device);
		if(err){
			throw err;
		}else{
			res.render('device-view',{'deviceList' : device});  
		}
	});

});

router.get('/device-add',ensureAuthenticated, function(req, res){
	res.render('device-add');
});



router.post('/create',ensureAuthenticated, function(req, res){
		console.log("request data====",req.body);
	
	if(req.body.deviceId  == null){	

			var deviceObj = new Device({
					cordinates: { longitude: req.body.longitude, latitude:  req.body.latitude },
					deviceName: req.body.deviceName,
					status: '1',
					location: req.body.location,
					});

	console.log("response data make ====",deviceObj);
		Device.createDevice(deviceObj,function(err, device){
			if(err) throw err;
			console.log("sucess===========",device);
		});
		req.flash('success_msg', "Your Record has been saved");
	}else{

		var deviceObj = {
			cordinates: { longitude: req.body.longitude, latitude:  req.body.latitude },
			deviceName: req.body.deviceName,
			status: '1',
			location: req.body.location,
		};
		Device.update(req.body.deviceId,deviceObj,function(err, device){
			if(err) throw err;
			console.log("sucess===========",device);
		});
		req.flash('success_msg', "Your Record has been Updated");
	}


			res.redirect('/');
});


router.post('/:deviceId/delete',ensureAuthenticated, function(req, res){
	
	Device.delete(req.params.deviceId,function(err,device){
			res.redirect('/');
	});
	req.flash('error_msg', "Your Record has been Deleted");
});

router.get('/:deviceId/update-view',ensureAuthenticated, function(req, res){

	Device.getDeviceDetails(req.params.deviceId,function(err,device){
		res.render('device-add',{'deviceDetails':device});
	})


});

module.exports = router;