var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
var checkLogin = require('../middlewares/check').checkLogin;
var url  = require('url');

router.get('/', checkLogin, function (req, res) {
  console.log('Now in ./review');
  var rid = req.query.rid;
  if (!rid){
    console.log('No rid found');
    return res.redirect('back');
  }
  else {
    console.log('Get param rid:',rid);
    var uid = req.session.uid;
    var check_query = "select user_name from POST where rid='" + rid + "';";
    pool.getConnection(function(err, connection) {
      connection.query(check_query, function(err, rows) {
        if (err)throw err;
        if (rows.length === 0 || rows[0].user_name === uid){
          console.log('Attack from review get');
          return res.redirect('back');
        }
        else{
          res.render('comment', {rid:rid, userinfo:true, uid:req.session.user_name, nick_name:req.session.nick_name, login_name:req.session.login_name});
        }
      });
      connection.release();
    });
  }
});

router.post('/', checkLogin, function (req, res) {
  console.log('Now in ./comment post',req.body);
  var title = req.body.title,
    review = req.body.review,
    stars = req.body.stars,
    comment = req.body.comment,
    uid = req.session.uid,
    rid = req.body.rid;
  var check_user_query = 'select user_name from post where rid = "' + rid + '";';
  pool.getConnection(function(err, connection) {
    connection.query(check_user_query, function(err, rows) {
      if (err)throw err;
      if(rows.length > 0 && rows[0].user_name === uid){
        console.log('Same person post, attack found, ./comments post');
        return res.send({redirect:'/main'});
      }
      else{
        console.log('Not the same person, start insert post');
        var insert_review_query = 'INSERT INTO REVIEW(user_name, rid, rating, title, r_text, suggestion) VALUES("'+ uid +'","' + rid + '","'+ stars + '","' + title +'","' + review +'","' + comment + '");';
        connection.query(insert_review_query, function(err, rows) {
          if (err)throw err;
          console.log('Insert into post success');
          return res.send({redirect:'/main'});
        });
      }
    });
    connection.release();
  });
});

module.exports = router;
