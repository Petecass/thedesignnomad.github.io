'use strict';

// Make .header-wrapper height equal to the viewport height
// $('.js-header-wrapper').height($(window).height()-100);

// //  Set up instafeed

// Add debounce function (from underscore.js) to avoid having a performance hit
// http://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) { func.apply(context, args); }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) { func.apply(context, args); }
    };
}

// Request the appropriate amount of images from the Instagram API
// according to device screen
var imagesLimit = function() {
    var windowWidth = window.innerWidth;
    if (windowWidth < 480) { return 6; }
    else if (windowWidth < 768) { return 9; }
    else if (windowWidth < 992) { return 10; }
    else if (windowWidth < 1200) { return 12; }
    else { return 16; }
};

// Create actual Instagram feed
var feed = new Instafeed({
    clientId:   'f75c3967d83b45fd86da428260319384',
    get:        'user',
    userId:     10393930,
    accessToken:'1290329338.f75c396.700a90b5345844e8a6d42a8fa34490e2',
    target:     'js-instagram',
    links:      true,
    limit:      imagesLimit(),
    sortBy:     'most-recent',
    resolution: 'standard_resolution',
    template:   '<li class="instagram__link-container"><a href="{{link}}" target="_blank"><figure class="instagram__figure"><img class="instagram__image" src="{{image}}" alt="{{model.caption}}"><figcaption class="instagram__curtain"><p class="instagram__link"><span class="instagram__button"><i class="fa  fa-instagram"></i>Instagram</span></p></figcaption></figure></a></li>'
});
feed.run();


// Get image dimensions first to create correct .instagram__figure.
// We need this in order to create appropriately sized .instagram__button.
// Update .instagram__figure dimensions on window resize or orientation change
var getInstagramImageDimensions = debounce(function() {
    var img = document.querySelector('.instagram__link-container');
    var w = img.offsetWidth; /*1*/
    var instagramFigures = document.getElementsByClassName('instagram__figure');
    for (var i = 0, iFL = instagramFigures.length; i < iFL; i++) {
        document.getElementsByClassName('instagram__figure')[i]
            .setAttribute('style','width:' + w + 'px; height:' + w + 'px;');
    }

    // /*1*/
    // There's a bug hidden in here. The problem is that offsetWidth()
    // returns integer pixel value, while we set .instagram__link-container
    // width in percentages in css. The result is that sometimes we have vertical
    // white lines between the instagram pictures, due to the fact that the
    // pixels' sum doesn't always equal the pixel width value of the viewport.
    //
    // TODO: Find a way to retrieve actual percentage from css (including media
    // queries changes) and apply this in pixels with 2 decimal digits.
    //
    // http://stackoverflow.com/questions/744319/get-css-rules-percentage-value-in-jquery
    // http://stackoverflow.com/questions/4006588/is-it-possible-to-use-jquery-to-get-the-width-of-an-element-in-percent-or-pixels

}, 250);

// Fire once on windowload
window.addEventListener('load',  getInstagramImageDimensions);
// Fire on every
window.addEventListener('resize', getInstagramImageDimensions);





// Make .contact-wrapper push inside .bucketlist-wrapper
var $contactWrapperHeight = $('.js-contact-wrapper').outerHeight();
$('.js-contact-wrapper').css('margin-top', -$contactWrapperHeight);
var $jsBucketlistWrapperPaddingBottom = parseInt($('.js-bucketlist-wrapper')
    .css('padding-bottom')
    .replace(/\D/g, ''));
$('.js-bucketlist-wrapper')
    .css('padding-bottom', $jsBucketlistWrapperPaddingBottom + $contactWrapperHeight);
