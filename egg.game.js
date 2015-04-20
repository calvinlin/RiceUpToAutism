window.onload = function(){

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
	
	
	var time = Date.now();
	var updateEggPos = function(){
		var updateInterval = this.updateInterval;
		var dx = (120 + 1280) * ((Date.now() - time) / this.speed);
		time = Date.now();
		
		var eggs = $(this.selector + " > " + this.eggSelector);
		
		if (eggs.length > 0){
			var self = this;
			eggs.filter(".on-conveyor").each(function(){	
				var newPos = parseFloat($(this).css("transform").split(",")[4]) + dx;
				if (newPos < 1280){
					$(this).transition({ x: newPos }, updateInterval, "linear");
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
	
	this.speed = speed;
	this.element.css({ 
		"animation-duration": (this.speed / 7).toString() + "ms",
		"-webkit-animation-duration": (this.speed / 7).toString() + "ms",
		"-moz-animation-duration": (this.speed / 7).toString() + "ms",
		"-o-animation-duration": (this.speed / 7).toString() + "ms"
	});
	
	next();
	
}.bind(this))};

ConveyorBelt.prototype.spawnEgg = function( color, blocking ){
	this.sequencer.newFunction ( blocking, function( next ){
		
	$("<div class='egg on-conveyor " + color + "'></div>")
		.css("background", color)
		.appendTo(this.element);
	window.setTimeout(next, 120 / (120 + 1280) * this.speed);
	
}.bind(this))};

ConveyorBelt.prototype.waitOnClear = function( blocking ){
	this.sequencer.newFunction ( blocking, function ( next ) {
	
	this.fireOnEmpty = next;
	
}.bind(this))}

function Nest ( sequencer, element, accepts, eggElement ){
	
	this.selector = element === undefined ? ".nest#nest-" + (++Nest.NUM_OF_INSTANCES) : element; 
	this.accepts = accepts === undefined ? true : accepts;

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

var sequencer = new Sequential();
var sleep = new Sleeper(sequencer);

var conveyor = new ConveyorBelt( sequencer, 6000, 5 );
var dialog = new Dialog( sequencer, undefined, "#dialog-box", "#dialog-head");

var nest1 = new Nest(sequencer, undefined, "green");
var nest2 = new Nest(sequencer, undefined, false);
var nest3 = new Nest(sequencer, undefined, false);

var eggsCollectedAtSpeed = [];


dialog.printDialog("Mother Hen is laying eggs! Help sort the colored eggs by dropping them the correct colored nests.", BLOCKING);
dialog.promptNext(BLOCKING);
dialog.clearDialog(BLOCKING);

sequential.newFunction(BLOCKING, function (next){
	
	sequencer.element.animate({"bottom"})
	
});

dialog.printDialog("Put the eggs into the basket with the correct color.", BLOCKING);

conveyor.spawnEgg("green", BLOCKING);
sleep.ms(1000, BLOCKING);
conveyor.spawnEgg("purple", BLOCKING);

conveyor.waitOnClear(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog("Watch out! It's getting faster!", BLOCKING);
dialog.promptNext(BLOCKING);
dialog.clearDialog(BLOCKING);

conveyor.setSpeed(4000, BLOCKING);

conveyor.spawnEgg("green", BLOCKING);
sleep.ms(1000, BLOCKING);
conveyor.spawnEgg("pink", BLOCKING);
sleep.ms(1000, BLOCKING);
conveyor.spawnEgg("green", BLOCKING);

conveyor.waitOnClear(BLOCKING);
sleep.ms(1000, BLOCKING);
sequencer.newFunction(BLOCKING, function (next){
	document.getElementById("greyout").style.display = "block";
	document.getElementById("tally-box").style.display = "block";
	next();
});
}