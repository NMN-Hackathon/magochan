(function(window, document, $) {

function printlog(str) {
    console.log(str);
}

var _Config = {
    kTransitionTimeMs: 60000
};

var PhotoSlide = function(container_selector, photo_urls) {
    this.$container = $(container_selector).addClass("ps-container");

    // create img elements for photos
    var $photos = $();
    for (var i = 0, len = photo_urls.length; i < len; i++) {
        var $p = $("<div/>").addClass("ps-photo");
        $p.css("background-image", "url(" + photo_urls[i] + ")");
        $photos = $photos.add($p);
    }
    this.$photos = $photos;
    this.photo_num = photo_urls.length;

    // initialize photo slide index
    this.current_index = 0;
    $(this.$photos[0]).addClass("ps-photo-show");

    // append img elements
    this.$container.append(this.$photos);

    this.startSlideShow();
};

$.extend(PhotoSlide.prototype, {
    startSlideShow: function() {
        printlog("start slide show");

        this.slideShowTimer = setInterval(function() {
            this.nextPhoto();
        }.bind(this), _Config.kTransitionTimeMs);
    },

    stopSlideShow: function() {
        if (this.slideShowTimer != null) {
            printlog("stop slide show");

            clearInterval(this.slideShowTimer);
        }
    },

    nextPhoto: function() {
        this.current_index = ++this.current_index % this.photo_num;
        this.$photos.removeClass("ps-photo-show");
        $(this.$photos[this.current_index]).addClass("ps-photo-show");

        printlog("change for next photo: " + this.current_index);
    }
});

window.PhotoSlide = PhotoSlide;

})(window, document, jQuery);