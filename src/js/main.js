"use strict";

console.log(">> Ready :)");

$(document).ready(function() {
  //// INICIAMOS MENSAJE COOKIES

  $(".cookie-message").cookieBar();

  //// CALENDARIO CURSOS
  if (typeof swiper !== "undefined") {
    swiper.on("slideChange", function() {
      if (swiper.realIndex === 0) {
        $(".inscribete-calendario .date1").show();
        $(".inscribete-calendario .date2").hide();
      } else {
        $(".inscribete-calendario .date2").show();
        $(".inscribete-calendario .date1").hide();
      }
    });
  }
});
