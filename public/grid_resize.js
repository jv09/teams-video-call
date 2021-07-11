function Area(Increment, Count, Width, Height, Margin = 10) {
	let i = (w = 0);
	let h = Increment * 0.75 + Margin * 1.2;
	while (i < Count) {
		if (w + Increment > Width) {
			w = 0;
			h = h + Increment * 0.75 + Margin * 2;
		}
		w = w + Increment + Margin * 2;
		i++;
	}
	if (h > Height) return false;
	else return Increment;
}
// Dish:
function Dish() {
	console.log("ok");
	// variables:
	let Margin = 2;
	let Scenary = document.getElementById("video-grid");
	let Width = Scenary.offsetWidth - Margin * 0.8;
	let Height = Scenary.offsetHeight - Margin * 0.8;
	let Cameras = document.getElementsByClassName("user-container");
	let max = 0;

	// loop (i recommend you optimize this)
	let i = 1;
	while (i < 5000) {
		let w = Area(i, Cameras.length, Width, Height, Margin);
		if (w === false) {
			max = i - 1;
			break;
		}
		i++;
	}

	// set styles
	max = max - Margin * 1.2;
	setWidth(max, Margin);
}

// Set Width and Margin
function setWidth(width, margin) {
	let Cameras = document.getElementsByClassName("user-video");
	for (var s = 0; s < Cameras.length; s++) {
		Cameras[s].style.width = width + "px";
		Cameras[s].style.margin = margin + "px";
		Cameras[s].style.height = width * 0.75 + "px";
	}
}

// Load and Resize Event
window.addEventListener(
	"load",
	function (event) {
		Dish();
		window.onresize = Dish;
	},
	false,
	Dish()
);

window.addEventListener(
	"onresize",
	function (event) {
		Dish();
		window.onresize = Dish;
	},
	false
);

const chat = () => {
	
	var x = document.getElementById("main__right__1");
	var y = document.getElementById("main__left");
	var z = document.getElementById("main__right__2");
	
	
	if ((x.style.display === "none" || y.style.width == "100%") && z.style.display != "none") {
		x.style.display = "flex";
		document.getElementById("chat_message").focus();
		y.style.width = "80%";
		document.getElementById("chat-btn").innerHTML = "chat_bubble_outline";
		z.style.display = "none";
	} else if(x.style.display === "none" || y.style.width == "100%"){
		x.style.display = "flex";
		 document.getElementById("chat_message").focus();
		y.style.width = "80%";
		document.getElementById("chat-btn").innerHTML = "chat_bubble_outline";
	} 
	else {
		y.style.width = "100%";
		x.style.display = "none";
		document.getElementById("chat-btn").innerHTML = "chat_bubble";
	}
	Dish();
};
const change_color = () => {
	document.getElementById("mic-btn").style.backgroundColor="#cc3833";
}

const participants = () => {
	
	var x = document.getElementById("main__right__2");
	var y = document.getElementById("main__left");
	var z = document.getElementById("main__right__1");
	
	
	if ((x.style.display === "none" || y.style.width == "100%") && z.style.display != "none") {	
		x.style.display = "flex";
		y.style.width = "80%";
		z.style.display = "none";
		document.getElementById("chat-btn").innerHTML = "chat_bubble";
	} else if (x.style.display === "none" || y.style.width == "100%"){
		x.style.display = "flex";
		y.style.width = "80%";
	}  
	else {
		y.style.width = "100%";
		x.style.display = "none";
	}
	Dish();
};

const getChat = (check) => {
	if(check == 0){
		participants();
		check = 1;
	}else{
		chat();
		check = 0;
	}
}