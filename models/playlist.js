var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


// User Schema
var PlaylistSchema = mongoose.Schema({
	name: {
		type: String , default: ''
    },
    fileId: [{type : mongoose.Schema.Types.ObjectId,ref : 'File'}],
   
    size: {
        type : Number,
        default : 0
    },
    playListType: {
        type : String,
        default : 'playlist'
    },
    duration: {
        type : Number,
        default : 0
    }
	
});

var Playlist = module.exports = mongoose.model('Playlist', PlaylistSchema);


module.exports.createPlaylist= function(newFile, callback){
       
    newFile.save(callback);
}

module.exports.playlistList= function(callback){
   
    Playlist.find(callback);
}

module.exports.update = function(id,data, callback){
    var selecter = {_id : id};
Playlist.findOneAndUpdate(selecter,{ $set: data }, { new: true },callback);
}

module.exports.getPlaylistDetails = function(id, callback){
	Playlist.findById(id, callback);
}


module.exports.delete = function(id,callback){
    var selecter = {_id : id};
    Playlist.remove(selecter,callback);
} 

module.exports.playlistCall = function(callback){
    var selecter = {};
    Playlist.find(selecter).populate('fileId')
    .exec(callback);
} 