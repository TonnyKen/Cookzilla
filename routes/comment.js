var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
var checkLogin = require('../middlewares/check').checkLogin;
var url  = require('url');

router.get('/', checkLogin, function (req, res) {
  console.log('Now in ./review');
  var rid = req.query.rid;
  req.session.rid = rid;
  if (!rid){
    console.log('No rid found');
    return res.redirect('back');
  }
  else {
    console.log('Get param rid:',rid);
    var uid = req.session.uid;
    pool.getConnection(function(err, connection) {
      var check_query = "select user_name from POST where rid='" + connection.escape(rid) + "';";
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
  console.log('Now in ./review post',req.body);
  var title = req.body.title,
    review = req.body.review,
    stars = req.body.stars,
    comment = req.body.comment,
    uid = req.session.uid,
    rid = req.session.rid;

  pool.getConnection(function(err, connection) {
    var check_user_query = 'select user_name from post where rid = ' + connection.escape(rid);
    connection.query(check_user_query, function(err, rows) {
      if (err)throw err;
      if(rows.length > 0 && rows[0].user_name === uid){
        console.log('Same person post, attack found, ./comments post');
        req.flash('error', 'You have already reviewed, do not review another time');
        return res.send({redirect:'/main'});
      }
      else{
        console.log('Not the same person, start insert post');
        var insert_review_query = 'INSERT INTO REVIEW(user_name, rid, rating, title, r_text, suggestion) VALUES('+ connection.escape(uid) +',' + connection.escape(rid) + ','+ connection.escape(stars) + ',' + connection.escape(title)+',' + connection.escape(review) +',' + connection.escape(comment)+ ');';
        connection.query(insert_review_query, function(err, rows) {
          if (err)throw err;
          console.log('Insert into post success');
          return res.send({redirect:'/reviewhis?rid='+rid});
        });
      }
    });
    connection.release();
  });
});

module.exports = router;
