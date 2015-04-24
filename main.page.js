layerFunction.main = function (){

var data = fetchPlayerData();

if (data.isNewPlayer()){
	var sequencer = new Sequential();
	var dialog = new Dialog(sequencer, 15);
	
	data.setNew(false);
	
	sequencer.newFunction(BLOCKING, function( next ){
		$("#greyout").css("display", "block");
		$(".dialog-head, .dialog-box")
			.css("display", "block");
		window.setTimeout(next, 500);
	});
	
	dialog.clearDialog(BLOCKING);
	dialog.printDialog("Thanks neighbor! You did a pretty good job here.", BLOCKING);
	dialog.promptNext(BLOCKING);

	dialog.clearDialog(BLOCKING);
	dialog.printDialog("Here on out you can do similar tasks like this and gain XP points and gold tokens.", BLOCKING);
	dialog.promptNext(BLOCKING);

	sequencer.newFunction(BLOCKING, function( next ){
		$(".task").each(function(){
			$(this.cloneNode())
				.addClass("to-delete")
				.empty()
				.css({"z-index": 10, opacity: 0})
				.appendTo(currentLayer)
				.transition({opacity: 1}, 500, "ease-in-out");
		});
		window.setTimeout(next, 500);
	});
	
	dialog.clearDialog(BLOCKING);
	dialog.printDialog("See these properties? Some of them you can't buy yet, but don't worry, complete enough tasks and one day you will be able to buy all of them!", BLOCKING);
	dialog.promptNext(BLOCKING);

	dialog.clearDialog(BLOCKING);
	dialog.printDialog("Each property has it's own task that you can complete over and over again to obtain gold tokens as well as XP points.", BLOCKING);
	dialog.promptNext(BLOCKING);

	dialog.clearDialog(BLOCKING);
	dialog.printDialog("Generate enough XP points and you'll go up a level!", BLOCKING);
	dialog.promptNext(BLOCKING);

	sequencer.newFunction(BLOCKING, function( next ){
		$(".to-delete").transition({opacity: 0}, 500, "ease-in-out", function(){
			$(this).remove();
		});
		window.setTimeout(next, 500);
	})
	
	dialog.clearDialog(BLOCKING);
	dialog.printDialog("I hope you enjoy working on this farm as much as I did!", BLOCKING);
	dialog.promptNext(BLOCKING);

	dialog.clearDialog(BLOCKING);
	dialog.printDialog("Oh look at the time! I must be going, good luck neighbor!", BLOCKING);
	dialog.promptNext(BLOCKING);
	
	sequencer.newFunction(BLOCKING, function( next ){
		$("#greyout").transition({opacity: 0}, 500, "ease-in-out", function(){
				$(this).css("display", "none");
			});
		$(".dialog-head, .dialog-box").transition({opacity: 1.0}, 500, "ease-in-out", function(){
				$(this).css("display", "none");
			});
		$(document.querySelectorAll(".resource-display")).transition({opacity: 1.0}, 500, "ease-in-out");		
		window.setTimeout(next, 500);
		
	});
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
				'url("Resources/images/property_icon/' + tasks[task] + '_locked.png") center/cover';
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

