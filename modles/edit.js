var article_help = require('../modles/article_help');

exports.show_edit = function(req , res){
	var article_id = req.params.article_id;
	article_help.find_article_by_id(article_id , function(err , result){
		res.render('edit' , {'article' : result});
	});
};

exports.post_edit = function(req , res){
	var article_id = req.body.article_id;
	var edit_title = req.body.edit_title;
	var edit_content = req.body.edit_content;
	article_help.update_article(article_id , edit_title , edit_content , function(err){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	});
}