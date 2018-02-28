var express = require('express');
var router = express.Router();
var Device = require('../models/device');
var Scheduler = require('../models/scheduler');
// Get Scheduler
router.get('/',ensureAuthenticated, function(req, res){

	schedulerList =  [];
	Scheduler.schedulerList(function(err,scheduler){
		if(err){
		throw err;
		}else{
		console.log("sche==",scheduler);
		res.render('schedule-view',{'schedulerList':scheduler});
		}
	});

});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		isLogin = true;
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}

router.get('/scheduler-add',ensureAuthenticated, function(req, res){

	Device.deviceList(function(err, device){
		console.log("req param===",req.params);
		if(err){
			throw err;
		}else{
			res.render('schedule-add',{'deviceList':device});
		}
	});
	
});


router.post('/create',ensureAuthenticated, function(req, res){

	console.log("request data====",req.body);

	if(req.body.schedulerId  == null){	


	req.body.deviceId.forEach(element => {
		

		var schedulerObj = new Scheduler({
			scheduleDate : req.body.scheduleDate,
  			deviceId: element
			});

			console.log("response data make ====",schedulerObj);
			Scheduler.createScheduler(schedulerObj,function(err, scheduler){
				if(err) throw err;
				console.log("sucess===========",scheduler);
			});

		});	


		req.flash('success_msg', "Your Record has been Saved");

	}else{

		var schedulerObj = {
			scheduleDate : req.body.scheduleDate,
  			deviceId: req.body.deviceId
			};

			Scheduler.update(req.body.schedulerId,schedulerObj,function(err, scheduler){
				if(err) throw err;
				console.log("sucess===========",scheduler);
			});
	}
//	req.flash('success_msg', "Your Record has been Updated");
	res.redirect('/scheduler');
});


router.get('/:schedulerId/update-view',ensureAuthenticated, function(req, res){

	Scheduler.getSchedulerDetails(req.params.schedulerId,function(err,scheduler){
		console.log("render",scheduler);


		res.render('schedule-add',{'schedulerDetails':scheduler});
	});
});

router.post('/:schedulerId/delete',ensureAuthenticated, function(req, res){
	
	Scheduler.delete(req.params.schedulerId,function(err,scheduler){
			res.redirect('/scheduler');
	});

	req.flash('error_msg', "Your Record has been Deleted");
		
});



module.exports = router;