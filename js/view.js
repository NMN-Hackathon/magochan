$(function() {
	var apiKey = '0ff773c4-ec9e-11e3-a625-5bd0486b3528';
	var viewerUrl = 'https://skyway.io/active/list/' + apiKey;
	var mediaStream = null;
	var myPeerId = null;
	var myPeer = null;
	var SPACE_KEY = 32;
	
	// ビデオ、オーディオの準備
	setupMediaStream(function(stream, streamUrl) {
		var url = URL.createObjectURL(stream);
		mediaStream = stream;
		$("#video0").attr('src', url);
		initializedMediaStream(stream);
		setInterval(updateViewers, 5000);
	});

	// 閲覧者の表示を更新する
	function updateViewers() {
		getViewers(function(viewerIds) {
			viewerIds.sort();
			// vieweridの数だけ生成する
			for(var i = 0; i < viewerIds.length; i++) {
				viewerId = viewerIds[i];
				// if (viewerId != MagochanPeerId && viewerId != myPeerId) {
				if (viewerId != MagochanPeerId) {
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
							$emptyVideos = $("video.viewVideo").filter(function() {
								return !$(this).attr('src');
							});
							// srcが空のやつを探す
							if (0 < $emptyVideos.length) {
								$viewerVideo = $($emptyVideos.get(0));
								$viewerVideo.attr('src', url);
								$viewerVideo.attr('data-viewer-id', viewerId);
							}
						});
						call.on('close', function() {
							$viewerVideo = $("video.viewVideo[data-viewer-id=" + viewerId + "]");
							$viewerVideo.attr('src', '');
						});
					})(viewerId);
				}
			}
		});
	};

	// mediastreamを初期化
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
		peer.on('close', function() {
			console.log('peer close');
			peer.destroy();
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
		});
	}

	// キーダウン時に、動画に切り替える
	$(document).keyup(function(e) {
		console.log(e.keyCode);
		if (e.keyCode == SPACE_KEY) {
			triggerVideo();
		}
	});

	// triggerVideo（ビデオと生放送を入れ替える）
	function triggerVideo() {
		$video = $("#streamVideo");
		var nextSrc = $video.attr("data-next-src");
		var beforeSrc = $video.attr("src");
		$video.attr('src', nextSrc);
		$video.attr("data-next-src", beforeSrc);
	}

});