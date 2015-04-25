
var currentLayer;
var layerFunction = {};
var stateMapping = {};
var music = {
	"task": new Audio("audio/task.mp3"),
	"main": new Audio("audio/bgm.mp3")
};
var currentAudio;
var paused = false;

function switchToLayer (layerName){
	var audioEls, i;

	// if the current layer already exists
	if (currentLayer !== undefined){
		// hide it
		currentLayer.style.display = "none";
	}
	
	// clone the new visible layer. this will make sure that event listeners
	// are not attached when switching.
	
	oldLayer = document.getElementById(layerName);
	currentLayer = stateMapping[layerName].el.cloneNode(true);
	document.body.removeChild(oldLayer);
	document.body.appendChild(currentLayer);
	
	// make it visible
	currentLayer.style.display = "block";
	
	// play music
	if (currentAudio !== stateMapping[layerName].audio){
		if (!paused && currentAudio !== undefined){
			music[currentAudio].pause();
			music[currentAudio].currentTime = 0;
		}
		currentAudio = stateMapping[layerName].audio;
		if (!paused){
			music[currentAudio].currentTime = 0;
			music[currentAudio].loop = true;
			music[currentAudio].play();
		}
	}
	
	// scope jQuery, so that selectors in different functions don't 
	// accidentally modify elements from different layers
	$ = function (selector){ return jQuery(selector, document.getElementById(layerName))};

	document.querySelector("#token-display .resource-type-count").innerHTML = fetchPlayerData().getMoney();
	document.querySelector("#xp-display .resource-type-count").innerHTML = fetchPlayerData().getXP();

	for (var i = 0; i < 9999; ++i){
		window.clearTimeout(i);
		window.clearInterval(i);
	}
	
	document.getElementById("splash").style.display = "none";
	
	layerFunction[layerName]();
	
}

window.onload = function(){
	jQuery(document.getElementById("splash")).transition(
			{opacity: 0}, 500, "ease-in-out", function(){
				$(this).css("display", "none");
			});
	var initialState = document.querySelectorAll(".layer");
	stateMapping = {
		"intro": {el: initialState[0].cloneNode(true), audio: "task"},
		"main": {el: initialState[1].cloneNode(true), audio: "main"},
		"eggsort": {el: initialState[2].cloneNode(true), audio: "task"},
		"shearing": {el: initialState[3].cloneNode(true),  audio: "task"},
		"shop": {el: initialState[4].cloneNode(true),  audio: "main"}
	};
	
	document.getElementById("mute").addEventListener("click", function(){
		this.classList.toggle("muted");
		if (paused){
			paused = false;
			music[currentAudio].play();
		} else if (!paused){
			paused = true;
			music[currentAudio].pause();
		}
	});
	fetchPlayerData().reset();
	
	
	/*if (fetchPlayerData().isNewPlayer()){*/
		$(".resource-display").css('opacity', 0);
		switchToLayer("intro");
	/*} else { 
		switchToLayer("main");
	}*/

};
