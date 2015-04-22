
var currentLayer;
var layerFunction = {};
var stateMapping = {};

function switchToLayer (layerName){
	var audioEls, i;

	// if the current layer already exists
	if (currentLayer !== undefined){
		// hide it
		currentLayer.style.display = "none";
		
		// mute it
		audioEls = currentLayer.querySelectorAll("audio");
		for (i = audioEls.length; i--;){
			audioEls[i].pause();
			audioEls[i].currentTime = 0.0;
		}
	}
	
	// clone the new visible layer. this will make sure that event listeners
	// are not attached when switching.
	oldLayer = document.getElementById(layerName);
	currentLayer = stateMapping[layerName].cloneNode(true);
	document.body.replaceChild(currentLayer, oldLayer);
	
	// play its audio
	audioEls = currentLayer.querySelectorAll("audio");
	for (i = audioEls.length; i--;){
		audioEls[i].currentTime = 0.0;
		audioEls[i].play();
	}
	
	// make it visible
	currentLayer.style.display = "block";
	
	// scope jQuery, so that selectors in different functions don't 
	// accidentally modify elements from different layers
	$ = function (selector){ return jQuery(selector, currentLayer)};
	
	layerFunction[layerName]();
	
}

window.onload = function(){
	var initialState = document.querySelectorAll(".layer");
	stateMapping = {
		"intro": initialState[0].cloneNode(true),
		"main": initialState[1].cloneNode(true),
		"eggsort": initialState[2].cloneNode(true)
	};

	if (fetchPlayerData().isNewPlayer()){
		switchToLayer("intro");
	} else { 
		switchToLayer("main");
	}

};