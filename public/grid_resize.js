function A(I, C, W, H, M = 10) {
	let i = (w = 0);
	let h = I * 0.75 + M * 1.2;
	while (i < C) {
		if (w + I > W) {
			w = 0;
			h = h + I * 0.75 + M * 2;
		}
		w = w + I + M * 2;
		i++;
	}
	if (h > H) return false;
	else return I;
}
function Dish() {

	let M = 2;
	let Scenary = document.getElementById("VG");
	let W = Scenary.offsetWidth - M * 0.8;
	let H = Scenary.offsetHeight - M * 0.8;
	let Cameras = document.getElementsByClassName("user-container");
	let max = 0;

	// loop (i recommend you optimize this)
	let i = 1;
	while (i < 5000) {
		let w = A(i, Cameras.length, W, H, M);
		if (w === false) {
			max = i - 1;
			break;
		}
		i++;
	}

	
	max = max - M * 1.2;
	sw(max, M);
}


function sw(W, M) {
	let Cameras = document.getElementsByClassName("user-video");
	for (var s = 0; s < Cameras.length; s++) {
		Cameras[s].style.width = W + "px";
		Cameras[s].style.margin = M + "px";
		Cameras[s].style.height = W * 0.75 + "px";
	}
}

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

const gchatg = () => {
	
	var a = document.getElementById("main__right__1");
	var b = document.getElementById("main__left");
	
	if(a.style.display === "none" || b.style.width == "100%"){
		a.style.display = "flex";
	
		b.style.width = "80%";
	} 
	else {
		b.style.width = "100%";
		a.style.display = "none";
	}
	Dish();
};

