//=======================================================================================
//  Program main:
//=======================================================================================

window.onload = function (){
	
	

	var wool1 = 0;
	var wool2 = 0;
	var wool3 = 0;
	
	var color_wool1;
	var color_wool2;
	var color_wool3;

	var wool_color_array = [];
	
	var wool_needed_array = [];
	
	var not_required_wool = 0;
	
	var task_complete = false;
	
	var red_wool_full = false;
	var blue_wool_full = false;
	var green_wool_full = false;
	var black_wool_full = false;
	
function sheep_game_over() {
	if(wool1 == wool_needed_array[0] && wool2 == wool_needed_array[1] && wool3 == wool_needed_array[2])
		return true;
	return false;
}

function run_game_over() {
	sequencer.newFunction(BLOCKING, function (next){
		$(document.getElementById("greyout"))
			.css("display", "block")
			.transition({opacity: 0.5}, 500, "ease-in-out");
		$(document.getElementById("tally-box"))
			.css("display", "block")
			.transition({opacity: 1}, 500, "ease-in-out", next);
	});

	var score = wool1 + wool2 + wool3 - not_required_wool;
	var tokens_won = 0;
	if (score <= 0 )
		tokens_won = 0;
	else
		tokens_won = Math.ceil((score/4) * 3);	
	
	var xp_gained = 5;
	
	$("#tally-box .tally-row").slice(0, -1).each(function (index){
		
		// register three animations
		sequencer.newFunction(BLOCKING, function(next){
			
			// move the top of the box down as it expands, so that
			// it stays centered
			$("#tally-box")
				.transition({
					height: 100 * (index + 1),
					top: 360 - 50 * (index + 1)
				}, 500, "snap", function(){
				
					// add up the eggs earned and multiply them by the "wave"
					/*
					$(this)
						.children(".tally-score")
						.text((wool1 + wool2 + wool3).toString());
					*/
					// string to represent total eggs collected as sum of each
					// color

					
					
					$(this).children(".tally-wool-count")
						.text("Your Score: " + (wool1 + wool2 + wool3).toString() + " - " + not_required_wool + " = " + score);
					
					// animate in each cell of the row at a staggered time
					$(this).children().each(function (index){
						window.setTimeout(function(){$(this).transition({ opacity: 1 }, 300, "ease-in-out")}.bind(this), index * 300);
					});
					
					// go to the next animation when animating in the row is finished
					// 300 ms per row, 3 rows = 900 ms
					window.setTimeout(next, 900);
					
				}.bind(this));
			
	}.bind(this))});
	
	sequencer.newFunction(BLOCKING, function( next ){
		$("#tally-box").transition({ height: 200, top: 160 }, 500, "snap",
			function(){
			
				// tally up the total score as sum of values from cells
				$(".tally-score")
					.each(function(){
						$("#tally-total-score").text("Tokens won: " + tokens_won);
					});
				
				// fade the score in
				$("#tally-total-score")
					.transition({ opacity: 1 }, 500, "ease-in-out", next);
			});
	});
	
	sequencer.newFunction(BLOCKING, function( next ){
		$("#tally-box").transition({ height: 300, top: 160 }, 500, "snap",
			function(){
			
				// tally up the total score as sum of values from cells
				$(".tally-xp")
					.each(function(){
						$("#tally-total-xp").text("XP gained: " + xp_gained);
					});
				
				// fade the score in
				$("#tally-total-xp")
					.transition({ opacity: 1 }, 500, "ease-in-out", next);
			});
	});
	
	
};


	

function Field (sequencer, selector, animalClass, wanderingClass, animateFreq ){

	this.sequencer = sequencer;
	this.selector = selector === undefined ? ".field" : selector;
	this.animalClass = animalClass === undefined ? "animal" : animalClass;
	this.wanderingClass = wanderingClass === undefined ? "field-wandering" : wanderingClass;
	this.animateFreq = animateFreq === undefined ? 500 : animateFreq;
	

	//randomizing the number of wool needed
	for(var i = 0; i < 3; i++) {
		var random = Math.random();
		if(random <= 0.25) {
			wool_needed_array[i] = 1;
		}
		else if(random <= .50) {
			wool_needed_array[i] = 2;	
		}
		else if(random <= .75) {
			wool_needed_array[i] = 3;
		}
		else if(random <= 1) {
			wool_needed_array[i] = 4;
		}
	}
	//randomizing the color wool needed
		var random = Math.random();
		if(random <= 0.25) {
			wool_color_array[0] = "black";
			wool_color_array[1] = "blue";
			wool_color_array[2] = "green";
		}
		else if(random <= .50) {
			wool_color_array[0] = "red";
			wool_color_array[1] = "blue";
			wool_color_array[2] = "green";
		}
		else if(random <= .75) {
			wool_color_array[0] = "black";
			wool_color_array[1] = "blue";
			wool_color_array[2] = "red";
		}
		else if(random <= 1) {
			wool_color_array[0] = "black";
			wool_color_array[1] = "green";
			wool_color_array[2] = "red";
		}
		
	//setting css file with appropriate stats

	$("#wool-count-1").text(0);
	$("#wool-count-2").text(0);
	$("#wool-count-3").text(0);	
	
	
	$("#wool-color-1").text(wool_color_array[0]);
	$("#wool-color-2").text(wool_color_array[1]);
	$("#wool-color-3").text(wool_color_array[2]);

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
		
		window.setTimeout(this.updater, this.animateFreq);
		
	}.bind(this);
	
	//Click functions, and what happens when sheep gets clicked.
	
	this.element.on("click", "." + this.animalClass + ".red_sheep", function(){
		if($(this).hasClass('deactive'))
			return;
		this.classList.add("panic");
		if(jQuery.inArray("red", wool_color_array) < 0 || red_wool_full) {
			not_required_wool += 1;
		}

		else if(wool_color_array[0] == "red") {
			wool1 += 1;
			document.getElementById("wool-count-1").innerHTML = wool1;
			if(wool1 == wool_needed_array[0])
				red_wool_full = true;
		}
		else if(wool_color_array[2] == "red"){
			wool3 += 1;
			document.getElementById("wool-count-3").innerHTML = wool3;
			if(wool3 == wool_needed_array[2])
				red_wool_full = true;
		}
		this.classList.add('deactive');
		
		if(sheep_game_over())
			run_game_over();
		
		document.getElementById("not-required-wool").innerHTML = not_required_wool;
	});
	
	this.element.on("click", "." + this.animalClass + ".blue_sheep", function(){
		if($(this).hasClass('deactive'))
			return;
		this.classList.add("panic");
		if(jQuery.inArray("blue", wool_color_array) < 0 || blue_wool_full ) {
			not_required_wool += 1;
		}
		
		else if(wool_color_array[1] == "blue") {
			wool2 += 1;
			document.getElementById("wool-count-2").innerHTML = wool2;
			if(wool2 == wool_needed_array[1])
				blue_wool_full = true;
		}
		
		this.classList.add('deactive');
		
		if(sheep_game_over())
			run_game_over();
		
		document.getElementById("not-required-wool").innerHTML = not_required_wool;
	});
	
	this.element.on("click", "." + this.animalClass + ".green_sheep", function(){
		if($(this).hasClass('deactive'))
			return;
		this.classList.add("panic");
		if(jQuery.inArray("green", wool_color_array) < 0 || green_wool_full) {
			not_required_wool += 1;
		}
		
		else if(wool_color_array[1] == "green") {
			wool2 += 1;
			document.getElementById("wool-count-2").innerHTML = wool2;
			if(wool2 == wool_needed_array[1])
				green_wool_full = true;
		}
		else if(wool_color_array[2] == "green"){
			wool3 += 1;
			document.getElementById("wool-count-3").innerHTML = wool3;
			if(wool3 == wool_needed_array[2])
				green_wool_full = true;
		}
		
		this.classList.add('deactive');
		
		if(sheep_game_over())
			run_game_over();
		
		document.getElementById("not-required-wool").innerHTML = not_required_wool;
	});
	
	this.element.on("click", "." + this.animalClass + ".black_sheep", function(){
		if($(this).hasClass('deactive'))
			return;
		this.classList.add("panic");
		if(jQuery.inArray("black", wool_color_array) < 0 || black_wool_full) {
			console.log(jQuery.inArray("black", wool_color_array));
			console.log(wool_color_array);
			console.log(black_wool_full);
			not_required_wool += 1;
		}
		
		
		else if(wool_color_array[0] == "black") {
			console.log("hello");
			wool1 += 1;
			document.getElementById("wool-count-1").innerHTML = wool1;
			if(wool1 == wool_needed_array[0])
				black_wool_full = true;
		}
		
		this.classList.add('deactive');
		
		if(sheep_game_over())
			run_game_over();
		
		document.getElementById("not-required-wool").innerHTML = not_required_wool;
	});

	// ^^^^^ End of Click Functions ^^^^^
	
	
	window.setTimeout(this.updater, this.animateFreq);
	
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

function Sleeper ( sequencer ){
	this.sequencer = sequencer;
}	


Sleeper.prototype.ms = function ( time, blocking ){
	this.sequencer.newFunction( blocking, function(next){

	window.setTimeout(next, time);
		
}.bind(this))};


//display the beginning of the game
dialog.printDialog("Baaaaa! Help me collect wool from my children!", BLOCKING);

//move the dialog box to the bottom
dialog.promptNext(BLOCKING);
dialog.clearDialog(BLOCKING);

sequencer.newFunction(BLOCKING, function (next){
	dialog.element.transition({ bottom : 50 }, 500, "ease-in-out",
			function(){this.css("z-index", 3)});
	dialog.head.transition({ bottom : 0 }, 500, "ease-in-out",
			function(){this.css("z-index", 3)});
		
	$(document.getElementById("greyout"))
		.transition({ opacity: 0 }, 500, "ease-in-out", 
			function (){
				this.css("display", "none");
				next()
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
dialog.printDialog('Can you shear for me ' + wool_needed_array[0] + ' ' + wool_color_array[0] + ', ' + wool_needed_array[1] + ' ' + wool_color_array[1] + ' and ' + wool_needed_array[2] + ' ' + wool_color_array[2] + '?', BLOCKING);







};