const socket = io("/");

const messages = document.getElementById("main__chat__window__room");
const chat_value = document.getElementById("chat_message__room");

socket.emit('join-room-home', roomId, username);

socket.on("createMessage", (mes, username) => {
  console.log( "wfwffwfwfwffwfww ", username)
	show(mes, username);
});
const message = () => {

	socket.emit("message", chat_value.value, username);
	 chat_value.value = '';
	 document.getElementById("chat_message__room").focus();
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

$(document).keydown((e) => {
    var msg = document.getElementById("chat_message__room");
    var isFocused = document.activeElement === msg;
    if (e.which == 13 && msg.value.length !== 0 && isFocused) {
          //console.log(msg.val());
          message();
      }
  })
