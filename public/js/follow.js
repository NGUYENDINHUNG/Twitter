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
          .html("unfollow")
          .attr("id", "unfollow");
      },
      error: function (data) {
        console.log("««««« data »»»»»", data);
      },
    });
  });

  $(document).on("click", "#unfollow", function (e) {
    e.preventDefault();

    var user_id = $("#user_id").val();
    $.ajax({
      url: "/unfollow/" + user_id,
      type: "POST", // or GET
      success: function (data) {
        $("#unfollow")
          .removeClass("btn-primary")
          .addClass("btn-default")
          .html("follow")
          .attr("id", "follow");
      },
      error: function (data) {
        console.log("««««« data »»»»»", data);
      },
    });
  });
});

$(document).on("mousennter", "#unfollow", function (e) {
  $(this).removeClass("btn-primary").addClass("btn-danger").html("unfollow");
});

$(document).on("mouseleave", "#unfollow", function (e) {
  $(this).removeClass("btn-danger").addClass("btn-primary").html("following");
});