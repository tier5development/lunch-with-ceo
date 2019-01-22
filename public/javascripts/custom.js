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

  // Login button validation
  $("#pass").change(function() {
    if($("#pass").val() !== ''){
      $("#login").prop("disabled", false);
    }
  });

  // Get new winner of this week
  $("#new_winner").click(function() {
    $.ajax({
      url: "/get-new-winner"
    }).then(function(data) {
      if(data.success) {
        swal("Well done Boss!", "We are reloading the page to give you the new winner. Thanks.", "success");
        setTimeout(function(){
          window.location.href = '/';
        }, 3000);
      } else {
        swal("I think some issue occured!", "Please login again and retry! Thanks.", "warning");
      }
    });
  });
  
  // Add new member in the system
  $("#addMember").click(function() {

    swal({
      title: "Add new name(s)!",
      text: 'Please add all name as comma(,) separated and in small letter. E.g. "a b,c,d,e f"',
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      inputPlaceholder: "New names"
    }, function (inputValue) {
      if (inputValue === false) return false;
      if (inputValue.trim() === "") {
        swal.showInputError("You need to provide at least one name!");
        return false
      }

      $.ajax({
        url: '/add/new/member',
        type: 'POST',
        data: {
          members: inputValue.trim()
        }
      }).then(function(data) {
        if(data.success) {
          swal("Congratulations!", "We have updated the member list. Please wait we are refreshing the page once. Thanks.", "success");
          setTimeout(function(){
            window.location.href = '/';
          }, 3000);
        } else {
          swal("I think some issue occured!", "Please login again and retry! Thanks.", "warning");
        }
      });
    });
  });

  // Delete member(s) from the system
  $("#deleteMember").click(function() {
    swal({
      title: "Delete member(s)",
      text: 'Please provide all name as comma(,) separated and in small letter. E.g. "a b,c,d,e f"',
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      inputPlaceholder: "Provide name(s)"
    }, function (inputValue) {
      if (inputValue === false) return false;
      if (inputValue.trim() === "") {
        swal.showInputError("You need to provide at least one name!");
        return false
      }
      
      $.ajax({
        url: '/delete/member',
        type: 'POST',
        data: {
          members: inputValue.trim()
        }
      }).then(function(data) {
        if(data.success) {
          if(data.couldnot_delete.length) {
            swal({
              title: "Problem while deleting",
              text: "We couldn't find "+data.couldnot_delete,
              type: "warning",
              showCancelButton: false,
              confirmButtonClass: "btn-danger",
              confirmButtonText: "Okay, that is fine!",
              closeOnConfirm: false
            },
            function(){
              swal("Deleted Few!", "We have updated the member list.", "success");

              setTimeout(function(){
                  window.location.href = '/';
              }, 2000);
            });
          } else {
            swal("Congratulations!", "We have updated the member list. Please wait we are refreshing the page once. Thanks.", "success");

            setTimeout(function(){
                window.location.href = '/';
            }, 2000);
          }
        } else {
          swal("I think some issue occured!", "Please logout and login again to retry! Thanks.", "warning");
        }
      });
    });
  });

  // Let admin to login to the system
  $("#login").click(function() {
    if($("#pass").val() !== ""){
      $.ajax({
        url: '/login',
        type: 'POST',
        data: {
          pass: $("#pass").val()
        }
      }).then(function(data) {
        if(data.authorised && data.isadmin) {
          swal("Welcome Boss!", "We are reloading the page to give you full access of the platform. Thanks.", "success");
          setTimeout(function(){
            window.location.href = '/';
          }, 3000);
        } else if(data.authorised && !data.isadmin) {
          swal("Welcome HR!", "We are reloading the page to give you full access of the platform. Thanks.", "success");
          setTimeout(function(){
            window.location.href = '/';
          }, 3000);
        } else {
          swal("I think some issue occured!", "Please login again and retry! Thanks.", "warning");
        }
      });
    } else {
      $("#message_area").html("<h3>Fuck off!</h3>");
      swal("Fuck off!", "", "error");
    }
  });

  
  // Logout from the system
  $("#logout").click(function() {
    $.ajax({
        url: '/logout'
      }).then(function(data) {
        if(data.success) {
          swal("Thanks for using this platform!", "See you again.", "success");
          setTimeout(function(){
            window.location.href = '/';
          }, 2000);
        } else {
          swal("I think some issue occured!", "Please refresh the page and retry! Thanks.", "warning");
        }
      });
  });

  $(".modal-wide").on("show.bs.modal", function() {
    var height = $(window).height() - 200;
    $(this).find(".modal-body").css("max-height", height);
  });

})(jQuery);
