var express = require('express');
var router = express.Router();


var Product = require('../models/product');
var Device = require('../models/device');
var File = require('../models/files');
var Company = require('../models/company');
var Playlist = require('../models/playlist');
var Scheduler = require('../models/scheduler');

router.get('/device-list', function(req, res){
    Device.deviceList(function(err, device){
		console.log("req param===",device);
		if(err){
			throw err;
		}else{
           var  response = {};
            if(device != null){
                response['status'] = true;
                response['data'] = device;
                response['msg'] = "Successfully Listed";
            }else{
                response['status'] = false;
                response['data'] = null;
                response['msg'] = "Please try Again!!";
            }
          res.send(response);
        }
	});
  
});

router.get('/company-product', function(req, res){

       Company.companyAndProduct(function(err, data){
		console.log("req param===",data);
		if(err){
			throw err;
		}else{
           var  response = {};
            if(data != null){
                response['status'] = true;
                response['data'] = data;
                response['msg'] = "Successfully Listed";
            }else{
                response['status'] = false;
                response['data'] = null;
                response['msg'] = "Please try Again!!";
            }
          res.send(response);
          
        }
	});
  
});


router.get('/playlist', function(req, res){

    Playlist.playlistCall(function(err, data){
		console.log("req param===",data);
		if(err){
			throw err;
		}else{
           var  response = {};
            if(data != null){
                response['status'] = true;
                response['data'] = data;
                response['msg'] = "Successfully Listed";
            }else{
                response['status'] = false;
                response['data'] = null;
                response['msg'] = "Please try Again!!";
            }
          res.send(response);
          
        }
	});
  
});


router.get('/scheduler', function(req, res){
    var list = [];
    Scheduler.schedulerListCall(function(err, data){
		console.log("req param===",data);
		if(err){
			throw err;
		}else{
          /*  var  response = {};
            if(data != null){
                response['status'] = true;
                response['data'] = data;
                response['msg'] = "Successfully Listed";
            }else{
                response['status'] = false;
                response['data'] = null;
                response['msg'] = "Please try Again!!";
            } */

        /*   var deviceList = [];
            data.forEach(element => {
                var listObj = {};
                listObj['_id'] = element._id;

                    element.device.forEach(device => {




                    });

            }); */
          
            
          res.send(data);
          
        }
	});
  
});


module.exports = router;