var article_help = require('../modles/article_help');
var reply = require('../modles/reply');
var markdown = require('markdown').markdown;

exports.show_article_detail = function(req , res){
	var article_id = req.params.article_id;
	article_help.find_article_by_id(article_id , function(err , result){
		var article = result;
		article['content'] = markdown.toHTML(article['content']);
		reply.find_reply(article_id , function(err , result){
			var doc = {
				'article' : article,
				'replies' : result
			};
			res.render('articlesdetail' , doc);
		});	
	});
}

exports.article_delete = function(req , res){
	var article_id = req.params.article_id;
	var username = req.session.user.username;
	article_help.delete_article(article_id , username , function(err){
		if(err){
			console.log(err);
			res.redirect('/');
			return;
		}else{
			reply.delete_reply(article_id , function(err){
				if(err){
					console.log(err);
				}
				res.redirect('/');
			});
		}
	});
}