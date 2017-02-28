var moment = require('moment');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var mongoose = require('mongoose');
var settings = require('../settings');

exports.add_reply = function(req , res){
	var reply = {
		'article_id' : req.params.article_id,
		'reply_author' : req.session.user.username,
		'reply_content' : req.body.reply_content,
		'reply_date' : moment(new Date()).format('YYYY_MM_DD HH:mm')
	};
	async.waterfall([
		function(cb){
			MongoClient.connect(settings.uri , cb);
		},
		function(db , cb){
			Db = db;
			db.collection('reply' , cb);
		},
		function(db_coll , cb){
			db_coll.insert(reply , {safe : true});
			cb(null);
		}
		] , function(err , result){
			Db.close();
			if(err){
				console.log(err);
			}else{
				res.redirect('/update_reply_num/' + req.params.article_id + '/' + 1);
			}
	});
};

exports.delete_reply = function(article_id , callback){
	async.waterfall([
		function(cb){
			MongoClient.connect(settings.uri , cb);
		},
		function(db , cb){
			Db = db;
			db.collection('reply' , cb);
		},
		function(db_coll , cb){
			db_coll.remove({
				'article_id' : article_id
			},
			{safe : true} , cb);
		}
		] , function(err , result){
			Db.close();
			callback(err);
	});
};

exports.find_reply = function(article_Id , callback){
	var article_id = article_Id;
	async.waterfall([
		function(cb){
			MongoClient.connect(settings.uri , cb);
		},
		function(db , cb){
			Db = db;
			db.collection('reply' , cb);
		},
		function(db_coll , cb){
			db_coll.find({'article_id' : article_id}).sort({reply_date : -1}).toArray(cb);
		}
		] , function(err , result){
			Db.close();
			if(err){
				console.log(err);
				callback(err , null);
			}else{
				callback(null , result);
			}
	});
};

exports.update_reply_num = function(req , res){
	async.waterfall([
		function(cb){
			MongoClient.connect(settings.uri , cb);
		},
		function(db , cb){
			Db = db;
			db.collection('article' , cb);
		},
		function(db_coll , cb){
			db_Coll = db_coll;
			db_coll.find({'_id' : mongoose.Types.ObjectId(req.params.article_id)}).toArray(cb);
		},
		function(result , cb){
			author = result[0]['author'];
			var now_num = parseInt(result[0]['reply_num']);
			var update_num = parseInt(req.params.update_num);
			var reply_num = now_num + update_num;
			db_Coll.update(															//update the read_num
				{'_id' : mongoose.Types.ObjectId(req.params.article_id)},
				{ $set: { 'reply_num':  reply_num} },
				{ safe: true });
			cb(null);
		}
		],function(err , result){
			Db.close();
			if(err){
				console.log(err);
			}else{
				res.redirect('/' + author + '/' + req.params.article_id + '/detail');
			}
		});
};