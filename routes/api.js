var express = require('express');
var router = express.Router();
var multer = require('multer');
var Product = require('../models/product');
var Device = require('../models/device');
var File = require('../models/files');
var Company = require('../models/company');
var Playlist = require('../models/playlist');
var Scheduler = require('../models/scheduler');





var storage = multer.diskStorage({
	destination: function (request, file, callback) {
	  callback(null,'./uploads');
	},
	filename: function (request, file, callback) {
	  console.log(file);
	  callback(null, Date.now()+"-"+file.originalname)
	}
});

var upload = multer({storage: storage}).array('uploadedImages', 50);

/*
@params : 
action : device-list
method : GET
*/

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

/*
@params : 
action : device-add
Method : POST
longitude : String
latitude : String
deviceName : String
location : String
deviceId : Number (Only Case on Edit) -- Optional
*/

router.post('/device-add', function(req, res){

          console.log("response data make ====",req.body);

           
        if(req.body.deviceId  == null){	

                var deviceObj = new Device({
                        cordinates: { longitude: req.body.longitude, latitude:  req.body.latitude },
                        deviceName: req.body.deviceName,
                        status: '1',
                        location: req.body.location,
                        });

        console.log("response data make ====",deviceObj);
            Device.createDevice(deviceObj,function(err, device){
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
         
        }else{

            var deviceObj = {
                cordinates: { longitude: req.body.longitude, latitude:  req.body.latitude },
                deviceName: req.body.deviceName,
                status: '1',
                location: req.body.location,
            };
            Device.update(req.body.deviceId,deviceObj,function(err, device){
                if(err){
                    throw err;
                }else{
                   var  response = {};
                    if(data != null){
                        response['status'] = true;
                        response['data'] = device;
                        response['msg'] = "Successfully Updated";
                    }else{
                        response['status'] = false;
                        response['data'] = null;
                        response['msg'] = "Please try Again!!";
                    }
                     res.send(response);
                  
                }
            });
          
        } 
});

/*
@params : 
action : device-delete
Method : POST
deviceId : deviceId
*/


router.post('device-delete', function(req, res){
	
	Device.delete(req.body.deviceId,function(err,device){
        if(err){
            throw err;
        }else{
           var  response = {};
            if(data != null){
                response['status'] = true;
                response['data'] = device;
                response['msg'] = "Successfully Deleted";
            }else{
                response['status'] = false;
                response['data'] = null;
                response['msg'] = "Please try Again!!";
            }
             res.send(response);
          
        }
	});
});

/*
@params : 
action : product-create
Method : POST
name : String
type : String
ads_location : String
ads_period : String
productId : Number (Only Case on Edit) -- Optional
*/

router.post('product-create',function(req, res){

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
		if(err){
            throw err;
        }else{
           var  response = {};
            if(data != null){
                response['status'] = true;
                response['data'] = product;
                response['msg'] = "Successfully Added";
            }else{
                response['status'] = false;
                response['data'] = null;
                response['msg'] = "Please try Again!!";
            }
             res.send(response);
          
        }
	});

	}else{
		var productObj = {
			name : req.body.name,
  			type: req.body.type,
  			ads_location: req.body.ads_location,
			ads_period: req.body.ads_period
			};

			Product.update(req.body.productId,productObj,function(err, product){
				if(err){
                    throw err;
                }else{
                   var  response = {};
                    if(data != null){
                        response['status'] = true;
                        response['data'] = product;
                        response['msg'] = "Successfully Updated";
                    }else{
                        response['status'] = false;
                        response['data'] = null;
                        response['msg'] = "Please try Again!!";
                    }
                     res.send(response);
                }
			});
			
	}


});


/*
@params : 
action : product-delete
Method : POST
productId : Number 
*/

router.post('product-delete', function(req, res){
	
	Product.delete(req.body.productId,function(err,product){
        if(err){
            throw err;
        }else{
           var  response = {};
            if(data != null){
                response['status'] = true;
                response['data'] = product;
                response['msg'] = "Successfully Deleted";
            }else{
                response['status'] = false;
                response['data'] = null;
                response['msg'] = "Please try Again!!";
            }
             res.send(response);
        }
	});
});


