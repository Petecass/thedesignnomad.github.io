// Make .header-wrapper height equal to the viewport height
$('.js-header-wrapper').height($(window).height()-100);


// Make .contact-wrapper push inside .bucketlist-wrapper
var $contactWrapperHeight = $('.js-contact-wrapper').outerHeight();
$('.js-contact-wrapper').css('margin-top', -$contactWrapperHeight);
var $jsBucketlistWrapperPaddingBottom = parseInt($('.js-bucketlist-wrapper').css('padding-bottom').replace(/\D/g, ''));
$('.js-bucketlist-wrapper').css('padding-bottom', $jsBucketlistWrapperPaddingBottom + $contactWrapperHeight);
