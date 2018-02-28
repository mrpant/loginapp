var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


// Product  Schema
var ProductSchema = mongoose.Schema({
	name: {
		type: String,
		default : ''
	},
	type: {
        type: String,
        default : 1
	},
	ads_location: {
        type: String,
        default : ''
    },
    ads_period : {
        type : String,
        default : ''
    },
    deviceId : [mongoose.Schema.Types.ObjectId]
});


var Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.createProduct= function(newProduct, callback){
       
    newProduct.save(callback);
}

module.exports.productList= function(callback){
   
    Product.find(callback);
}

module.exports.assignDeviceToProduct= function(productId,data,callback){
    var selecter = {_id: productId};
    var updateValue = [];
    data.deviceId.forEach(element => {
        updateValue.push(element);
    });
 console.log("updateValue=========",updateValue);
 console.log("productId====",productId);
    Product.findOneAndUpdate(selecter,{ $set: { deviceId: updateValue } }, { new: true },callback);
}

module.exports.update = function(id,data, callback){
    var selecter = {_id : id};
Product.findOneAndUpdate(selecter,{ $set: data }, { new: true },callback);
}

module.exports.getProductDetails = function(id, callback){
	Product.findById(id, callback);
}

module.exports.delete = function(id,callback){
    var selecter = {_id : id};
    Product.remove(selecter,callback);
} 
