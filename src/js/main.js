'use strict';

console.log('>> Ready :)');

$(document).ready(function() {

    //// CALENDARIO CURSOS
    swiper.on('slideChange', function () {
      if (swiper.realIndex === 0) {
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


