var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Device  Schema
var DeviceSchema = mongoose.Schema({
	deviceName: {
		type: String,
		default : ''
	},
	status: {
        type: String,
        default : 1
	},
	location: {
        type: String,
        default : ''
	},
	cordinates: {
        longitude : {
        type: String,
        default : ''
        },
        latitude: {
        type: String,
        default : ''
        }
	}
});

var Device = module.exports = mongoose.model('Device', DeviceSchema);

module.exports.createDevice = function(newDevice, callback){
       
        newDevice.save(callback);
}

module.exports.deviceList = function(callback){
       
        Device.find(callback);
}

module.exports.getDeviceDetails = function(id, callback){
	Device.findById(id, callback);
}


module.exports.getDeviceName = function(id){

	return Device.findById({_id:id}).exec()
        .then(function(device) {
          return device;
        });
}

module.exports.update = function(id,data, callback){
        var selecter = {_id : id};
	Device.findOneAndUpdate(selecter,{ $set: data }, { new: true },callback);
}

module.exports.delete = function(id,callback){
        var selecter = {_id : id};
	Device.remove(selecter,callback);
}