'use strict';

console.log('>> Ready :)');

function updateCalendarTitle(changeFromPagination){
  var isFirstSlide = $(".slide-1").hasClass("swiper-slide-active");
  if(changeFromPagination) isFirstSlide = !isFirstSlide;
  if (isFirstSlide) {
    $('.inscribete-calendario .date1').show();
    $('.inscribete-calendario .date2').hide();
  } else {
    $('.inscribete-calendario .date2').show();
    $('.inscribete-calendario .date1').hide();
  }
}

$(document).ready(function() {

    //// CALENDARIO CURSOS

    $('.swiper-arrow').on('click', function(){
      updateCalendarTitle();
    });
    $('.swiper-pagination-bullet').on('click', function(){
      if(!$(this).hasClass("swiper-pagination-bullet-active")){
        updateCalendarTitle(true);
      }
    });

    //// INICIAMOS MENSAJE COOKIES

    $('.cookie-message').cookieBar();
});


