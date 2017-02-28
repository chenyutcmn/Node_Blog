var async = require('async');
var settings = require('../settings');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;


exports.find_all = function(page_num , callback){
	async.waterfall([
		function(cb){
			MongoClient.connect(settings.uri , cb);
		},
		function(db , cb){
		    Db = db;
			db.collection('article' , cb);
		},
		function(db_coll , cb){
			db_Coll = db_coll
			db_coll.
				find().
				sort({date : -1}).
				limit(settings['num_of_articles']).
				skip(settings['num_of_articles']*(page_num-1)).
				toArray(cb);
		},
		function(result , cb){
			result_article = result;
			for(var i in result_article){
				result_article[i]['content'] = result_article[i]['content'].split('\n')[0];
			}
			db_Coll.group(['date_for_group'] , {} , {'count' : 1} , "function (obj, prev) { prev.count++; }" , cb);
		},
		function(result , cb){
			result_article_group = result;
			cb(null);
		}
		] , function(err , result){
			Db.close();
			if(err){
				callback(err , null);
			}else{
				callback(null , [result_article , result_article_group]);
			}
	});
}

exports.find_by_date = function(group_date , callback){
	async.waterfall([
		function(cb){
			MongoClient.connect(settings.uri , cb);
		},
		function(db , cb){
			Db = db;
			db.collection('article' , cb);
		},
		function(db_coll , cb){
			db_Coll = db_coll
			db_coll.find({'date_for_group' : group_date}).sort({date : -1}).toArray(cb);
		},
		function(result , cb){
			result_article = result;
			for(var i in result_article){
				result_article[i]['content'] = result_article[i]['content'].split('\n')[0];
			}
			db_Coll.group(['date_for_group'] , {} , {'count' : 1} , "function (obj, prev) { prev.count++; }" , cb);
		},
		function(result , cb){
			result_article_group = result;
			cb(null);
		}
		] , function(err , result){
			Db.close();
			if(err){
				callback(err , null);
			}else{
				callback(null , [result_article , result_article_group]);
			}
		});
}

exports.find_all_by_someone = function(username , page_num , callback){
	async.waterfall([
		function(cb){
			MongoClient.connect(settings.uri , cb);
		},
		function(db , cb){
		    Db = db;
			db.collection('article' , cb);
		},
		function(db_coll , cb){
			db_Coll = db_coll
			db_coll.
				find({"author" : username}).
				sort({date : -1}).
				limit(settings['num_of_articles']).
				skip(settings['num_of_articles']*(page_num-1)).
				toArray(cb);
		},
		function(result , cb){
			result_article = result;
			for(var i in result_article){
				result_article[i]['content'] = result_article[i]['content'].split('\n')[0];
			}
			db_Coll.group(['date_for_group'] , {} , {'count' : 1} , "function (obj, prev) { prev.count++; }" , cb);
		},
		function(result , cb){
			result_article_group = result;
			cb(null);
		}
		] , function(err , result){
			Db.close();
			if(err){
				callback(err , null);
			}else{
				callback(null , [result_article , result_article_group]);
			}
	});
}


exports.show_someone_articles_by_date = function(group_date , callback){
	async.waterfall([
		function(cb){
			MongoClient.connect(settings.uri , cb);
		},
		function(db , cb){
			Db = db;
			db.collection('article' , cb);
		},
		function(db_coll , cb){
			db_Coll = db_coll
			db_coll.find({"author" : username , 'date_for_group' : group_date}).sort({date : -1}).toArray(cb);
		},
		function(result , cb){
			result_article = result;
			for(var i in result_article){
				result_article[i]['content'] = result_article[i]['content'].split('\n')[0];
			}
			db_Coll.group(['date_for_group'] , {} , {'count' : 1} , "function (obj, prev) { prev.count++; }" , cb);
		},
		function(result , cb){
			result_article_group = result;
			cb(null);
		}
		] , function(err , result){
			Db.close();
			if(err){
				callback(err , null);
			}else{
				callback(null , [result_article , result_article_group]);
			}
		});
}

exports.find_article_by_id = function(article_id , callback){
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
			db_coll.find({'_id' : mongoose.Types.ObjectId(article_id)}).toArray(cb);//find the article
		},
		function(result , cb){
			result_article = result[0];
			var read_num = parseInt(result[0]['read_num']) + 1;
			db_Coll.update(															//update the read_num
				{'_id' : mongoose.Types.ObjectId(article_id)},
				{ $set: { 'read_num':  read_num} },
				{ safe: true });
			cb(null);
		}
		] , function(err , result){
			Db.close();
			if(err){
				callback(err , null);
			}else{
				callback(null , result_article);
			}
		});
};

exports.update_article = function(article_id , edit_title , edit_content , callback){
	async.waterfall([
		function(cb){
			MongoClient.connect(settings.uri , cb);
		},
		function(db , cb){
		    Db = db;
			db.collection('article' , cb);
		},
		function(db_coll , cb){
			db_coll.update(															//update the article
				{'_id' : mongoose.Types.ObjectId(article_id)},
				{ $set: { 
					'title':  edit_title,
					'content' : edit_content
					} },
				{ safe: true });
			cb(null);
		}
		] , function(err , result){
			Db.close();
			callback(err);
		});
}

exports.delete_article = function(article_id , username , callback){
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
			db_coll.find({'_id' : mongoose.Types.ObjectId(article_id)}).toArray(cb);//update the article
		},
		function(result , cb){
			if(result[0]['author'] == username){
				db_Coll.remove(														//update the article
				{'_id' : mongoose.Types.ObjectId(article_id)},
				{ safe: true } , cb);
			}else{
				cb({'err' : '无删除权限'});
			}
		},
		function(result , cb){
			console.log(result);
			cb(null);
		}
		] , function(err , result){
			Db.close();
			callback(err);
		});
};