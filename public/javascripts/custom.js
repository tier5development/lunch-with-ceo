function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}



(function($) {

  // Menu filer
  $("#menu-flters li a").click(function() {
    $("#menu-flters li a").removeClass('active');
    $(this).addClass('active');

    var selectedFilter = $(this).data("filter");
    //  $("#menu-wrapper").fadeTo(100, 0);

    $(".menu-restaurant").fadeOut();

    setTimeout(function() {
      $(selectedFilter).slideDown();
      //$("#menu-wrapper").fadeTo(300, 1);
    }, 300);
  });

  // Add smooth scrolling to all links in navbar + footer link
  $(".sidenav a").on('click', function(event) {
    var hash = this.hash;
    if (hash) {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function() {
        window.location.hash = hash;
      });
    }

  });

  $(".sidenav a").on('click', function() {
		closeNav();
	});

  $("#pass").change(function() {
    if($("#pass").val() !== ''){
      $("#login").prop("disabled", false);
    }
  });

  $("#login").click(function() {
    if($("#pass").val() == "JV"){
      $.ajax({
        url: "/get-new-winner"
      }).then(function(data) {
        console.log(data);
        if(data.success) {
          $("#message_area").html("<h3>Welcome Boss!</h3><h2>We are reloading the page to give you the new winner. Thanks.</h2>");
          setTimeout(function(){
            window.location.href = '/';
          }, 2000);
        } else {
          $("#message_area").html("<h3>I think some issue happend.</h3><h2>Please retry!</h2>");
        }
      });
    } else {
      $("#message_area").html("<h3>Fuck off!</h3>");
    }
  });


  $(".modal-wide").on("show.bs.modal", function() {
    var height = $(window).height() - 200;
    $(this).find(".modal-body").css("max-height", height);
  });

})(jQuery);
