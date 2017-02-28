var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var moment = require('moment');
var settings = require('../settings');

exports.get_post = function(req , res){
	res.render('post');
}
exports.post_post = function(req , res){
    var date1 = moment().format('YYYY_MM_DD HH:mm');
	var hour = (parseInt(date1.substr(11 , 2)) + 8)%24;
    var hour1 = String(hour);
	hour1.length == 1 ? hour1 = '0' + hour1 : huor1 = hour1;
	var date2 = date1.substr(0 , 11) + hour1 + date1.substr(13 , 3); 
	console.log(hour);
	console.log(hour1 + " " + date2);
	var article = {
		title : req.body.mytitle || '',
		content : req.body.mycontent || '',
		author : req.body.author,
		date : date2,
		date_for_group : moment(new Date()).format('YYYY_MM_DD'),
		read_num : 1,
		reply_num : 0
	};
	async.waterfall([
		function(cb){			
			if ([article['title'] , article['content']].some(function(item){ return item == ''; })){
				cb({err : 'null_err' , massage : '文章标题或内容没有填写!'});
			}else{
				MongoClient.connect(settings.uri , cb);
			}
		},
		function(db , cb){
			Db = db;
			db.collection('article' , cb);
		},
		function(db_coll , cb){
			db_coll.insert(article , {safe : true} , cb);
		}
		],
		function(err , result){
			Db.close();
			if(err){
				res.send({'error' : err});
			}else{
				res.send({'success' : 'true'});
			}
	});
}