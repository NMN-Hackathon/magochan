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



// 	var peer = new Peer({key: 'fa40f58a-ed4e-11e3-8985-1b56ab08265e'});
// 	var gConn = null;
// 	// peer.on('open', function(peerId) {
// 	// 	$("#peer_id").text(peerId);
// 	// });
// 	// peer.on('error', function(err) {
// 	// 	console.log(err);
// 	// });

// 	// 接続受信時
// 	peer.on('connection', function(conn) {
// 		connected(conn);
// 	});

// 	// 接続に行くイベント
// 	// $("#connect_button").on('click', function() {
// 	// 	var connect_peer_id = $("#connect_id").val();
// 	// 	connectPeer(connect_peer_id);
// 	// });

// 	// 接続に行く処理
// 	function connectPeer(peerId) {
// 		var conn = peer.connect(peerId);
// 		connected(conn);
// 	}

// 	// 接続完了した際の処理
// 	function connected(conn) {
// 		gConn = conn;
// 		conn.on('open', function() {
// 			// メッセージを受信
// 			conn.on('data', function(data) {
// 				console.log('Received', data);
// 			});
// 		});
// 	}

// 	$("#send_button").on('click', function() {
// 		if (!gConn) return;
// 		gConn.send('Hello!!');
// 	});
	
// });
});