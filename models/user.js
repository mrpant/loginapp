var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}


var adminData  =  new User({name :  "Admin" , username : "admin@123" , password : "admin@123" , email : "admin@gmail.com"});
User.findOne({ username: 'admin@123' }, function(err, existingUser) {


	bcrypt.genSalt(10, function(err, salt) {
		//pass default password in creation of admin
	    bcrypt.hash("admin@123", salt, function(err, hash) {
	        adminData.password = hash;
			if(!existingUser){
				adminData.save(function(err){
					if ( err ) throw err;
					console.log("Book Saved Successfully");
				});
			  }else{
				console.log("Default goes in else condition");
			}
	    });
	});


   

});