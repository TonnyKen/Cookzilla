var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

router.get('/', function (req, res) {
  console.log('Currently get /main... ');
  // get from database top 10 tags... recipes...
  var tag_query = "SELECT TNAME, SUM(TIMES) AS SUM_TIMES FROM HISTORY_USER_CLICK_TAG NATURAL JOIN TAG GROUP BY TNAME ORDER BY SUM(TIMES) DESC LIMIT 10";
  var recipe_query = "SELECT DISTINCT * FROM ((SELECT RID, TITLE, DESCRIPTION, PHOTOS, RV.AR FROM RECIPE NATURAL JOIN (SELECT RID, AVG(RATING) AS AR FROM REVIEW GROUP BY RID ORDER BY AVG(RATING) DESC ) AS RV) UNION ALL (SELECT DISTINCT RID, TITLE, DESCRIPTION, PHOTOS, RV.AR FROM (SELECT RID, AVG(RATING) AS AR FROM REVIEW GROUP BY RID ORDER BY AVG(RATING) DESC ) AS RV NATURAL JOIN RECIPE NATURAL JOIN ABOUT NATURAL JOIN TAG WHERE TITLE LIKE CONCAT('%',(SELECT KEYWORD FROM `HISTORY_USER_SEARCH_KEYWORD` WHERE USER_NAME = 1 limit 1),'%') OR DESCRIPTION LIKE CONCAT('%',(SELECT KEYWORD FROM `HISTORY_USER_SEARCH_KEYWORD` WHERE USER_NAME = 1 limit 1),'%') OR TNAME LIKE CONCAT('%',(SELECT KEYWORD FROM `HISTORY_USER_SEARCH_KEYWORD` WHERE USER_NAME = 1 limit 1),'%'))) AS A";
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query(tag_query, function(err, rows) {
      if(err)throw err;
      var tags = rows;
      connection.query(recipe_query, function(err, rows) {
        if(err)throw err;
        var recipes = rows;
        if(req.session.uid === 'undefined' ||!req.session.uid) {
          console.log('Not login in now');
          res.render('main',{all_tags:tags, all_recipes:recipes, userinfo:false});
        }
        else {
          console.log('Already logined');
          res.render('main',{all_tags:tags, all_recipes:recipes, userinfo:true,uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});

        }
      });
      connection.release();
    });
  });
  //console.log(tags);
});

module.exports = router;