/*
@params : 
action : files-add
Method : POST
files[] : Array
*/

router.post('files-add', function(req, res){
	
	filesArray = [];
	
	upload(req, res, function(err) {
		if(err) {
		  console.log('Error Occured',err);
		  return;
		}

		if(req.files){
                var i = 1;
				req.files.forEach((element)=>{

					var fileObj = new File({
						name : element.filename,
						fileType : element.mimetype,
						url : element.filename,
						size : element.size,
						productId : req.body.productId
						});

						File.createFiles(fileObj,function(err, file){
							if(err) throw err;
							console.log("sucess===========",file);
						});
                        i++;
                });	
                

                if(req.files.length == i){
                var  response = {};
                    if(data != null){
                        response['status'] = true;
                        response['msg'] = "Successfully Added";
                    }else{
                        response['status'] = false;
                        response['msg'] = "Please try Again!!";
                    }
                  res.send(response);
                }

		}

		console.log(req.files);
		//res.end('Your Files Uploaded');
		console.log('Photo Uploaded');
	});
});

/*
@params : 
action : files-update-duration
Method : POST
deviceId : String
min : String
sec : String
start : String
end : String 
fileId : Number
*/

router.post('files-update-duration',function(req, res){
    console.log("request data",req.body);
    var obj = {
        deviceId : req.body.deviceId,
        min : req.body.min,
        sec : req.body.sec,
        start: req.body.start,
        end : req.body.end
    };

        File.updateFilesDuration(req.body.fileId,obj,function(err, file){

            if(err){
                throw err;
            }else{
               var  response = {};
                if(data != null){
                    response['status'] = true;
                    response['data'] = file;
                    response['msg'] = "Successfully Updated";
                }else{
                    response['status'] = false;
                    response['data'] = null;
                    response['msg'] = "Please try Again!!";
                }
                 res.send(response);
            }
        }); 

});



/*
@params : 
action : files-delete
Method : POST
fileId : Number
*/

router.post('file-delete', function(req, res){
	
	File.delete(req.body.fileId,function(err,file){
            
        if(err){
            throw err;
        }else{
           var  response = {};
            if(data != null){
                response['status'] = true;
                response['data'] = file;
                response['msg'] = "Successfully Deleted";
            }else{
                response['status'] = false;
                response['data'] = null;
                response['msg'] = "Please try Again!!";
            }
             res.send(response);
        }
	});

});

/*
@params : 
action : company-add
Method : POST
name : String
email : String
country : String
location : String
phone : Number
website: String
companyId :  Number (Only Case on Edit) -- Optional
*/

router.post('company-add', function(req, res){

	console.log("request data====",req.body);

	if(req.body.companyId  == null){

	var companyObj = new Company({
			name : req.body.name,
  			email: req.body.email,
  			country: req.body.country,
			location: req.body.location,
			phone : req.body.phone,
			website :  req.body.website  
			});

	console.log("response data make ====",companyObj);
	Company.createCompany(companyObj,function(err, company){
		if(err){
            throw err;
        }else{
           var  response = {};
            if(data != null){
                response['status'] = true;
                response['data'] = file;
                response['msg'] = "Successfully Added";
            }else{
                response['status'] = false;
                response['data'] = null;
                response['msg'] = "Please try Again!!";
            }
             res.send(response);
        }
	});



	}else{

		var companyObj = {
			name : req.body.name,
  			email: req.body.email,
  			country: req.body.country,
			location: req.body.location,
			phone : req.body.phone,
			website :  req.body.website  
			};

	console.log("response data make ====",companyObj);
	Company.update(req.body.companyId,companyObj,function(err, company){
		if(err){
            throw err;
        }else{
           var  response = {};
            if(data != null){
                response['status'] = true;
                response['data'] = file;
                response['msg'] = "Successfully Updated";
            }else{
                response['status'] = false;
                response['data'] = null;
                response['msg'] = "Please try Again!!";
            }
             res.send(response);
        }
    });
    
	}
});


