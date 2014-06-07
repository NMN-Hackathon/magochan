
var MagochanIOApiKey = '0ff773c4-ec9e-11e3-a625-5bd0486b3528';
var MagochanPeerId = 'Magochan';

var MagochanIO = {
	/**
	 * MediaStreamのセットアップ
	 */
	setupMediaStream: function(success, error) {
		// MediaStream
		navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		navigator.getUserMedia(
			{ video: true, audio: false },
			function(stream) {
				var url = URL.createObjectURL(stream);
				if (success) {
					success(stream, url);
				}
			},
			function(err) {
			}
		);
	}
}