layerFunction.main = function (){

var data = fetchPlayerData();

if (data.isNewPlayer()){
	data.setNew(false);
}
	
var mainMusic = new Audio('audio/bgm.mp3');
var taskMusic = new Audio('audio/task.mp3');

var tasks = {
	shearing: "sheep_pen",
	eggsort: "chicken_coup",
	stable: "stable",
	pigpen: "pig_pen"
};

for (var task in tasks){
	if (tasks.hasOwnProperty(task)){
		if (!data.hasUnlockedTask(task)){
			var locked = currentLayer.querySelector("#" + tasks[task] + "-link");
			locked.style.background = 
				'url("resources/images/property_icon/' + tasks[task] + '_locked.png") center/cover';
			locked.classList.toggle("locked");
		}
	}
}

var layerChangers = currentLayer.querySelectorAll(".layer-switcher:not(.locked)");
for (var i = layerChangers.length; i--;){
	layerChangers[i].addEventListener("click", function(){
		switchToLayer(this.dataset.targetlayer);
	});
}


};

