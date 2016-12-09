var blank="http://upload.wikimedia.org/wikipedia/commons/c/c0/Blank.gif";

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
  $("#x").click(function() {
    $("#img_prev").attr("src",blank);
    $("#x").hide();
  });

  $('#post_submit').click(function(){
    var tag_res = [];
    var quantities = [];
    var element_res = [];
    var mgs = []
    var cur = 0;
    $('.tags-inputs').each(function(){
      tag_res[cur] = $(this).val();
      cur = cur + 1;
    });
    cur = 0;
    $('.elems-inputs').each(function(){
      element_res[cur] = $(this).val();
      cur = cur + 1;
    });
    cur = 0;
    $('.quantity').each(function(){
      quantities[cur] = $(this).val();
      cur = cur + 1;
    });
    cur = 0;
    //alert($('input[name*="mg"]:checked').length);
    $('input[name*="mg"]:checked').each(function(){
      mgs[cur] = $(this).val();
      cur = cur + 1;
    });

    //var tags = $('.tags-inputs').val();
    var title = $('#tname').val();
    var desc = $('#desc').val();
    var src = $('#img_prev').attr('src');

    $.ajax({
        type: "POST",
        contentType: "application/json",
        data : JSON.stringify({ title:title, description:desc, pictures:src, tags:tag_res, elements:element_res, quantities:quantities, mgs:mgs}),
        url:"/post",
        async:false,
        success: function(data) {
          window.location.href = data.redirect;
        }
      });
  });

  var next = 1;
  $("#b1").click(function(e){
      e.preventDefault();
      var addto = "#field" + next;
      var addRemove = "#field" + (next);
      next = next + 1;
      var newIn = '<input autocomplete="off" class="input tags-inputs" placeholder = "enter your tags" id="field' + next + '" name="field' + next + '" type="text">';
      var newInput = $(newIn);
      var removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-danger remove-me" >-</button></div><div id="field">';
      var removeButton = $(removeBtn);
      $(addto).after(newInput);
      $(addRemove).after(removeButton);
      $("#field" + next).attr('data-source',$(addto).attr('data-source'));
      $("#count").val(next);

          $('.remove-me').click(function(e){
              e.preventDefault();
              var fieldNum = this.id.charAt(this.id.length-1);
              var fieldID = "#field" + fieldNum;
              $(this).remove();
              $(fieldID).remove();
          });
  });

  var ele_next = 1;
  $("#bX").click(function(e){
      e.preventDefault();
      var addto = "#mg" + ele_next;
      var addRemove = "#mg" + (ele_next);
      ele_next = ele_next + 1;
      var newIn = '<input autocomplete="off" class="input elems-inputs" placeholder = "enter your elements" id="elem' + ele_next + '" name="elem' + ele_next + '" type="text">' + '<input autocomplete="off" class="input quantity" placeholder = "enter quantity" id="quant' + ele_next + '" name="quant' + ele_next + '" type="text">  <label id = "ml' + ele_next + '"><input name="mg' + ele_next + '" type="radio" class = "radio_button" value="ml" />ml </label> <label id="mg' + ele_next + '"><input type="radio" name="mg' + ele_next + '" class = "radio_button" value="g" />g </label> ';
      var newInput = $(newIn);
      var removeBtn = '<button id="remove' + (ele_next - 1) + '" class="btn btn-danger remove-me2" >-</button></div><div id="field">';
      var removeButton = $(removeBtn);
      $(addto).after(newInput);
      $(addRemove).after(removeButton);
      $("#elem" + ele_next).attr('data-source',$(addto).attr('data-source'));
      $("#count2").val(ele_next);

          $('.remove-me2').click(function(e){
              e.preventDefault();
              var fieldNum = this.id.charAt(this.id.length-1);
              var fieldID = "#elem" + fieldNum;
              var quantID = "#quant" + fieldNum;
              var mg = "#mg" + fieldNum;
              var ml = "#ml" + fieldNum;
              $(this).remove();
              $(fieldID).remove();
              $(quantID).remove();
              $(mg).remove();
              $(ml).remove();
          });
  });

});
