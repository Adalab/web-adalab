'use strict';

console.log('>> Ready :)');

$(document).ready(function() {
  //// INICIAMOS MENSAJE COOKIES
  new CookiesEuBanner(function () {
      // Your code here
  }, true);

  //// CALENDARIO CURSOS
  if (typeof swiper !== 'undefined') {
    swiper.on('slideChange', function() {
      if (swiper.realIndex < 2) {
        $('.inscribete-calendario .date1').show();
        $('.inscribete-calendario .date2').hide();
      } else {
        $('.inscribete-calendario .date2').show();
        $('.inscribete-calendario .date1').hide();
      }
    });
  }

  // Iniciamos vídeos!
  // $("#video").fitVids();
  $("#video a").modalVideo();
});
