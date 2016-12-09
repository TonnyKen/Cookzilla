$(document).ready(function() {
  $('#commentSubmit').click(function(){
    var starNumber = $('.glyphicon-star').length;
    var title = $('#title').val();
    var review = $('#review').val();
    var comment = $('#comment').val();
    var rid = $('#hrid').text();
    $.ajax({
        type: "POST",
        contentType: "application/json",
        data : JSON.stringify({rid:rid, title:title, review:review, stars:starNumber, comment:comment}),
        url:"/comment",
        async:false,
        success: function(data) {
          alert('Ajax complete');
          window.location.href = data.redirect;
        }
    });
  });
});
