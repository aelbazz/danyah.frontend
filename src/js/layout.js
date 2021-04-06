$(function () {
  
  
	$(window).on("scroll", function () { 
        if ($(window).scrollTop() < 80) { 
            $("body").removeClass("is-sticky_header");
        } else { 
            $("body").addClass("is-sticky_header");
        }
    });
})