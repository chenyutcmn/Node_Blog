var reg_and_login = require('../modles/reg_and_login');
var chackLogin = require('../modles/chack_Login');
var article = require('../modles/article');
var home = require('../modles/home');
var page = require('../modles/page');
var home_by_someone = require('../modles/home_by_someone');
var article_detail = require('../modles/articleDetail');
var edit = require('../modles/edit');
var reply = require('../modles/reply');
var person_setting = require('../modles/person_setting');
var async = require('async');
var db = require('../modles/db');

module.exports = function(app) {
  app.get('/' , home.show_home);
  app.get('/register' , chackLogin.if_login);
  app.post('/register' , chackLogin.if_login);
  app.get('/login' , chackLogin.if_login);
  app.post('/login' , chackLogin.if_login);
  app.get('/post' , chackLogin.if_not_login);
  //app.post('/post' , chackLogin.if_not_login);
  app.get('/logout' , chackLogin.if_not_login);
  app.get('/home' , chackLogin.if_not_login);
  app.get('/Psetting' , chackLogin.if_not_login);
  app.post('/:username/:article_id/reply' , chackLogin.if_not_login);
  app.get('/article/edit/:article_id' , chackLogin.if_not_login);
  //app.post('/article/edit/:article_id' , chackLogin.if_not_login);
  //app.get('/article/delete/:article_id' , chackLogin.if_not_login);

  app.get('/register' , reg_and_login.get_reg);
  app.post('/register' , reg_and_login.post_reg);

  app.get('/login' , reg_and_login.get_login);
  app.post('/login' , reg_and_login.post_login);

  app.get('/post' , article.get_post);
  app.post('/post' , article.post_post);

  app.get('/logout' , function(req , res){
    req.session.user = null;
    res.redirect('/');
  });

  app.get('/:username/home' , home_by_someone.show_someone_home)
  app.get('/:username/home/articlesgroup/:articles_date' , home_by_someone.show_someone_articles_by_date);
  app.get('/' , home.show_home);
  app.get('/articlesgroup/:articles_date' , home.show_articles_by_date);


  app.get('/page/:pagenum' , page.show_this_page);
  app.get('/:username/page/:pagenum' , page.show_this_page_by_someone);

  app.get('/:username/:article_id/detail' , article_detail.show_article_detail); 
  app.post('/:username/:article_id/reply' , reply.add_reply);
  app.get('/update_reply_num/:article_id/:update_num' , reply.update_reply_num);

  app.get('/article/edit/:article_id' , edit.show_edit);
  app.post('/article/edit/:article_id' , edit.post_edit);
  app.get('/article/delete/:article_id' , article_detail.article_delete);

  app.get('/Psetting' , person_setting.show_setting);
  app.post('/Psetting' , person_setting.setting);

};