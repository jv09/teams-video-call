// UI buttons
function enableUiControls(localStream) {

    $("#mic-btn").prop("disabled", false);
    $("#video-btn").prop("disabled", false);
    $("#screen-share-btn").prop("disabled", false);
    $("#exit-btn").prop("disabled", false);
  
    $("#mic-btn").click(function(){
      toggleMic(localStream);
      
    });
  
    $("#video-btn").click(function(){
      toggleVideo(localStream);
    });
  
    $("#screen-share-btn").click(function () {
      console.log(123);
      toggleScreenShareBtn(); // set screen share button icon
      $("#screen-share-btn").prop("disabled", true); // disable the button on click
      console.log(screenShareActive)
      if(screenShareActive){
        stopScreenShare();
         document.getElementById("screen-share-icon").innerHTML =
                      "screen_share";
      } else {
        console.log('chup')
        initScreenShare(agoraAppId, channelName);
            document.getElementById("screen-share-icon").innerHTML =
                          "stop_screen_share";
      }
    
    });
  
    $("#exit-btn").click(function(){
      console.log("leave channel");
      leaveChannel(); 
    });
  
    // keyboard listeners 
    $(document).on('keydown',function (e) {
    
      if (e.ctrlKey) {
        switch (e.key) {
                  case "m":
                      console.log("squick toggle the mic");
                      toggleMic(localStream);
                      break;
                  case "v":
                      console.log("quick toggle the video");
                      toggleVideo(localStream);
                      break;
                  case "x":
                      console.log("initializing screen share");
                      toggleScreenShareBtn(); // set screen share button icon
                      $("#screen-share-btn").prop("disabled", true); // disable the button on click
                      if (screenShareActive) {
              stopScreenShare();
               document.getElementById("screen-share-icon").innerHTML =
                                  "screen_share";
            } else {
               document.getElementById("screen-share-icon").innerHTML =
                                  "stop_screen_share";
                          initScreenShare(agoraAppId, channelName);
                      }
                      break;
                  case "q":
                      console.log("so sad to see you quit the channel");
                      leaveChannel();
                      break;
                  case "z":
                      chat()
                      break;
                  default: // do nothing
              }
  
        // (for testing) 
        if (e.key === "r") {
          window.history.back(); // quick reset
        }
      }
    });
  }
  
  function toggleBtn(btn){
    btn.toggleClass('btn-danger');
  }
  
  function toggleScreenShareBtn() {
    $('#screen-share-btn').toggleClass('btn-danger');
    
  
  }
  
  function toggleVisibility(elementID, visible) {
    if (visible) {
      $(elementID).attr("style", "display:block");
    } else {
      $(elementID).attr("style", "display:none");
    }
  }
  
  function toggleMic(localStream) {
    toggleBtn($("#mic-btn")); // toggle button colors
    // toggle the mic icon
     var mic_button=document.getElementById("mic-icon")
              
    if (mic_button.innerHTML == "mic_off") {
      mic_button.innerHTML="mic";
      localStream.unmuteAudio(); // enable the local mic
      toggleVisibility("#mute-overlay", false); // hide the muted mic icon
    } else {
      mic_button.innerHTML = "mic_off";
      localStream.muteAudio(); // mute the local mic
      toggleVisibility("#mute-overlay", true); // show the muted mic icon
    }
  }
  
  function toggleVideo(localStream) {
    toggleBtn($("#video-btn")); // toggle button colors
    var vid_button = document.getElementById("video-icon");
    if (vid_button.innerHTML == "videocam_off") {
      vid_button.innerHTML = "videocam";
          localStream.unmuteVideo(); // enable the local video
          toggleVisibility("#no-local-video", false); // hide the user icon when video is enabled
    } else {
      vid_button.innerHTML = "videocam_off";
          localStream.muteVideo(); // disable the local video
          toggleVisibility("#no-local-video", true); // show the user icon when video is disabled
      }
  }
  
  
  $(document).keydown((e) => {
    var msg = document.getElementById("chat_message");
    var isFocused = document.activeElement === msg;
    if (e.which == 13 && msg.value.length !== 0 && isFocused) {
          //console.log(msg.val());
          message();
      }
  })