/*
@params : 
action : company-delete
Method : POST
companyId : Number
*/

router.post('company-delete', function(req, res){
	
	Company.delete(req.params.companyId,function(err,company){
        if(err){
            throw err;
        }else{
           var  response = {};
            if(data != null){
                response['status'] = true;
                response['data'] = file;
                response['msg'] = "Successfully Deleted";
            }else{
                response['status'] = false;
                response['data'] = null;
                response['msg'] = "Please try Again!!";
            }
             res.send(response);
        }
	});
});


/*
@params : 
action : product-assign-update-by-company
Method : POST
productId[] : Array
companyId :  Number 
*/


router.post('product-assign-update-by-company', function(req, res){
	
    console.log("assign update company===",req.body);
   //pass here multiple productId of array [];
	Company.assignProductToCompany(req.body.companyId,req.body,function(err, company){
        if(err){
            throw err;
        }else{
           var  response = {};
            if(data != null){
                response['status'] = true;
                response['data'] = company;
                response['msg'] = "Successfully Updated";
            }else{
                response['status'] = false;
                response['data'] = null;
                response['msg'] = "Please try Again!!";
            }
             res.send(response);
        }
	});

});


/*
@params : 
action : company-product

*/

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

/*
@params : 
action : playlist-add
Method : POST
name : String
fileId : Number
size : String
playListType : String
duration : Number

*/

router.post('playlist-add', function(req, res){

	console.log("request data====",req.body);

		var playlistObj = new Playlist({
			name : req.body.name,
  			fileId: req.body.fileId,
  			size: req.body.size,
			playListType: req.body.playListType,
			duration: req.body.duration
			});

	console.log("response data make ====",playlistObj);
	Playlist.createPlaylist(playlistObj,function(err, playlist){
		if(err){
            throw err;
        }else{
           var  response = {};
            if(data != null){
                response['status'] = true;
                response['data'] = playlist;
                response['msg'] = "Successfully Added";
            }else{
                response['status'] = false;
                response['data'] = null;
                response['msg'] = "Please try Again!!";
            }
             res.send(response);
        }
	});
	
});


/*
@params : 
action : playlist-delete
Method : POST
playlistId : Number
*/

router.post('playlist-delete', function(req, res){
	
	Playlist.delete(req.body.playlistId,function(err,playlist){
        if(err){
            throw err;
        }else{
           var  response = {};
            if(data != null){
                response['status'] = true;
                response['data'] = playlist;
                response['msg'] = "Successfully Deleted";
            }else{
                response['status'] = false;
                response['data'] = null;
                response['msg'] = "Please try Again!!";
            }
             res.send(response);
        }
	});
	
});


/*
@params : 
action : playlist
Method : GET
*/


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


/*
@params : 
action : scheduler-add
Method : POST
deviceId[] : Array
schedulerDate : String
*/


router.post('scheduler-add', function(req, res){
    var  response = {};
    var i = 1  ;
     if( req.body.deviceId.length > 0){
	  req.body.deviceId.forEach(element => {
		var schedulerObj = new Scheduler({
			scheduleDate : req.body.scheduleDate,
  			deviceId: element
			});

			console.log("response data make ====",schedulerObj);
			Scheduler.createScheduler(schedulerObj,function(err, scheduler){
                    console.log(scheduler);			
            });
            i++;
        });	

        if(req.body.deviceId.length == i){
            response['status'] = true;
            response['msg'] = "Successfully Added";
        }else{
            response['status'] = false;
            response['msg'] = "Please try Again!!";
        }


    }else{ // check lenght for multiple device id
         
            response['status'] = false;
            response['msg'] = "Please try Again!!";
    }


    res.send(response);

});


/*
@params : 
action : scheduler-delete
Method : POST
schedulerId :  Number 
*/
router.post('scheduler-delete', function(req, res){
	
	Scheduler.delete(req.body.schedulerId,function(err,scheduler){
        if(err){
			throw err;
		}else{
           var  response = {};
            if(data != null){
                response['status'] = true;
                response['data'] = scheduler;
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