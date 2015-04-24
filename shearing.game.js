//=======================================================================================
//  Program main:
//=======================================================================================

layerFunction.shearing = function (){

	var colors = ["black", "blue", "green", "red"];
	
	var wool_collected = [0, 0, 0];
	var wool_color_array = [];
	var wool_needed_array = [];
	
	var not_required_wool = 0;
	
	var task_complete = false;

function sheep_game_over() {
	for (var i = 0; i < wool_needed_array.length; ++i){
		if (wool_collected[i] < wool_needed_array[i]){
			return false;
		}
	}
	return true;
}

function run_game_over() {
	sequencer.newFunction(BLOCKING, function (next){
		$("#greyout")
			.css("display", "block")
			.transition({opacity: 0.5}, 500, "ease-in-out");
		$("#tally-box")
			.css("display", "block")
			.transition({opacity: 1}, 500, "ease-in-out", next);
	});

	var total = wool_needed_array[0] + wool_needed_array[1] + wool_needed_array[2];
	var score = wool_collected[0] + wool_collected[1] + wool_collected[2] - not_required_wool;
	var tokens_won = Math.max(0, Math.ceil((score / total) * 750));
	var xp_gained = Math.max(0, Math.ceil((score / total) * 750));;
		
	sequencer.newFunction(BLOCKING, function(next){
		$("#tally-box").transition({height: "+=133.33", top: "-=66.66"}, 500, "snap", function(){
			$(".tally-row#tally-sheep-sheared")
				.transition({opacity: 1.0}, 500, "ease-in-out", next)
				.children(".tally-value")
				.text(total);
		});
	});
	
	sequencer.newFunction(BLOCKING, function(next){
		$("#tally-box").transition({height: "+=133.33", top: "-=66.66"}, 500, "snap", function(){
			$(".tally-row#tally-sheep-oversheared")
				.transition({opacity: 1.0}, 500, "ease-in-out", next)
				.children(".tally-value")
				.text(not_required_wool);
		});
	});
	
	sequencer.newFunction(BLOCKING, function(next){
		$("#tally-box").transition({height: "+=133.33", top: "-=66.66"}, 500, "snap", function(){
			$(".tally-row#tally-total-score")
				.transition({opacity: 1.0}, 200, "ease-in-out", next)
				.children(".tally-value")
				.text(score);
		});
	});
	
	sequencer.newFunction(BLOCKING, function( next ){
		
		$(currentLayer.querySelector(".growth-display"))
			.css("display", "block")
			.transition({opacity: 1.0}, 500, "ease-in-out", function(){
				$(this).transition({width: 300}, 500, "snap");
				$(currentLayer.querySelector("#tally-box")).transition({left: 260}, 500, "snap", next);
		});
		
	});

	sequencer.newFunction(BLOCKING, function ( next ){
		$(currentLayer.querySelector(".growth-display .token-display")).transition({opacity: 1}, 500, "ease-in-out", next);
	});

	sequencer.newFunction(BLOCKING, function ( next ){
		
		var tokenDiv = currentLayer.querySelector(".growth-display .token-display .token-value");
		var money = Math.ceil(score / total * 750);
		var time = 800 / money;
		var toClear;
		function incrementToken (){
			var newVal = (parseInt(tokenDiv.innerHTML) || 0) + 1;
	        tokenDiv.innerHTML = newVal;
	        if (newVal <= money){
	            toClear = window.setTimeout(incrementToken, time);
	        } else {
	        	window.clearTimeout(toClear);
	        	next();
	        }
		}
		
		incrementToken();
		
	});

	sequencer.newFunction(BLOCKING, function ( next ){
		$(currentLayer.querySelector(".growth-display .xp-display")).transition({opacity: 1}, 500, "ease-in-out", next);
	});

	sequencer.newFunction(BLOCKING, function ( next ){		
		var xpDiv = currentLayer.querySelector(".growth-display .xp-display .xp-value");
		var xp = Math.ceil(score / total * 750);
		var time = 800 / xp ;
		var toClear;
		
		function incrementXP(){
			var newVal = (parseInt(xpDiv.innerHTML) || 0) + 1;
	        xpDiv.innerHTML = newVal;
	        if (newVal <= xp){
	        	toClear = window.setTimeout(incrementXP, time);
	        } else {
	        	window.clearTimeout(toClear);
	        	next();
	        }
		}
		
		incrementXP();
		
	});

	sequencer.newFunction(BLOCKING, function( next ){
		$(currentLayer.querySelector(".nav-buttons"))
			.css("display", "block")
			.transition({opacity: 1}, 500, "ease-in-out", function(){
			currentLayer.querySelector("#reset").addEventListener("click", function(){
				$("#tally-box, .growth-display, .nav-buttons").animate({opacity: 0}, 500, switchToLayer.bind(null, "shearing"));
			});
			currentLayer.querySelector("#back-to-main").addEventListener("click", switchToLayer.bind(null, "main"));
		});
	});
	
};


	

function Field (sequencer, selector, animalClass, wanderingClass, animateFreq ){

	this.sequencer = sequencer;
	this.selector = selector === undefined ? ".field" : selector;
	this.animalClass = animalClass === undefined ? "animal" : animalClass;
	this.wanderingClass = wanderingClass === undefined ? "field-wandering" : wanderingClass;
	this.animateFreq = animateFreq === undefined ? 500 : animateFreq;
	
	
	function shuffle( array ){
		var result = [];
		var deepArray = JSON.parse(JSON.stringify(array));
		while (deepArray.length){
			result.push(deepArray.splice(Math.floor(Math.random() * deepArray.length), 1)[0]);
		}
		return result;
	}

	//randomizing the number of wool needed
	for(var i = 0; i < 3; i++) {
		wool_needed_array[i] = Math.ceil(Math.random() * 4);
	}
	
	//randomizing the color wool needed 
	wool_color_array = shuffle(colors);
	var unneeded = wool_color_array.shift();
	
	//setting css file with appropriate stats

	$(".wool").each(function(i){
		this.querySelector(".wool-collected").innerHTML = 0;
		this.querySelector(".wool-name").innerHTML = wool_color_array[i];
		this.querySelector(".wool-color").style.background
			= "url('Resources/images/animal/" + wool_color_array[i] + "_sheep.png') bottom/60px auto";
	});
	
	this.element = $(this.selector);
	
	this.updater = function (){
	
		var self = this;
		
		$('.'+this.wanderingClass+'.'+this.animalClass).each(function(){
			
			var nUpdate = parseInt(this.getAttribute("duration"));
			
			var xPos = parseFloat(this.getAttribute("x-pos"));
			var yPos = parseFloat(this.getAttribute("y-pos"));
			
			var heading = parseFloat(this.getAttribute("heading"));
			
			if (nUpdate === 0){
				heading = Math.PI * 2 * Math.random();
				nUpdate = 150 + Math.round(Math.random() * 100);
			}

			var newXPos = xPos + Math.cos(heading) * 2; //was by 3
			var newYPos = yPos + Math.sin(heading) * 2; //was by 3
			
			var dims = this.getBoundingClientRect();
			
			if (newXPos > self.element.width() - dims.width || newXPos < 0){
				heading = Math.atan2(Math.sin(heading), -Math.cos(heading));
				newXPos = xPos + Math.cos(heading) * 3;
			}
					
			if (newYPos > self.element.height() - dims.height || newYPos < 0){
				heading = Math.atan2(-Math.sin(heading), Math.cos(heading));
				newYPos = yPos + Math.sin(heading) * 3;
			}
			
			this.setAttribute("duration", --nUpdate);
			this.setAttribute("x-pos", newXPos);
			this.setAttribute("y-pos", newYPos);
			this.setAttribute("heading", heading);
			$(this).transition({x: newXPos, y: newYPos}, 0, "linear");
			
		});
		
		if (!sheep_game_over()){
			this.toUnbind = window.setTimeout(this.updater, this.animateFreq);
		} else {
			window.clearTimeout(this.toUnbind);
		}
		
	}.bind(this);
	
	//Click functions, and what happens when sheep gets clicked.
	
	for (var i = 0; i < wool_color_array.length; ++i){
		(function (){
			var j = i;
			var self = this;
			this.element.on("click", "." + this.animalClass + "." + wool_color_array[j] + "_sheep:not(.deactive)", function(){
				this.classList.add("panic");
				if (wool_collected[j] + 1 > wool_needed_array[j]){
					++not_required_wool;
				} else {
					var scoreEl = document.getElementById("shearing").querySelectorAll(".wool .wool-collected")[j];
					scoreEl.innerHTML = ++wool_collected[j];
					$(scoreEl.cloneNode(true))
						.text("+1")
						.appendTo($(".wool")[j])
						.transition({top: -50, opacity: 0}, 500, "ease-in-out", function(){$(this).remove()});
				}
				this.classList.add('deactive');
				

				document.getElementById("not-required-wool").innerHTML = not_required_wool;
				
				if(sheep_game_over()){
					window.clearTimeout(self.toUnbind);
					run_game_over();
				}
				
			});		
			
		}).bind(this)();
	}
	
}

Field.prototype.spawn = function (animalType, blocking){
	this.sequencer.newFunction(blocking, function(next){
		
	var newElement = document.createElement("div");
	var wanderingClass = this.wanderingClass;
	newElement.classList.add(this.animalClass);
	newElement.classList.add(animalType.elementClass);
	
	this.element.append(newElement);
		
	var dims = newElement.getBoundingClientRect();
	
	newElement.setAttribute("heading", Math.PI * 2 * Math.random());
	newElement.setAttribute("x-pos", Math.random() * (this.element.width() - dims.width));
	newElement.setAttribute("y-pos", Math.random() * (this.element.height() - dims.height));
	newElement.setAttribute("duration", 150 + Math.round(Math.random() * 100));
	
	$(newElement).transition({
		opacity: 0.0,
		x: parseFloat(newElement.getAttribute("x-pos")),
		y: parseFloat(newElement.getAttribute("y-pos")) - 50
	}, 0, "linear", function(){
		$(newElement).transition({
			opacity: 1,
			y: "+=50"
		}, 500, "ease", function (){
			$(newElement).addClass(wanderingClass).bind();
		});
	});
	
	if (this.toUnbind === undefined){
		this.toUnbind = window.setTimeout(this.updater, this.animateFreq);
	}
	next();
	
}.bind(this))};	
	

//
// initialize variables
//

var sequencer = new Sequential();
	
var dialog = new Dialog(sequencer, undefined, "#dialog-box", "#dialog-head");
var field = new Field(sequencer, undefined, undefined, undefined, 30);

var black_sheep = new Animal("black_sheep", undefined, undefined, "images/black_sheep.png");
var blue_sheep = new Animal("blue_sheep", undefined, undefined, "images/blue_sheep.png");
var red_sheep = new Animal("red_sheep", undefined, undefined, "images/red_sheep.png");
var green_sheep = new Animal("green_sheep", undefined, undefined, "images/green_sheep.png");

var game_not_over = true;

sequencer.newFunction(BLOCKING, function(next){
	$("#dialog-head, #dialog-box").transition({opacity: 1}, 500, "ease-in-out");
	window.setTimeout(next, 500);
});

//display the beginning of the game
dialog.printDialog("Baaaaa! Help me collect wool from my children!", BLOCKING);

//move the dialog box to the bottom
dialog.promptNext(BLOCKING);
dialog.clearDialog(BLOCKING);

sequencer.newFunction(BLOCKING, function (next){	
	$(currentLayer.querySelector("#greyout"))
		.transition({ opacity: 0 }, 500, "ease-in-out", 
			function (){
				this.css("display", "none");
				dialog.element.transition({ bottom : 90 }, 500, "ease-in-out",
						function(){this.css("z-index", 3)});
				dialog.head.transition({ bottom : 0 }, 500, "ease-in-out",
						function(){this.css("z-index", 3)});
				window.setTimeout(next, 500);
			}
		);
});


//
// create sequence of actions
//
// Each element in the list contains a function call, each 
// returning a function. When a function completes its task
// or gets the expected input, the next function is called.
//

dialog.clearDialog(BLOCKING);
dialog.printDialog('Make sure to only shear what you need!', BLOCKING);
dialog.promptNext(BLOCKING);


for(var i = 0; i < 4; i++) {
	field.spawn(black_sheep, NONBLOCK);
	field.spawn(blue_sheep, NONBLOCK);
	field.spawn(red_sheep, NONBLOCK);
	field.spawn(green_sheep, NONBLOCK);
};

dialog.clearDialog(BLOCKING);
dialog.printDialog('Can you shear for me ' + wool_needed_array[0] + ' ' + wool_color_array[0] + ', ' + wool_needed_array[1] + ' ' + wool_color_array[1] + ' and ' + wool_needed_array[2] + ' ' + wool_color_array[2] + ' sheep?', BLOCKING);

};