var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var settings = require('../settings');

exports.show_setting = function(req , res){
	var username = req.session.user.username;
	async.waterfall([
		function(cb){
			MongoClient.connect(settings.uri , cb);
		},
		function(db , cb){
			Db = db;
			db.collection('user' , cb);
		},
		function(db_coll , cb){
			db_coll.find({'username' : username}).toArray(cb);						//update the article				
		},
		function(result , cb){
			user = result[0];
			cb(null);
		}
		] , function(err , result){
			Db.close();
			res.render('person_setting' , {'user' : user});
		});
};

exports.setting = function(req , res){
	var username = req.session.user.username;
	var signature = req.body.signature;
	async.waterfall([
		function(cb){
			MongoClient.connect(settings.uri , cb);
		},
		function(db , cb){
			Db = db;
			db.collection('user' , cb);
		},
		function(db_coll , cb){
			db_coll.update(															//update the article
				{'username' : username},
				{ $set: { 'Psetting' : signature} },
				{ safe: true } , cb);												//update the article				
		},
		function(result , cb){
			user = result;
			cb(null);
		}
		] , function(err , result){
			Db.close();
			res.redirect('/');
		});
};