(function(window, document, $) {

var _Config = {
    kTransitionTimeMs: 60000,
    kPhotoDirectory: "./img/photoslide/"
};

var PhotoSlide = function(container_selector) {
    this.$container = $(container_selector);
};

$.extend(PhotoSlide.prototype, {
    startSlideShow: function() {

    },

    stopSlideShow: function() {

    }
});

})(window, document, jQuery);