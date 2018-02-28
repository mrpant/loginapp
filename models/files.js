var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// File  Schema
var FileSchema = mongoose.Schema({
	name: {
        type : String,
        default : '',
     /*    unique: true  */
	},
	url: {
        type: String,
        default : ''
	},
	size: {
        type: String,
        default : '0'
        },
        fileType: {
        type: String,
        default : ''
        },
        min: {
        type: String,
        default : '0'
        },
        sec: {
        type: String,
        default : '0.1'
        },
        start: {
        type: String,
        default : '0'
        },
        end: {
        type: String,
        default : '0'
        },
        deviceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref  : 'Device'
        },
        productId :
        {
        type: mongoose.Schema.Types.ObjectId,
        ref  : 'Product'
        }


   
});

var Files = module.exports = mongoose.model('File', FileSchema);

module.exports.createFiles= function(newFile, callback){
       
        newFile.save(callback);
}

module.exports.fileList= function(callback){
   
        Files.find(callback);
}

module.exports.fileListByDeviceId= function(id){
   
      return  Files.find({deviceId:id},function(err,files){
                if(err)
                        throw err;
                        
                return files;        

        });
}

module.exports.fileDetails= function(id,callback){
   
        Files.findById(id,callback);
}

module.exports.updateFilesDuration= function(fileId,data,callback){
        var selecter = {_id: fileId};
       console.log("fileObj",data);
       Files.findOneAndUpdate(selecter,{ $set: data }, { new: true },callback);
}

module.exports.update = function(id,data, callback){
        var selecter = {_id : id};
    Files.findOneAndUpdate(selecter,{ $set: data }, { new: true },callback);
}
    
module.exports.getFileDetails = function(id, callback){
        Files.findById(id, callback);
}

module.exports.delete = function(id,callback){
        var selecter = {_id : id};
	Files.remove(selecter,callback);
} 
