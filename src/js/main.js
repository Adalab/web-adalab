'use strict';

console.log('>> Ready :)');

$(document).ready(function() {

    //// CALENDARIO CURSOS

    $('.swiper-arrow').on('click', function(){
        if ($(".slide-1").hasClass("swiper-slide-active")) {
          $('.inscribete-calendario .date1').show();
          $('.inscribete-calendario .date2').hide();
        } else {
          $('.inscribete-calendario .date2').show();
          $('.inscribete-calendario .date1').hide();
        }
    });

    //// INICIAMOS MENSAJE COOKIES

    $('.cookie-message').cookieBar();
});


