var article_help = require('../modles/article_help');
var settings = require('../settings');
exports.show_someone_home = function(req , res){
	var username = req.params.username;
	var page_num = 1;
	article_help.find_all_by_someone(username , page_num , function(err , result){
		if(err){
			console.log(err)
		}else{
			var doc = {
				'articles' : result[0],
				'articles_group' : result[1],
				'last_page' : '/' + req.session.user.username + '/home/#',
				'next_page' : '/' + req.session.user.username + '/page/2'
			};
			if(result[0].length < settings['num_of_articles']){
            doc['next_page'] = '/' + req.session.user.username + '/home/#';
            }
			res.render('home' , doc);
		}

	});
}

exports.show_someone_articles_by_date = function(req , res){
	var date = req.params.articles_date;
	var username = req.params.username;
	article_help.find_by_date_and_someone(username , date , function(err , result){
		if(err){
			console.log(err);
		}else{
			var doc = {
				'articles' : result[0],
				'articles_group' : result[1],
				'last_page' : '/'+ req.session.user.name + '/home/articlesgroup/' + date,
				'next_page' : '/'+ req.session.user.name + '/home/articlesgroup/' + date
			};
			res.render('home' , doc);
		}
	});
}