'use strict';
/* global Instafeed */

// //  Set up instafeed

// Add debounce function (from underscore.js) to avoid having a performance hit
// http://davidwalsh.name/javascript-debounce-function

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  var debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = Date.  now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) {
            context = args = null;
          }
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = Date. now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };




  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  var throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) {
      options = {};
    }
    var later = function() {
      previous = options.leading === false ? 0 : Date.  now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    };
    return function() {
      var now = Date. now();
      if (!previous && options.leading === false) {
        previous = now;
      }
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) {
          context = args = null;
        }
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };


// Request the appropriate amount of images from the Instagram API
// according to device screen
var imagesLimit = function() {
    var windowWidth = window.innerWidth;
    if (windowWidth < 480) { return 6; }
    else if (windowWidth < 768) { return 9; }
    else if (windowWidth < 992) { return 10; }
    // else if (windowWidth < 1200) { return 12; }
    else { return 12; }
    // else { return 16; }
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





// Setup sidebar behavior

// On window load menu button is hidden so it doesn't overlap
// with the 'Currently in..' div
var didScroll, $menuToggle = $('.js-menu-toggle');

$(window).scroll(function() {
    didScroll = true;
});

function hasScrolled() {
    var st = $(window).scrollTop();
    if (st > 85) {
        $menuToggle.fadeTo(0, 1);
    } else {
        $menuToggle.fadeTo(0, 0);
    }
}

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);


$('.js-menu-toggle').click(function(e) {
    e.preventDefault();
    $('.wrapper').toggleClass('wrapper--toggled');
});



// Smooth scroll to anchor click
$(function() {
  $('a[href*=#]:not([href=#menu-toggle])').click(function() {
    if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 900);
        return false;
      }
    }
  });
});





// Faux-parallax header background on scroll
// Currently it just moves the logo downwards on page scroll
// TODO: Animate background, by shortening the header-wrapper height,
// and because the bg img size is set to cover, the img will appear to move.
//
// Also test bg image blur on scroll

// var headerWrapper = document.getElementsByClassName('js-header-wrapper')[0];
// var headerSpacer = document.getElementsByClassName('js-header-spacer')[0];
var header = document.getElementsByClassName('js-header')[0];

var runOnScroll = function() {
  var yPos = window.scrollY; // Measures the scroll distance from the top in px.

  var headerTranslate = yPos / 10; //
  if (headerTranslate < 20) {
    console.log(headerTranslate);
    header.style.transform = 'translateY(' + headerTranslate + '%)';
  }

};

var throttledScroll = throttle(runOnScroll, 100);

window.addEventListener('scroll', throttledScroll);
