var express = require('express');
var router = express.Router();


var File = require('../models/files');
var Playlist = require('../models/playlist');


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		isLogin = true;
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}

// Get Playlist
router.get('/',ensureAuthenticated, function(req, res){
	Playlist.playlistList(function(err, playlist){
		if(err) throw err;
		console.log("playlist list ===========",playlist);
		res.render('playlist-view',{'playlistList' : playlist});  
	});
	//res.render('playlist-view');
});

router.get('/playlist-add',ensureAuthenticated, function(req, res){

	filesArray = [];	
	File.fileList(function(err, file){
	
		if(err){ throw err;
		}else{
			file.forEach((element)=>{
				filesObj = {};
				filesObj['name'] = element.name;
				filesObj['fileType'] = element.fileType;
				filesObj['url'] = element.url;
				filesObj['size'] = element.size;
				filesObj['productId'] = element.productId;
				filesObj['_id'] = element._id;
				if(element.fileType.split('/')[0] == "image"){
					filesObj['isImage'] = true;
				}else{
					filesObj['isImage'] = false;
				}
				filesArray.push(filesObj);
			});
		}
		console.log("product list ===========",filesArray);
		
		res.render('playlist-add',{'fileList':filesArray});
	});
});



router.post('/create',ensureAuthenticated, function(req, res){

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
		if(err) throw err;
		console.log("sucess===========",playlist);
	});
	req.flash('success_msg', "Your Record has been Saved");
	res.redirect('/playlist');
});

router.get('/:playlistId/update-view',ensureAuthenticated, function(req, res){

	Playlist.getPlaylistDetails(req.params.playlistId,function(err,playlist){
		res.render('playlist-add',{'playlistDetails':playlist});
	});
});

router.post('/:playlistId/delete',ensureAuthenticated, function(req, res){
	
	Playlist.delete(req.params.playlistId,function(err,playlist){
			res.redirect('/playlist');
	});
	req.flash('error_msg', "Your Record has been Deleted");
});

module.exports = router;