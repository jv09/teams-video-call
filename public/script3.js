const socket = io("/");
const MC = document.getElementById("CS");
const chat_value = document.getElementById("chat_message__room");

socket.emit('JRH', roomId, username);

socket.on("createMessage", (mes, username) => {
	var timestr = new Date();
	rendermessage(mes, username, timestr);
});

var STH = function (str) {
	var parser = new DOMParser();

	str = String(str);

	var doc = parser.parseFromString(str, "text/html");

	return doc.body.innerHTML;
};

const chatrender = () => {

	socket.emit("message", chat_value.value, username);
	 chat_value.value = '';
	 document.getElementById("chat_message__room").focus();
};
const rendermessage = (mes, username, timestr) => {

	box = document.createElement("div");
	box.className = "card";
	box.style.marginBottom = "0.5%";
	
	boxB = document.createElement("div");
	boxB.className = "card-body";
	boxT = document.createElement("h5");
	boxT.className = "card-title";
	boxT.innerHTML = username;
	boxT.style.fontSize = "15px";

	boxST = document.createElement("h6");
	boxST.style.fontSize = "12px";
	boxST.className = "card-subtitle mb-2 text-muted";
	boxST.innerHTML = timestr;

	boxtext = document.createElement("div");
	boxtext.innerHTML = mes;
	boxtext.style.fontSize = "12px";
   
	boxB.appendChild(boxT);
	boxB.appendChild(boxST);
	boxB.appendChild(boxtext);
	box.appendChild(boxB);
	MC.append(box);
	MC.scrollTop = MC.scrollHeight;
};

$(document).keydown((e) => {
    var msg = document.getElementById("chat_message__room");
    var isFocused = document.activeElement === msg;
    if (e.which == 13 && msg.value.length !== 0 && isFocused) {
         
          chatrender();
      }
  })


  const SM =() => {
	var MN = document.getElementById("MN").value;
	var MD = document.getElementById("MD").value;
	var MT = document.getElementById("MT").value;

	var msg = `<br>Meet Details-<br>
				Meet scheduled by: ${username}<br> 
				Meet name: ${MN}<br>
				Meet start date: ${MD}<br>
				Meet start time: ${MT}<br>
				<br>
				enter team room 
				<button class="btn btn-secondary">
				<a href='./'   type="button"  style="color:white; text-dexoration: none">click here</a></button>`;


    socket.emit("message", username, STH(msg));

  }