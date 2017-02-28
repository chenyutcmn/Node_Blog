exports.if_login = function(req , res , next){
	if(req.session.user){
		return res.redirect('/');
	}
	next();
}
exports.if_not_login = function(req , res , next){
	if(!req.session.user){
		return res.redirect('/login');
	}
	next();
}