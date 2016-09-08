$(document).ready(function () {
    var mainHeader = $('.header');

    $(window).scroll(function () {
        var scroll = $(window).scrollTop(),
            headerHeight = mainHeader.outerHeight();

        if(scroll > headerHeight) {
            mainHeader.addClass('active');
        } else {
            mainHeader.removeClass('active');
        }
    })
});