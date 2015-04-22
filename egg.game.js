layerFunction.eggsort = function(){

function Sleeper ( sequencer ){
	this.sequencer = sequencer;
}	


Sleeper.prototype.ms = function ( time, blocking ){
	this.sequencer.newFunction( blocking, function(next){

	window.setTimeout(next, time);
		
}.bind(this))};


function ConveyorBelt( sequencer, speed, updateInterval, element, eggElement ){

	this.sequencer = sequencer;
	
	this.updateInterval = updateInterval === undefined ? 500 : updateInterval;
	this.selector = element === undefined ? "#conveyor-belt" : element;
	this.eggSelector = eggElement === undefined ? ".egg" : eggElement;
	
	this.element = $(this.selector);
	this.eggElement = $(this.eggSelector); 
	
	this.setSpeed(speed === undefined ? 8000 : speed);
	
	this.dropped = 0;

	this.fireOnEmpty = function(){};
	
	interact(this.selector).dropzone({
		accept: this.eggSelector,
		overlap: 0.2,
		ondrop: function (event){
			var yDisp = parseFloat($(event.relatedTarget).css("transform").split(",")[5]);
			if (yDisp <= 50 && yDisp >= -90){
				$(event.relatedTarget).addClass("on-conveyor");
			}
		}
	});
	
	interact(this.selector + " > " + this.eggSelector)
	.on("mousedown", function(event){
		$(event.target).removeClass("on-conveyor");
	})
	.draggable({
		onstart: function(event){
			$(event.target).removeClass("on-conveyor");
		},
		onmove: function(event){
			var coords = $(event.target).css("transform").split(",").slice(4)
							.map(function(val){return parseFloat(val)});
			$(event.target).transition({
				x: coords[0] + event.dx,
				y: coords[1] + event.dy
			}, 0, "linear");
		},
		onend: function(event){
			$(event.target).not(".on-conveyor, .on-nest")
				.transition({
					y: "-=100"
				}, 100, "ease-in-out", function (){
					$(this)
						.transition({
							y: "+=500",
							opacity: 0
						}, 600, "ease-in-out", function(){
							$(this).remove();
						});
				});
			++this.dropped;
		}.bind(this)
	});
	
	
	this.time = Date.now();
	var updateEggPos = function(){
		var updateInterval = this.updateInterval;
		var baseDx = this.baseDx;
		var compDx = (Date.now() - this.time) - this.updateInterval;
		this.time = Date.now();
		
		var eggs = $(this.selector + " > " + this.eggSelector);
		
		if (eggs.length > 0){
			var self = this;
			eggs.filter(".on-conveyor").each(function(){
				var compPos = parseFloat($(this).css("transform").split(",")[4]) + compDx;
				if (compPos < 1280){
					$(this).transition({ x: compPos }, 0, "linear", function(){
						$(this).transition({ x:  "+=" + baseDx }, updateInterval, "linear");
					});
				} else {
					++self.dropped;
					$(this).remove();
				}
			});
		} else {
			this.fireOnEmpty();
			this.fireOnEmpty = function(){};
		}
		window.setTimeout(updateEggPos, updateInterval);
	}.bind(this);
	
	updateEggPos();
}

ConveyorBelt.prototype.setSpeed = function (speed, blocking){
	this.sequencer.newFunction( blocking, function(next){
	
	this.speed = (1280 + 150) / speed;
	this.baseDx = this.updateInterval * this.speed;
	
	this.element.css({ 
		"animation-duration": (speed / 7).toString() + "ms",
		"-webkit-animation-duration": (speed / 7).toString() + "ms",
		"-moz-animation-duration": (speed / 7).toString() + "ms",
		"-o-animation-duration": (speed / 7).toString() + "ms"
	});
	
	next();
	
}.bind(this))};

ConveyorBelt.prototype.spawnEgg = function( color, blocking ){
	this.sequencer.newFunction ( blocking, function( next ){
	
	$("<div class='egg on-conveyor " + color + "'></div>")
		.css("background", "url('Resources/images/colored eggs/egg_" + color + ".png') center/contain no-repeat")
		.appendTo(this.element)
		.transition({x: -150 + (this.updateInterval - (Date.now() - this.time)) * this.speed}, 
				this.updateInterval - (Date.now() - this.time), "linear");
	window.setTimeout(next, 150 / this.speed);
	
}.bind(this))};

ConveyorBelt.prototype.waitOnClear = function( blocking ){
	this.sequencer.newFunction ( blocking, function ( next ) {
	
	this.fireOnEmpty = next;
	
}.bind(this))}

function Nest ( sequencer, element, accepts, eggElement ){
	
	this.selector = element === undefined ? ".nest#nest-" + (++Nest.NUM_OF_INSTANCES) : element; 
	this.accepts = accepts === undefined ? true : accepts;

	$(this.selector).css("background", "url('Resources/images/colored nests/nest_" + this.accepts + ".png') center/cover");
	
	this.nDropped = 0;
	
	this._isAccepted = function(element){
		return this.accepts === true || 
			   (typeof this.accepts === "string" &&
			    element.classList.contains(this.accepts)) ||
			   (this.accepts instanceof Array && 
				this.accepts.reduce(function(prev, curr){ 
					return element.classList.contains(curr) || prev
				}, false)
		);
	}.bind(this);
	
	interact(this.selector).dropzone({
		overlap: 0.1,
		ondrop: function (event){
			if (this._isAccepted(event.relatedTarget)){
				++this.nDropped;
				$(event.relatedTarget)
					.addClass("on-nest")
					.remove()
					.appendTo(this.selector)
					.transition({
						x: 0,
						y: 0
					}, 0, "linear");	
			}
		}.bind(this)
	});
}

Nest.NUM_OF_INSTANCES = 0;

function shuffle( array ){
	var result = [];
	var deepArray = JSON.parse(JSON.stringify(array));
	while (deepArray.length){
		result.push(deepArray.splice(Math.floor(Math.random() * deepArray.length), 1)[0]);
	}
	return result;
}


var sequencer = new Sequential();
var sleep = new Sleeper(sequencer);

var conveyor = new ConveyorBelt( sequencer, 4000, 500);
var dialog = new Dialog( sequencer, undefined, "#dialog-box", "#dialog-head");

// generate egg colors to use in the nests
var COLORS = ["red", "orange", "yellow", "green", "blue", "purple"];
var chosenColors = [COLORS.splice(Math.floor(Math.random() * 6), 1)[0],
                    COLORS.splice(Math.floor(Math.random() * 5), 1)[0],
					COLORS.splice(Math.floor(Math.random() * 4), 1)[0]];

// use the chosen colors to generate the nests
var nest1 = new Nest(sequencer, undefined, chosenColors[0]);
var nest2 = new Nest(sequencer, undefined, chosenColors[1]);
var nest3 = new Nest(sequencer, undefined, chosenColors[2]);

// keep track of eggs collected at each speed
var eggsCollectedAtSpeed = [];

// display the beginning of the game
dialog.printDialog("Mother Hen is laying eggs! Help sort the colored eggs by dropping them the correct colored nests.", BLOCKING);

// move the dialog box to the bottom
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

sleep.ms(500, BLOCKING);

dialog.printDialog("Put the eggs into the basket with the correct color.", BLOCKING);
dialog.promptNext(BLOCKING);
sequencer.newFunction(BLOCKING, function(next){
	$("#dialog-box").children().not(".dialog-box-text").remove();
	next();
});

// First "wave"
var currentQueue = [];

for (var i = 0; i < 6; ++i){
	currentQueue.push(shuffle(chosenColors)[0]);
}
for (var i = 0; i < 4; ++i){
	currentQueue.push(shuffle(COLORS)[0]);
}

currentQueue = shuffle(currentQueue);

for (var i = 0; i < 10; ++i){
	conveyor.spawnEgg(currentQueue[i], BLOCKING);
	sleep.ms(1000, BLOCKING);
}
conveyor.waitOnClear(BLOCKING);

sequencer.newFunction(BLOCKING, function(next){
	eggsCollectedAtSpeed[0] = [nest1.nDropped, nest2.nDropped, nest3.nDropped];
	nest1.nDropped = nest2.nDropped = nest3.nDropped = 0;
	next();
});

dialog.clearDialog(BLOCKING);
conveyor.setSpeed(3000, BLOCKING);
dialog.printDialog("Watch out! It's getting faster!", BLOCKING);
dialog.promptNext(BLOCKING);
dialog.clearDialog(BLOCKING);

// second "wave"
currentQueue = [];

for (var i = 0; i < 9; ++i){
	currentQueue.push(shuffle(chosenColors)[0]);
}
for (var i = 0; i < 4; ++i){
	currentQueue.push(shuffle(COLORS)[0]);
}

currentQueue = shuffle(currentQueue);

for (var i = 0; i < 13; ++i){
	conveyor.spawnEgg(currentQueue[i], BLOCKING);
	sleep.ms(1000, BLOCKING);
}
conveyor.waitOnClear(BLOCKING);

sequencer.newFunction(BLOCKING, function(next){
	eggsCollectedAtSpeed[1] = [nest1.nDropped, nest2.nDropped, nest3.nDropped];
	nest1.nDropped = nest2.nDropped = nest3.nDropped = 0;
	next();
});

dialog.clearDialog(BLOCKING);
conveyor.setSpeed(2000, BLOCKING);
dialog.printDialog("Watch out! It's getting much faster!", BLOCKING);
dialog.promptNext(BLOCKING);
dialog.clearDialog(BLOCKING);

// third "wave"
currentQueue = [];

for (var i = 0; i < 14; ++i){
	currentQueue.push(shuffle(chosenColors)[0]);
}
for (var i = 0; i < 6; ++i){
	currentQueue.push(shuffle(COLORS)[0]);
}

currentQueue = shuffle(currentQueue);

for (var i = 0; i < 20; ++i){
	conveyor.spawnEgg(currentQueue[i], BLOCKING);
	sleep.ms(1000, BLOCKING);
}
conveyor.waitOnClear(BLOCKING);

sequencer.newFunction(BLOCKING, function(next){
	eggsCollectedAtSpeed[2] = [nest1.nDropped, nest2.nDropped, nest3.nDropped];
	nest1.nDropped = nest2.nDropped = nest3.nDropped = 0;
	next();
});

// display the scoreboard
sequencer.newFunction(BLOCKING, function (next){
	$(document.getElementById("greyout"))
		.css("display", "block")
		.transition({opacity: 0.5}, 500, "ease-in-out");
	$(document.getElementById("tally-box"))
		.css("display", "block")
		.transition({opacity: 1}, 500, "ease-in-out", next);
});

// animate in each row, displaying the points earned at each speed
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
				$(this)
					.children(".tally-score")
					.text((eggsCollectedAtSpeed[index].reduce(function (prev, curr){
						return prev + curr;
					}, 0)* (index + 1)).toString());
				
				// string to represent total eggs collected as sum of each
				// color
				$(this).children(".tally-egg-count")
					.text(eggsCollectedAtSpeed[index].join(" + "));
				
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
	$("#tally-box").transition({ height: 400, top: 160 }, 500, "snap",
		function(){
		
			// tally up the total score as sum of values from cells
			$(".tally-score")
				.each(function(){
					$("#tally-total-score").text((parseInt($("#tally-total-score").text()) || 0) + parseInt($(this).text()));
				});
			
			// fade the score in
			$("#tally-total-score")
				.transition({ opacity: 1 }, 500, "ease-in-out", next);
		});
});

sequencer.newFunction(BLOCKING, function( next ){
	currentLayer.addEventListener("click", switchToLayer.bind(null, "main"))	
});

}