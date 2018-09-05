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
    

});