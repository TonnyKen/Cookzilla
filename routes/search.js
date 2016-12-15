var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

router.post('/', function (req, res) {
    console.log('Now in ./search post page, keyword',req.body.search_value);
    if (typeof req.body.search_value !== 'undefined') {
        keyword = req.body.search_value;
        pool.getConnection(function(err, connection) {
          var search_query = 'SELECT DISTINCT RID, PHOTOS, TITLE FROM RECIPE NATURAL JOIN ABOUT NATURAL JOIN TAG WHERE TITLE LIKE "%' + keyword + '%" OR DESCRIPTION LIKE "%' + keyword + '%" OR TNAME LIKE "%'+ keyword + '%";';
          connection.query(search_query, function(err, rows) {
            if(err){
              req.flash('error', 'Search error');
              return res.redirect('back');
            }
            var results = rows;
            if(!req.session.uid) {
              res.render('search_result',{results:results, keyword:'Search results', value:keyword, userinfo:false});
            }
            else {
              var check_history_query = 'select lasttime, TIMES from HISTORY_USER_SEARCH_KEYWORD where user_name=' + connection.escape(req.session.uid) + ' and keyword= ' + connection.escape(keyword);
              console.log(check_history_query);
              connection.query(check_history_query, function(err, rows) {
                if(err){
                  req.flash('error', 'Search error');
                  return res.redirect('back');
                }
                if(rows.length > 0){
                  var times = parseInt(rows[0].TIMES, 10) + 1;
                  var now = new Date();
                  var insert_query = 'update HISTORY_USER_SEARCH_KEYWORD set lasttime=NOW(),TIMES = ' + times + ' where user_name=' + connection.escape(req.session.uid) + ' and keyword= ' + connection.escape(keyword);
                  connection.query(insert_query, function(err, rows) {
                    if(err){
                      req.flash('error', 'update error');
                      return res.redirect('back');
                    }
                    return res.render('search_result',{results:results, keyword:'Search results', value:keyword, userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
                  });
                }
                else{
                  var now = new Date();
                  var insert_query = 'insert into HISTORY_USER_SEARCH_KEYWORD(user_name, keyword, lasttime, TIMES) values ('+ connection.escape(req.session.uid) + ',' + connection.escape(keyword) + ', NOW()' + ',1)';
                  connection.query(insert_query, function(err, rows) {
                    if(err){
                      req.flash('error', 'insert error');
                      return res.redirect('back');
                    }
                    return res.render('search_result',{results:results, keyword:'Search results', value:keyword, userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
                  });
                }
              });
            }
          });
          connection.release();
        });
    }
    else{
      req.flash('error', 'Empty search value, Enter what you want to search');
      return res.redirect('back');
    }
});

module.exports = router;
