var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
var checkLogin = require('../middlewares/check').checkLogin;

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

module.exports = router;
