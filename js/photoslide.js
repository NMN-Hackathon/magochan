(function(window, document, $) {

function printlog(str) {
    console.log(str);
}

var _Config = {
    kTransitionTimeMs: 10000
};

var PhotoSlide = function(container_selector, photo_urls, notification_url) {
    var $container = this.$container = $(container_selector).addClass("ps-container");

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
    $($photos[0]).addClass("ps-photo-show");

    // create video element for notification
    var $notification = this.$notification = $("<video></video>").addClass("ps-video");
    $notification.attr("src", notification_url);
    $notification.on("ended", this._onEndNotification.bind(this));
    $notification.on("loadeddata", function() {
        this._adjustVideoPosition($notification);
    }.bind(this));

    // append img elements
    $container.append($photos);
    $container.append($notification);

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
    },

    startNotification: function() {
        printlog("will start notification");

        this.stopSlideShow();
        this.$photos.removeClass("ps-photo-show");

        var $n = this.$notification;
        $n[0].currentTime = 0;
        $n.addClass("ps-video-show");

        $n[0].play();

        printlog("did start notification");
    },

    _onEndNotification: function() {
        printlog("did end notification");

        this.$notification.removeClass("ps-video-show");

        $(this.$photos[this.current_index]).addClass("ps-photo-show");
        this.startSlideShow();
    },

    _adjustVideoPosition: function($video) {
        var w = $video.width();
        var h = $video.height();
        var container_w = $video.parent().width();
        var container_h = $video.parent().height();

        var scale_w = w / container_w;
        var scale_h = h / container_h;

        if (scale_w > scale_h) {
            printlog("fit the size of video tag: horizontal");
            $video.addClass("ps-horizontal-fit");
        } else {
            printlog("fit the size of video tag: vertical");
            $video.addClass("ps-vertical-fit");
        }
    }
});

window.PhotoSlide = PhotoSlide;

})(window, document, jQuery);

$(function() {
    var photo_urls = [];
    for (var i = 1; i <= 11; i++) {
        photo_urls.push("./img/clock-photo/" + i + ".jpg");
    }
    var notification_url = "./video/announce.mp4";

    var photoslide = new PhotoSlide("#photo-slide-container", photo_urls, notification_url);

    // DEBUG
    $(window).keydown(function(e) {
        switch (e.keyCode) {
            case 13: // enter
                photoslide.startNotification();

                var $container = $("#root-container");
                $container.addClass("photo-slide-mode");
                $container.removeClass("no-photo-mode");
                break;
            case 27: // ESC
                toggleMode();
                break;
            default:
        }
    });
});

function toggleMode() {
    var $container = $("#root-container");
    var is_photo_slide_mode = $container.hasClass("photo-slide-mode");

    if (is_photo_slide_mode) {
        $container.removeClass("photo-slide-mode");
        $container.addClass("no-photo-mode");
    } else {
        $container.addClass("photo-slide-mode");
        $container.removeClass("no-photo-mode");
    }
}