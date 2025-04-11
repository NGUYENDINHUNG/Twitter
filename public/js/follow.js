$(function () {
  $(document).on("click", "#follow", function (e) {
    e.preventDefault();

    var user_id = $("#user_id").val();
    $.ajax({
      url: "/follow/" + user_id,
      type: "POST", // or GET
      success: function (data) {
        $("#follow")
          .removeClass("btn-default")
          .addClass("btn-primary")
          .html("Following")
          .attr("id", "unfollow");
      },
      error: function (data) {
        console.log("««««« data »»»»»", data);
      },
    });
  });
});
