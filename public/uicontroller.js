function enableUiControls(localStream) {

  $("#mic_btn").prop("disabled", false);
  $("#video_btn").prop("disabled", false);
  $("#screen_share_btn").prop("disabled", false);
  $("#exit_btn").prop("disabled", false);

  $("#mic_btn").click(function(){
    setMic(localStream);
    
  });

  $("#video_btn").click(function(){
    setVideo(localStream);
  });

  $("#screen_share_btn").click(function () {
    setScreenShareBtn(); // set screen share button icon
    $("#screen_share_btn").prop("disabled", true); // disable the button on click
    if(screenShareActive){
      stopScreenShare();
       document.getElementById("screen_share_icon").innerHTML =
                    "screen_share";
    } else {
      initScreenShare(agoraAppId, channelName);
          document.getElementById("screen_share_icon").innerHTML =
                        "stop_screen_share";
    }
  
  });

  $("#exit_btn").click(function(){

    leaveChannel(); 
  });

}

function setBtn(btn){
  btn.toggleClass('btn-danger');
}

function setScreenShareBtn() {
  $('#screen_share_btn').toggleClass('btn-danger');
  

}

function setVisibility(elementID, visible) {
  if (visible) {
    $(elementID).attr("style", "display:block");
  } else {
    $(elementID).attr("style", "display:none");
  }
}

function setMic(localStream) {
  setBtn($("#mic_btn")); // toggle button colors
  // toggle the mic icon
   var mic_button=document.getElementById("mic_icon")
            
  if (mic_button.innerHTML == "mic_off") {
    mic_button.innerHTML="mic";
    localStream.unmuteAudio(); // enable the local mic
    setVisibility("#mute-overlay", false); // hide the muted mic icon
  } else {
    mic_button.innerHTML = "mic_off";
    localStream.muteAudio(); // mute the local mic
    setVisibility("#mute-overlay", true); // show the muted mic icon
  }
}

function setVideo(localStream) {
  setBtn($("#video_btn")); // toggle button colors
  var vid_button = document.getElementById("video_icon");
  if (vid_button.innerHTML == "videocam_off") {
        vid_button.innerHTML = "videocam";
        localStream.unmuteVideo(); // enable the local video
        setVisibility("#no-local-video", false); // hide the user icon when video is enabled
  } else {
        vid_button.innerHTML = "videocam_off";
        localStream.muteVideo(); // disable the local video
        setVisibility("#no-local-video", true); // show the user icon when video is disabled
    }
}


$(document).keydown((e) => {
  var msg = document.getElementById("text_message");
  var isFocused = document.activeElement === msg;
  if (e.which == 13 && msg.value.length !== 0 && isFocused) {
        //console.log(msg.val());
        chatrender();
    }
})