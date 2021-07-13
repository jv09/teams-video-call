var usernames = [];

var cameraVideoProfile = "480P_4"; 
var screenVideoProfile = "480P_4";
const socket = io("/");

var client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
var screenClient;

var remoteStreams = {}; 
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


var screenShareActive = false; 

function initClientJoinChannel() {

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

			
      		
	 	},
	 	function (err) {
	 		console.log("[ERROR] : AgoraRTC client init failed", err);
 	}
);
}

initClientJoinChannel();

client.on("stream-published", function (evt) {
	
	console.log("Publish local stream successfully");
});

client.on("stream-added", function (evt) {
	var stream = evt.stream;
	var streamId = stream.getId();
	console.log("new stream added: " + streamId);
	
	
	client.subscribe(stream, function (err) {
		console.log("[ERROR] : subscribe stream failed", err);
	});
		
});

client.on("stream-subscribed", function (evt) {
	var remoteStream = evt.stream;
	var remoteId = remoteStream.getId();
	console.log("Subscribe remote stream successfully: " + remoteId);

	addRemoteStreamMiniView(remoteStream);
});


client.on("peer-leave", function (evt) {
	var streamId = evt.stream.getId(); 
	
	var remoteContainerID = "#" + streamId + "_container";
	$(remoteContainerID).empty().remove(); 
	Dish();
});

client.on("mute-audio", function (evt) {
	document.getElementById(evt.uid + "_mute").style.backgroundColor = "#cc3898";
	setVisibility("#" + evt.uid + "_mute", true);
});

client.on("unmute-audio", function (evt) {
	setVisibility("#" + evt.uid + "_mute", false);
});

client.on("mute-video", function (evt) {
	var remoteId = evt.uid;
	
	
	if (remoteId != mainStreamId) {
		
		setVisibility("#" + remoteId + "_no-video", true);
	}
});

client.on("unmute-video", function (evt) {
	setVisibility("#" + evt.uid + "_no-video", false);
});

function joinChannel(channelName, uid, token, username) {
	client.join(
		token,
		channelName,
		uid,
		username,
		function (uid, username) {
			console.log("User with uid: " + uid + " join channel successfully");
			createCameraStream(uid);
			localStreams.camera.id = uid; 
		},
		function (err) {
			console.log("[ERROR] : join channel failed", err);
		}
	);
}

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
				
			
			addRemoteStreamMiniView(localStream);

			client.publish(localStream, function (err) {
			
				console.log("[ERROR] : publish local stream error: " + err);
			});

			enableUiControls(localStream); 
			localStreams.camera.stream = localStream; 
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
	
	localStreams.screen.id = screenuid;

	
	var screenStream = AgoraRTC.createStream({
		streamID: screenuid,
		audio: false, 
		video: false,
		screen: true, 
		screenAudio: true,
		mediaSource: "screen", 
	});

	screenStream.setVideoProfile(screenVideoProfile);
	
	screenStream.init(
		function () {
			console.log("getScreen successful");
			localStreams.screen.stream = screenStream;
			screenShareActive = true;
			$("#screen_share_btn").prop("disabled", false); 
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
			localStreams.screen.id = ""; 
			localStreams.screen.stream = {}; 
			screenShareActive = false;
			toggleScreenShareBtn(); 
			$("#screen-share-btn").prop("disabled", false); 
		}
	);

}

function stopScreenShare() {

	localStreams.screen.stream.disableVideo(); 
	localStreams.screen.stream.stop(); 
	localStreams.screen.stream.close();
	localStreams.camera.stream.enableVideo(); 
	$("#video_btn").prop("disabled", false);
	screenClient.leave(
		function () {
			screenShareActive = false;
			console.log("screen client leaves channel");
			$("#screen_share_btn").prop("disabled", false); 
			localStreams.screen.stream.stop();
			screenClient.unpublish(localStreams.screen.stream); 
			localStreams.screen.stream.close(); 
			localStreams.screen.id = ""; 
			localStreams.screen.stream = {}; 
		},
		function (err) {
			console.log("client leave failed ", err);
		}
	);
}


function addRemoteStreamMiniView(remoteStream) {

	var streamId = remoteStream.getId();
	$("#VG").append(
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
			localStreams.camera.stream.stop();
			client.unpublish(localStreams.camera.stream); 
			localStreams.camera.stream.close(); 
			$("#remote-streams").empty(); 
		
			$("#mic_btn").prop("disabled", true);
			$("#video_btn").prop("disabled", true);
			$("#screen_share_btn").prop("disabled", true);
			$("#exit_btn").prop("disabled", true);
			
			setVisibility("#mute-overlay", false);
			setVisibility("#no-local-video", false);
			Dish();
			redirec();
		},
		function (err) {
			console.log("client leave failed ", err); 
		}
	);
}

const MG = document.getElementById("main__chat__window_1");
const chat_value = document.getElementById("text_message");
socket.on("createMessage", (mes, username) => {
	rendermessage(mes, username);
});
const chatrender = () => {

	socket.emit("message", chat_value.value, username);
	 chat_value.value = '';
	 document.getElementById("text_message").focus();
};
const rendermessage = (mes, username) => {
	div = document.createElement("div");
	divname = document.createElement("div");
	divname.innerHTML = username;
	divname.className = "messageuser"
	divname.setAttribute("align", "left");
	div.innerHTML = mes;
	div.className = "message";
	div.setAttribute("align", "left");
	MG.append(divname);
	MG.append(div);
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
            }, 1500)}
