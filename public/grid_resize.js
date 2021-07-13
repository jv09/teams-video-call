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
	function () {
		Dish();
		window.onresize = Dish;
	},
	false,
	Dish()
);

window.addEventListener(
	"onresize",
	function () {
		Dish();
		window.onresize = Dish;
	},
	false
);

const chat = () => {
	
	var a = document.getElementById("main__right__1");
	var b = document.getElementById("main__left");
	
	if(a.style.display === "none" || b.style.width == "100%"){
		a.style.display = "flex";
		 document.getElementById("chat_message").focus();
		b.style.width = "80%";
	} 
	else {
		b.style.width = "100%";
		a.style.display = "none";
	}
	Dish();
};

var a = document.getElementById("membercontainer");
		//adds members present in the meet to the membercontainer after emptying existing members div
		const showmembers = () => {
			while (a.firstChild) {
				a.removeChild(a.lastChild);
			}
			for (let i = 0; i < usernames.length; i++) {
				let y = document.createElement("div");
				b.innerHTML = usernames[i];
				a.append(b);
			}
};	