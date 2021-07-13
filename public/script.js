var usernames = [];

var cameraVideoProfile = "480P_4"; // 640 × 480 @ 30fps  & 750kbs
var screenVideoProfile = "480P_4"; // 640 × 480 @ 30fps
const socket = io("/");
// create client instances for camera (client) and screen share (screenClient)
var client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
var screenClient;
// stream references (keep track of active streams)
var remoteStreams = {}; // remote streams obj struct [id : stream]

var localStreams = {
	camera: {
		id: "",
		stream: {},
	},
	screen: {
		id: "",
		stream: {},
	},
};

AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.INFO);

// var mainStreamId; // reference to main stream
var screenShareActive = false; // flag for screen share


function initClientJoinChannel() {
	// init Agora SDK
	client.init(
		agoraAppId,
		function () {
			console.log("AgoraRTC client initialized");
			console.log(channelName, username);
			joinChannel(channelName, uid, token, username);
          
			socket.emit("join-chat-room", roomId, channelName, username);
			socket.emit("adduser", username);

			socket.on("user-connected", ( username) => {
				console.log("user:" + username + " connected");
			})

			
      		// join channel upon successfull init
	 	},
	 	function (err) {
	 		console.log("[ERROR] : AgoraRTC client init failed", err);
 	}
);
}

initClientJoinChannel();

client.on("stream-published", function (evt) {
	 //addRemoteStreamMiniView(evt.stream);
    //  socket.emit("videouser", username);
	console.log("Publish local stream successfully");
});

// connect remote streams
client.on("stream-added", function (evt) {
	var stream = evt.stream;
	var streamId = stream.getId();
	console.log("new stream added: " + streamId);
	
	//socket.emit("adduser", username);
    // Subscribe to the stream.
	client.subscribe(stream, function (err) {
		console.log("[ERROR] : subscribe stream failed", err);
	});
		
});

client.on("stream-subscribed", function (evt) {
	var remoteStream = evt.stream;
	var remoteId = remoteStream.getId();
	// remoteStreams[remoteId] = remoteStream;
	console.log("Subscribe remote stream successfully: " + remoteId);

	addRemoteStreamMiniView(remoteStream);
});

// remove the remote-container when a user leaves the channel
client.on("peer-leave", function (evt) {
	var streamId = evt.stream.getId(); //get stream id
	
	var remoteContainerID = "#" + streamId + "_container";
	$(remoteContainerID).empty().remove(); //
	Dish();
});

// show mute icon whenever a remote has muted their mic
client.on("mute-audio", function (evt) {
	document.getElementById(evt.uid + "_mute").style.backgroundColor = "#cc3898";
	setVisibility("#" + evt.uid + "_mute", true);
});

client.on("unmute-audio", function (evt) {
	setVisibility("#" + evt.uid + "_mute", false);
});

// show user icon whenever a remote has disabled their video
client.on("mute-video", function (evt) {
	var remoteId = evt.uid;
	
	// if the main user stops their video select a random user from the list
	if (remoteId != mainStreamId) {
		// if not the main video then show the user icon
		setVisibility("#" + remoteId + "_no-video", true);
	}
});

client.on("unmute-video", function (evt) {
	setVisibility("#" + evt.uid + "_no-video", false);
});

// join a channel
function joinChannel(channelName, uid, token, username) {
	client.join(
		token,
		channelName,
		uid,
		username,
		function (uid, username) {
			console.log("User with uid: " + uid + " join channel successfully");
			createCameraStream(uid);
			localStreams.camera.id = uid; // keep track of the stream uid
		},
		function (err) {
			console.log("[ERROR] : join channel failed", err);
		}
	);
}

// video streams for channel
function createCameraStream(uid) {
	var localStream = AgoraRTC.createStream({
		streamID: uid,
		audio: true,
		video: true,
		screen: false,
	});
	localStream.setVideoProfile(cameraVideoProfile);
	localStream.init(
		function () {
			console.log("getUserMedia successfully");
				
			// TODO: add check for other streams. play local stream full size if alone in channel
			// localStream.play('local-video'); // play the given stream within the local-video div
			addRemoteStreamMiniView(localStream);

			// publish local stream
			client.publish(localStream, function (err) {
			
				// socket.emit('user-name',req.session.userdata.displayNa)
				console.log("[ERROR] : publish local stream error: " + err);
			});
			//  socket.emit('videouser',username)

			enableUiControls(localStream); // move after testing
			localStreams.camera.stream = localStream; // keep track of the camera stream for later
		},
		function (err) {
			document.getElementById("video_icon").innerHTML = "videocam_off";
			document.getElementById("video_btn").classList.toggle("btn-danger");
			document.getElementById("mic_icon").innerHTML = "mic_off";
			document.getElementById("mic_btn").classList.toggle("btn-danger");
			document.getElementById("screen_share_icon").innerHTML =
				"cancel_presentation";
			document
				.getElementById("screen_share_btn")
				.classList.toggle("btn-danger");
			console.log("[ERROR] : getUserMedia failed", err);
			console.log("[ERROR] : getUserMedia failed", err);
		}
	);
}

