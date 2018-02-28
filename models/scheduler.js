var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Device = require('./device');

// User Schema
var SchedulerSchema = mongoose.Schema({
    deviceId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Device'
    },
	scheduleDate: {
		type: String, default: '',  
    }
});

var Scheduler = module.exports = mongoose.model('Scheduler', SchedulerSchema);


module.exports.createScheduler= function(newFile, callback){
       
    newFile.save(callback);
}

module.exports.schedulerList= function(callback){

    Scheduler.find({}).populate('deviceId')
    .exec(callback);

}

module.exports.update = function(id,data, callback){
    var selecter = {_id : id};
Scheduler.findOneAndUpdate(selecter,{ $set: data }, { new: true },callback);
}

module.exports.getSchedulerDetails = function(id, callback){
    var selecter = {_id : id};
	Scheduler.findById(selecter).populate('deviceId')
    .exec(callback);
}


module.exports.delete = function(id,callback){
    var selecter = {_id : id};
    Scheduler.remove(selecter,callback);
} 

module.exports.schedulerListCall = function(callback){


    Scheduler.aggregate([

        /* { "$unwind": "$deviceId" },
        {
            "$group": {
                "_id": "$scheduleDate",
                "device": { $push : "$deviceId" }
            }
           
        }, */
       
        {
            "$lookup": {
                from: "files",
                localField: "deviceId",
                foreignField: "deviceId",
                as: "deviceData"
            }
        },

        {
            "$group": {
                "_id": "$scheduleDate",
                "data": { $push : "$deviceData" }
            }
           
        }
    ]).exec(callback)


 
} 



