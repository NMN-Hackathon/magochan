var oClockAnalog = {
    aSecond:         [],
    dtDate:          new Date(),
    iCurrSecond:     -1,
    iHourRotation:   -1,
    iMinuteRotation: -1,
    iStepSize:       10,
    iTimerAnimate:   setInterval("oClockAnalog.fAnimate()", 20),
    iTimerUpdate:    setInterval("oClockAnalog.fUpdate()", 1000),

    fAnimate:       function() {
        if (this.aSecond.length > 0) {
            this.fRotate("analogsecond", this.aSecond[0]);
            this.aSecond = this.aSecond.slice(1);
        }
    },
    fGetHour:     function() {
        var iHours = this.dtDate.getHours();
        if (iHours > 11) {
            iHours -= 12;
        }
        return Math.round((this.dtDate.getHours() * 30) + (this.dtDate.getMinutes() / 2) + (this.dtDate.getSeconds() / 120));
    },
    fGetMinute:     function() {
        return Math.round((this.dtDate.getMinutes() * 6) + (this.dtDate.getSeconds() / 10));
    },
    fInit:          function() {
        this.iHourRotation = this.fGetHour();
        this.fRotate("analoghour", this.iHourRotation);

        this.iMinuteRotation = this.fGetMinute();
        this.fRotate("analogminute", this.iMinuteRotation);

        this.iCurrSecond = this.dtDate.getSeconds();
        this.fRotate("analogsecond", (6 * this.iCurrSecond));
    },
    fRotate:        function(sID, iDeg) {
        var sCSS = ("rotate(" + iDeg + "deg)");
        $("#" + sID).css({ '-moz-transform': sCSS, '-o-transform': sCSS, '-webkit-transform': sCSS });
    },
    fStepSize:     function(iTo, iFrom) {
        var iAnimDiff = (iFrom - iTo);
        if (iAnimDiff > 0) {
            iAnimDiff -= 360;
        }
        return iAnimDiff / this.iStepSize;
    },
    fUpdate:        function() {
        // update time
        this.dtDate = new Date();

        // hours
        var iTemp = this.fGetHour();
        if (this.iHourRotation != iTemp) {
            this.iHourRotation = iTemp;
            this.fRotate("analoghour", iTemp);
        }

        // minutes
        iTemp = this.fGetMinute();
        if (this.iMinuteRotation != iTemp) {
            this.iMinuteRotation = iTemp;
            this.fRotate("analogminute", iTemp);
        }

        // seconds
        if (this.iCurrSecond != this.dtDate.getSeconds()) {
            var iRotateFrom = (6 * this.iCurrSecond);
            this.iCurrSecond = this.dtDate.getSeconds();
            var iRotateTo = (6 * this.iCurrSecond);

            // push steps into array
            var iDiff = this.fStepSize(iRotateTo, iRotateFrom);
            for (var i = 0; i < this.iStepSize; i++) {
                iRotateFrom -= iDiff;
                this.aSecond.push(Math.round(iRotateFrom));
            }
        }
    }
};

var oClockDigital = {
    aHour:          [],
    aMinute:        [],
    aSecond:        [],
    dtDate:         new Date(),
    iCurrYear:      -1,
    iCurrMonth:     -1,
    iCurrDate:      -1,
    iCurrHour:      -1,
    iCurrMinute:    -1,
    iCurrSecond:    -1,
    iStepSize:      10,
    iTimerUpdate:   setInterval("oClockDigital.fUpdate()", 1000),

    fInit:          function() {
        this.fUpdate();
    },
    fRotate:        function(sID, value, fillDigitNum) {
        var imagePaths = this._translateNumToImagePaths(value, fillDigitNum);
        for (var i = 0, len = imagePaths.length; i < len; i++) {
            $("#" + sID + (i + 1)).attr("src", imagePaths[i]);
        }
    },
    fStepSize:     function(iTo, iFrom) {
        var iAnimDiff = (iTo - iFrom);
        if (iAnimDiff > 0) {
            iAnimDiff -= 360;
        }
        return iAnimDiff / this.iStepSize;
    },
    fUpdate:        function() {
        // update time
        this.dtDate = new Date();

        this.iCurrYear = this.dtDate.getFullYear();
        this.iCurrMonth = this.dtDate.getMonth() + 1;
        this.iCurrDate = this.dtDate.getDate();
        this.iCurrHour = this.dtDate.getHours();
        this.iCurrMinute = this.dtDate.getMinutes();
        this.iCurrSecond = this.dtDate.getSeconds();
        this.fRotate("digitalyear", this.iCurrYear, 4);
        this.fRotate("digitalmonth", this.iCurrMonth, 2);
        this.fRotate("digitaldate", this.iCurrDate, 2);
        this.fRotate("digitalhour", this.iCurrHour, 2);
        this.fRotate("digitalminute", this.iCurrMinute, 2);
        this.fRotate("digitalsecond", this.iCurrSecond, 2);
    },
    /**
     * 追加分
     */
    _hashColorPattern: function(num) {
        var kColorPattern = ["blue", "brown", "darkblue", "green", "red"];

        return kColorPattern[num % kColorPattern.length];
    },
    /**
     * REQUIRE: Positive Integer
     * ENSURE: Array of Image Path
     */
    _translateNumToImagePaths: function(num, fillDigitNum) {
        fillDigitNum = fillDigitNum || 0;
        var imagePathPrefix = "./img/clock-num/";
        var imagePathSuffix = ".png";
        var paths = [];
        do {
            var digit = num % 10;
            num = Math.floor(num / 10);
            paths.unshift(imagePathPrefix + digit + "_" + this._hashColorPattern(digit) + imagePathSuffix);
            fillDigitNum--;
        } while (num !== 0 || fillDigitNum > 0);
        return paths;
    }
};

$(document).ready(function() {
    bClocksInitialised = true;
    oClockAnalog.fInit();
    oClockDigital.fInit();
});

