$(function() {
	var apiKey = '0ff773c4-ec9e-11e3-a625-5bd0486b3528';
	var mediaStream = null;

	// ビデオ、オーディオの準備
	setupMediaStream(function(stream, streamUrl) {
		$("#streamVideo").attr("src", streamUrl);
		mediaStream = stream;
	});

	// 放送用peer作成
	var peer = new Peer(MagochanPeerId, { key: apiKey });
	peer.on('open', function(peerId) {
		$("#peer_id").text(peerId);
		console.log('Peerのopenに成功しました');
	});
	peer.on('error', function(err) {
		console.log('Peerのopenに失敗しました');
	});

	// 受信者の接続が来たら、mediaStreamの応答を返す
	peer.on('call', function(call) {
		console.log('接続がきました！');
		call.answer(mediaStream);
	});

	/**
	 * MediaStreamのセットアップ
	 */
	function setupMediaStream(success) {
		// MediaStream
		navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		navigator.getUserMedia(
			{ video: true, audio: true },
			function(stream) {
				var url = URL.createObjectURL(stream);
				if (success) {
					success(stream, url);
				}
			},
			function(err) {
			}
		);
	};
	
});