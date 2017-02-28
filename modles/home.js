var article_help = require('../modles/article_help');
var settings = require('../settings');
var moment = require('moment');

exports.show_home = function(req , res){
    console.log(moment().format());
	var page_num = 1;
	article_help.find_all(page_num , function(err , result){
		if(err){
			console.log(err)
		}else{
			var doc = {
				'articles' : result[0],
				'articles_group' : result[1],
				'last_page' : '/',
				'next_page' : '/page/2'
			};
			if(result[0].length < settings['num_of_articles']){
				doc['next_page'] = '/';
			}
			res.render('index' , doc);
		}

	});
}

exports.show_articles_by_date = function(req , res){
	var date = req.params.articles_date;
	article_help.find_by_date(date , function(err , result){
		if(err){
			console.log(err);
		}else{
			var doc = {
				'articles' : result[0],
				'articles_group' : result[1],
				'last_page' : '/articlesgroup/' + date,
				'next_page' : '/articlesgroup/' + date
			};
			res.render('index' , doc);
		}
	});
}

