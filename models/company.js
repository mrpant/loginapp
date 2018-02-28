var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Company  Schema
var CompanySchema = mongoose.Schema({
	name: {
		type: String,
		default : ''
	},
	email: {
        type: String,
        default : 1
	},
	country: {
        type: String,
        default : ''
    },
    location : {
        type : String,
        default : ''
    },
    phone : {
        type : String,
        default : ''
    },
    website : {
        type : String,
        default : ''
    },
    date : {
        type : Date,
        default : Date.now
    },
   
    productId:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
});

var Company = module.exports = mongoose.model('Company', CompanySchema);

module.exports.createCompany= function(newCompany, callback){
       
    newCompany.save(callback);
}

module.exports.companyList= function(callback){
       
    Company.find(callback);
}

module.exports.assignProductToCompany= function(companyId,data,callback){
    var selecter = {_id: companyId};
    var updateValue = [];
    
    if(data.productId != null){

        data.productId.forEach(element => {
            updateValue.push(element);
        });

    }
 console.log("updateValue=========",updateValue);
 console.log("companyId====",companyId);
    Company.findOneAndUpdate(selecter,{ $set: { productId: updateValue } }, { new: true },callback);
}

module.exports.getCompanyDetails = function(id, callback){
	Company.findById(id, callback);
}

module.exports.update = function(id,data, callback){
    var selecter = {_id : id};
Company.findOneAndUpdate(selecter,{ $set: data }, { new: true },callback);
}

module.exports.delete = function(id,callback){
    var selecter = {_id : id};
    Company.remove(selecter,callback);
} 

module.exports.companyAndProduct = function(callback){
    var selecter = {};
    Company.find(selecter).populate('productId')
    .exec(callback);
} 


/* .findOne({email : params.username})
    .select('inventories')
    .where('title')
    .equals('activeInventory')
    .select('vehicles')
    .id(vehicleID)
    .exec(cb) */