// SCREEN SHARING
function initScreenShare(agoraAppId, channelName) {
	screenClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
	console.log("AgoraRTC screenClient initialized");
	screenClient.init(
		agoraAppId,
		function () {
			console.log("AgoraRTC screenClient initialized");
		},
		function (err) {
			console.log("[ERROR] : AgoraRTC screenClient init failed", err);
		}
	);
	// keep track of the uid of the screen stream.
	localStreams.screen.id = screenuid;

	// Create the stream for screen sharing.
	var screenStream = AgoraRTC.createStream({
		streamID: screenuid,
		audio: false, // Set the audio attribute as false to avoid any echo during the call.
		video: false,
		screen: true, // screen stream
		screenAudio: true,
		mediaSource: "screen", // Firefox: 'screen', 'application', 'window' (select one)
	});

	screenStream.setVideoProfile(screenVideoProfile);
	// initialize the stream
	// -- NOTE: this must happen directly from user interaction, if called by a promise or callback it will fail.
	screenStream.init(
		function () {
			console.log("getScreen successful");
			localStreams.screen.stream = screenStream; // keep track of the screen stream
			screenShareActive = true;
			$("#screen_share_btn").prop("disabled", false); // enable button
			screenClient.join(
				screentoken,
				channelName,
				screenuid,
				function (uid) {
					screenClient.publish(screenStream, function (err) {
						console.log("[ERROR] : publish screen stream error: " + err);
					});
				},
				function (err) {
					console.log("[ERROR] : screen-share failed", err);
				}
			);
		},
		function (err) {
		
					document.getElementById("screen_share_icon").innerHTML =
						"screen_share";
			console.log("[ERROR] : getScreen failed", err);
			localStreams.screen.id = ""; // reset screen stream id
			localStreams.screen.stream = {}; // reset the screen stream
			screenShareActive = false; // resest screenShare
			toggleScreenShareBtn(); // toggle the button icon back
			$("#screen-share-btn").prop("disabled", false); // enable button
		}
	);

}

function stopScreenShare() {

	localStreams.screen.stream.disableVideo(); // disable the local video stream (will send a mute signal)
	localStreams.screen.stream.stop(); // stop playing the local stream
	localStreams.screen.stream.close();
	localStreams.camera.stream.enableVideo(); // enable the camera feed
		
	// localStreams.camera.stream.play('local-video'); // play the camera within the full-screen-video div
	$("#video_btn").prop("disabled", false);
	screenClient.leave(
		function () {
			screenShareActive = false;
			console.log("screen client leaves channel");
			$("#screen_share_btn").prop("disabled", false); // enable button
			localStreams.screen.stream.stop();
			screenClient.unpublish(localStreams.screen.stream); // unpublish the screen client
			localStreams.screen.stream.close(); // close the screen client stream
			localStreams.screen.id = ""; // reset the screen id
			localStreams.screen.stream = {}; // reset the stream obj
		},
		function (err) {
			console.log("client leave failed ", err); //error handling
		}
	);
}

// REMOTE STREAMS UI
function addRemoteStreamMiniView(remoteStream) {

	var streamId = remoteStream.getId();
	// append the remote stream template to #remote-streams
	$("#video-grid").append(
		$("<div/>", {
			id: streamId + "_container",
			class: "user-container",
		}).append(
			$("<div/>", { id: "user_video_" + streamId, class: "user-video" })
		)
	);
	 
	console.log(remoteStream, streamId);
	remoteStream.play("user_video_" + streamId);
	console.log("video" + streamId);
	document.getElementById("video" + streamId).style.objectFit = "contain";
		document.getElementById("video" + streamId).style.backgroundColor =
			"#5f6368";
	document.getElementById("player_" + streamId).style.backgroundColor ="transparent";

	Dish();

}

// socket.on("user-disconnected", (username) => {
// 	console.log("user:" + username + " disconnected");
// })

function leaveChannel() {
	if (screenShareActive) {
		stopScreenShare();
	}

	client.leave(
		function () {
			console.log("client leaves channel");
			localStreams.camera.stream.stop(); // stop the camera stream playback
			client.unpublish(localStreams.camera.stream); // unpublish the camera stream
			localStreams.camera.stream.close(); // clean up and close the camera stream
			$("#remote-streams").empty(); // clean up the remote feeds
			//disable the UI elements
			$("#mic_btn").prop("disabled", true);
			$("#video_btn").prop("disabled", true);
			$("#screen_share_btn").prop("disabled", true);
			$("#exit_btn").prop("disabled", true);
			// hide the mute/no-video overlays
			setVisibility("#mute-overlay", false);
			setVisibility("#no-local-video", false);
			Dish();
			redirec();
		},
		function (err) {
			console.log("client leave failed ", err); //error handling
		}
	);
}

const messages = document.getElementById("main__chat__window");
const chat_value = document.getElementById("chat_message");
socket.on("createMessage", (mes, username) => {
	show(mes, username);
});
const message = () => {

	socket.emit("message", chat_value.value, username);
	 chat_value.value = '';
	 document.getElementById("chat_message").focus();
};
const show = (mes, username) => {
	div = document.createElement("div");
	divname = document.createElement("div");
	divname.innerHTML = username;
	divname.className = "messageuser"
	divname.setAttribute("align", "left");
	div.innerHTML = mes;
	div.className = "message";
	div.setAttribute("align", "left");
	messages.append(divname);
	messages.append(div);
};

const redirec = () =>{
	document.location.href = './home';
}

socket.on('update', function (users){
	usernames = users;
	$('#membercontainer').empty();
	for(var i=0; i<usernames.length; i++) {
		$('#membercontainer').append("<h1>" + usernames[i] + "</h1>"); 
	}
});

const copyme = () => {
    navigator.clipboard.writeText(window.location.href);
        document.getElementById("copyme").innerHTML = "Link Copied!";
        setTimeout( () => {
            document.getElementById("copyme").innerHTML = "Meet Link";
            }, 1500);
}

