$(function() {
	var apiKey = '0ff773c4-ec9e-11e3-a625-5bd0486b3528';
	var viewerUrl = 'https://skyway.io/active/list/' + apiKey;
	var mediaStream = null;
	var myPeerId = null;
	var myPeer = null;

	// ビデオ、オーディオの準備
	setupMediaStream(function(stream, streamUrl) {
		var url = URL.createObjectURL(stream);
		mediaStream = stream;
		$("#myVideo").attr('src', url);
		initializedMediaStream(stream);
		setInterval(updateViewers, 5000);
	});

	// 閲覧者の表示を更新する
	function updateViewers() {
		getViewers(function(viewerIds) {
			// vieweridの数だけ生成する
			for(var i = 0; i < viewerIds.length; i++) {
				viewerId = viewerIds[i];
				if (viewerId != MagochanPeerId && viewerId != myPeerId) {
					//　閲覧者が既にあったらなにもしない
					if (0 < $("video[data-viewer-id=" + viewerId + "]").length) {
						continue;
					}
					// peerに接続にいく
					var call = myPeer.call(viewerId, mediaStream);

					(function(viewerId) {
						// 閲覧者受信
						call.on('stream', function(stream) {
							var url = URL.createObjectURL(stream);
							var $viewerVideo = $("<video width='160' height='120' autoplay></video>");
							$viewerVideo.attr('src', url);
							$viewerVideo.attr('data-viewer-id', viewerId);
							$("#video_area").append($viewerVideo);
						});
					})(viewerId);
				}
			}
		});
	};

	function initializedMediaStream(stream) {
		var peer = new Peer({ key: apiKey });
		peer.on('open', function(peerId) {
			myPeerId = peerId;
			myPeer = peer;
			console.log('Peerの作成に成功');
			// まごちゃんへビデオ接続
			var call = peer.call(MagochanPeerId, stream);

			// まごちゃんチャンネル受信
			call.on('stream', function(stream) {
				console.log('チャンネル受信！');
				var url = URL.createObjectURL(stream);
				$("#streamVideo").attr('src', url);
			});
		});
		peer.on('error', function(error) {
			console.log('Peerの作成に失敗');
			console.log(error);
		});
		// 受信者の接続が来たら、mediaStreamの応答を返す
		peer.on('call', function(call) {
			console.log('接続がきました！');
			call.answer(mediaStream);
		});
	}

	// mediastreamのセットアップ
	function setupMediaStream(success, error) {
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

	// 視聴者を受信する
	function getViewers(success) {
		$.get(viewerUrl, null, function(data) {
			if (success) {
				success(data);
			}
		})
	}
});