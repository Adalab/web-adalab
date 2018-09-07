'use strict';

console.log('>> Ready :)');

$(document).ready(function() {
    
    //// LISTA DESPLEGABLE
    
    var lastitem='';
    (function($) {

    var allPanels = $('.desplegable > dd').hide();

    $('.desplegable > dt > a').click(function() {
        allPanels.slideUp();
        if ($(this).text() != lastitem) {
            $(this).parent().next().slideDown();
            lastitem = $(this).text();
        } else {
            lastitem = '';
        };
        return false;
      });

    })(jQuery);

    $('.swiper-arrow').on('click', function(){
        if ($(".slide-1").hasClass("swiper-slide-active")) {
          $('.inscribete-calendario h3').children('span').text('Octubre 2018');
        } else {
          $('.inscribete-calendario h3').children('span').text('Enero 2019');  
        }
    });  

});