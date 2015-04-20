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
	
	this.speed = speed === undefined ? 8000 : speed;
	this.updateInterval = updateInterval === undefined ? 500 : updateInterval;
	this.selector = element === undefined ? "#conveyor-belt" : element;
	this.eggSelector = eggElement === undefined ? ".egg" : eggElement;
	
	this.element = $(this.selector);
	this.eggElement = $(this.eggSelector); 

	this.fireOnEmpty = function(){};
	
	this.element.css({ 
		"animation-duration": (this.speed / 7).toString() + "ms",
		"-webkit-animation-duration": (this.speed / 7).toString() + "ms",
		"-moz-animation-duration": (this.speed / 7).toString() + "ms",
		"-o-animation-duration": (this.speed / 7).toString() + "ms"
	});
	
	interact(this.selector).dropzone({
		accept: this.eggSelector,
		overlap: 0.2,
		ondrop: function (event){
			var yDisp = parseFloat($(event.relatedTarget).css("transform").split(",")[5]);
			if (yDisp <= 0 && yDisp >= -90){
				$(event.relatedTarget).addClass("on-conveyor");
			}
		}
	});
	
	interact(this.eggSelector)
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
			$(event.target).not(".on-conveyor")
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
		}
	});
	
	
	var time = Date.now();
	var updateEggPos = function(){
		var updateInterval = this.updateInterval;
		var dx = (120 + 1280) * ((Date.now() - time) / this.speed);
		time = Date.now();
		
		var eggs = $(this.selector + " > " + this.eggSelector);
		
		if (eggs.length > 0){
			eggs.filter(".on-conveyor").each(function(){	
				var newPos = parseFloat($(this).css("transform").split(",")[4]) + dx;
				if (newPos < 1280){
					$(this).transition({ x: newPos }, updateInterval, "linear");
				} else {
					$(this).remove();
				}
			});
		} else {
			this.fireOnEmpty();
		}
		window.setTimeout(updateEggPos, updateInterval);
	}.bind(this);
	
	updateEggPos();
}

ConveyorBelt.prototype.spawnEgg = function( color, blocking ){
	this.sequencer.newFunction ( blocking, function( next ){
		
	$("<div class='egg on-conveyor " + color + "'></div>").appendTo(this.element);
	window.setTimeout(next, 120 / (120 + 1280) * this.speed);
	
}.bind(this))};

ConveyorBelt.prototype.waitOnClear = function( blocking ){
	this.sequencer.newFunction ( blocking, function ( next ) {
	
	this.fireOnEmpty = next;
	
}.bind(this))}

function Nest ( sequencer, element, accepts, eggElement ){
	
	this.selector = element === undefined ? ".nest" : element; 
	this.accepts = accepts === undefined ? false : accepts;

	interact.dropzone({
		
		
	});
}

var sequencer = new Sequential();

var sleep = new Sleeper(sequencer);
var conveyor = new ConveyorBelt( sequencer, 8000, 50 );

conveyor.spawnEgg("green", BLOCKING);
sleep.ms(1000, BLOCKING);
conveyor.spawnEgg("green", BLOCKING);
conveyor.waitOnClear(BLOCKING)
conveyor.spawnEgg("green", BLOCKING);
sleep.ms(1000, BLOCKING);
conveyor.spawnEgg("green", BLOCKING);
sleep.ms(1000, BLOCKING);

conveyor.spawnEgg("green", BLOCKING);

}