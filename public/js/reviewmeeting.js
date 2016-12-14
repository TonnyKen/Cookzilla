function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#img_prev')
            .attr('src', e.target.result)
            .height(200);
        };

        reader.readAsDataURL(input.files[0]);
    }
    else {
      var img = input.value;
        $('#img_prev').attr('src',img).height(200);
    }
    $("#x").show().css("margin-right","10px");
}

$(document).ready(function() {
  $("#reviewmsubmit").click(function() {
    var src = $('#img_prev').attr('src');
    var description = $('#description').val();

    $.ajax({
        type: "POST",
        contentType: "application/json",
        data : JSON.stringify({src:src, description:description}),
        url:"/reviewmeeting",
        async:false,
        success: function(data) {
          window.location.href = data.redirect;
        }
    });

  });
});
