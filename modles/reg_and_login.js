var async = require("async");
var MongoClient = require('mongodb').MongoClient;
var is_Empty = require("../modles/is_Empty");
var settings = require('../settings');

//获取注册页面
exports.get_reg = function(req , res){
	res.render('reg' , {
		have_err : req.flash('have_err').toString(),
		err : { 
        namelength_err : req.flash('namelength_err').toString(),
        nameformat_err : req.flash('nameformet_err').toString(),
        pass_err : req.flash('pass_err').toString(),
        passlength_err : req.flash('passlength_err').toString(),
        dbsave_err : req.flash("dbsave_err").toString()
		}
	});
}

//提交注册表单
exports.post_reg = function(req , res , next){
	var user = {
		"_id" : req.body.username,
		"username" : req.body.username,
		"password" : req.body.password,
		"e-mail" : req.body.email,
		"Psetting" : ''
	};
	var temp = {
		"first_err" : "",
		"second_err" : "",
		"thrid_err" : "",
		"fourth_err" : "",
		"fiveth_err" : ""
	};
	async.waterfall([
		function(cb){
			if(user['username'].length < 6 || user['username'].length > 12){
				temp['first_err'] = 1;
				req.flash('namelength_err' , '请出入6-12位用户名');

			}
			if(/[^1-9a-zA-Z-_]/.test(user['username'])){
				temp['second_err'] = 1;
				req.flash('nameformet_err' , '请输入正确的用户名格式');
			}
			if(user['password'] != req.body.repeatPassword){
				temp['thrid_err'] = 1;
				req.flash('pass_err' , '两次输入的密码不一致');
			}
			if(user['password'].length < 6 || user['password'].length > 12){
				temp['fourth_err'] = 1;
				req.flash('passlength_err' , '请输入6-12位密码');
			}
			cb(null);
		},
		function(cb){
			MongoClient.connect(settings.uri , cb);
		},
		function(db , cb){
			Db = db;
			db.collection("user" , cb);
		},
		function(user_Coll , cb){
			userColl = user_Coll;
			userColl.find({_id : user['_id']}).toArray(cb);
		},
		function(result , cb){
			if(result.length){
				temp['fiveth_err'] = 1;
				req.flash('dbsave_err' , '用户已存在');
			}else if(is_Empty.isEmpty(temp)){
				userColl.insert(user , {safe : true});
				req.session.user = user;
			}
			cb(null);
		}
		],function(err , result){
			Db.close();
			if(err){
				console.log(err);
			}
			if(!is_Empty.isEmpty(temp)){
				req.flash('have_err' , '1');
				res.redirect('/register');
				console.log("redirect success");
			}else{
				console.log("redirect to index");
				req.flash('success' , '成功');
				res.redirect('/');
			}
		});
}

//获取登录页面
exports.get_login = function(req , res){
	res.render('login' , {
		have_err : req.flash('have_err').toString(),
		noUser_err : req.flash('noUser_err').toString(),
		password_err : req.flash('password_err').toString()
	});
}

exports.post_login = function(req , res){
	var user = {
		"username" : req.body.username,
		"password" : req.body.password
	}
	async.waterfall([
		function(cb){
			MongoClient.connect(settings.uri , cb);
		},
		function(db , cb){
			Db = db;
			db.collection('user' ,cb);
		},
		function(db_Coll , cb){
			dbColl = db_Coll;
			dbColl.find({'_id' : user['username']}).toArray(cb);
		},
		function(result , cb){
			if(!result.length){
				req.flash('noUser_err' , '用户名错误');
				req.flash('have_err' , 'its error');
				res.redirect('/login');
			}else if(result[0]['password'] != user['password']){
				req.flash('password_err' , '密码错误');
				req.flash('have_err' , 'its error');
				res.redirect('/login');
			}else{
				req.flash('success' , '成功');
				req.session.user = result[0];
				console.log('user is :' + req.session.user['name']);
				res.redirect('/');
			}
		}
		],function(err , result){
			Db.close();
			if(err){
				console.log("something err : " + err);
			}
		});
}