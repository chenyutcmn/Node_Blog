var article_help = require('../modles/article_help');
var settings = require('../settings');
exports.show_this_page = function(req , res){
	var page_num = parseInt(req.params.pagenum);
	var last_page = page_num-1;
	var next_page = page_num+1;
	if(page_num == 1){
		res.redirect('/');
		return;
	}
	article_help.find_all(page_num , function(err , result){
		if(err){
			console.log(err);
			res.redirect('/');
		}else{
			var doc = {
				'articles' : result[0],
				'articles_group' : result[1],
				'last_page' : '/page/' + last_page,
				'next_page' : '/page/' + next_page
			};
			if(result[0].length < settings['num_of_articles']){
				doc['next_page'] = '/page/' + page_num;
			}
			res.render('index' , doc);
		}
	});
}
exports.show_this_page_by_someone = function(req , res){
	var page_num = parseInt(req.params.pagenum);
	var username = req.params.username;
	var last_page = page_num-1;
	var next_page = page_num+1;
	if(page_num == 1){
		res.redirect('/' + username + '/home');
		return;
	}
	article_help.find_all_by_someone(username , page_num , function(err , result){
		if(err){
			console.log(err);
			res.redirect('/' + username + '/home');
		}else{
			var doc = {
				'articles' : result[0],
				'articles_group' : result[1],
				'last_page' : '/' + username + '/page/' + last_page,
				'next_page' : '/' + username + '/page/' + next_page
			};
			if(result[0].length < settings['num_of_articles']){
				doc['next_page'] = '/' + username + '/page/' + page_num;
			}
			res.render('index' , doc);
		}
	});
}