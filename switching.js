
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
	document.body.removeChild(oldLayer)
	document.body.appendChild(currentLayer);
	
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
	$ = function (selector){ return jQuery(selector, document.getElementById(layerName))};

	document.querySelector("#token-display .resource-type-count").innerHTML = fetchPlayerData().getMoney();
	document.querySelector("#xp-display .resource-type-count").innerHTML = fetchPlayerData().getXP();

	for (var i = 0; i < 9999; ++i){
		window.clearTimeout(i);
		window.clearInterval(i);
	}
	
	layerFunction[layerName]();
	
}

window.onload = function(){
	var initialState = document.querySelectorAll(".layer");
	stateMapping = {
		"intro": initialState[0].cloneNode(true),
		"main": initialState[1].cloneNode(true),
		"eggsort": initialState[2].cloneNode(true),
		"shearing": initialState[3].cloneNode(true),
		"shop": initialState[4].cloneNode(true)
	};
	
	if (fetchPlayerData().isNewPlayer()){
		$(".resource-display").css('opacity', 0);
		switchToLayer("intro");
	} else { 
		switchToLayer("main");
	}

};
