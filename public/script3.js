const socket = io("/");
const messages = document.getElementById("chat-show");
const chat_value = document.getElementById("chat_message__room");

socket.emit('join-room-home', roomId, username);

socket.on("createMessage", (mes, username) => {
	var timestr = new Date();
	show(mes, username, timestr);
});

var stringToHTML = function (str) {
	var parser = new DOMParser();

	str = String(str);

	var doc = parser.parseFromString(str, "text/html");

	return doc.body.innerHTML;
};

const message = () => {

	socket.emit("message", chat_value.value, username);
	 chat_value.value = '';
	 document.getElementById("chat_message__room").focus();
};
const show = (mes, username, timestr) => {

	card = document.createElement("div");
	card.className = "card";
	card.style.marginBottom = "0.5%";
	
	cardbody = document.createElement("div");
	cardbody.className = "card-body";
	cardtitle = document.createElement("h5");
	cardtitle.className = "card-title";
	cardtitle.innerHTML = username;
	cardtitle.style.fontSize = "15px";

	cardsubtitle = document.createElement("h6");
	cardsubtitle.style.fontSize = "12px";
	cardsubtitle.className = "card-subtitle mb-2 text-muted";
	cardsubtitle.innerHTML = timestr;

	cardtext = document.createElement("div");
	cardtext.innerHTML = mes;
	cardtext.style.fontSize = "12px";
   
	cardbody.appendChild(cardtitle);
	cardbody.appendChild(cardsubtitle);
	cardbody.appendChild(cardtext);
	card.appendChild(cardbody);
	messages.append(card);
	messages.scrollTop = messages.scrollHeight;
};

$(document).keydown((e) => {
    var msg = document.getElementById("chat_message__room");
    var isFocused = document.activeElement === msg;
    if (e.which == 13 && msg.value.length !== 0 && isFocused) {
          //console.log(msg.val());
          message();
      }
  })


  const schedulemeet =() => {
	var name = document.getElementById("meetname").value;
	var date = document.getElementById("meetdate").value;
	var time = document.getElementById("meettime").value;

	var msg = `<br><b>Meet Details-<br>
				Meet scheduled by: ${username}<br> 
				Meet name: ${name}<br>
				Meet start date: ${date}<br>
				Meet start time: ${time}<br>
				</b><br>
				To enter meet room 
				<button class="btn btn-primary">
				<a href='./'   type="button"  style="color:white; text-dexoration: none">click here</a></button>`;
		console.log(msg)
		mes =stringToHTML(msg);
		console.log(mes);
    socket.emit("message", username, mes);

  }