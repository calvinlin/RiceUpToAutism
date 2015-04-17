window.onload = function (){

var BLOCKING = "blocking";
var NONBLOCK = "nonblock";

var sequential = {
	newFunction: function (blocking, fn){
		this._sequence.push(function(){
			this._active = true;			
			if (blocking !== undefined){
				if (blocking === BLOCKING){
					fn(function(){ this._next()(); }.bind(this));
				} else if (blocking === NONBLOCK){
					fn(function(){});
					this._next()();
				}
			}
			console.log(this);
		}.bind(this));
		
		if (!this._active){
			this._sequence.shift()();
		}
	},
	_sequence: [],
	_active: false,
	_next: function (){
		return this._sequence.length ? this._sequence.shift() : function(){ this._active = false }.bind(this);
	}
};

//=======================================================================================
// class Dialog:
//=======================================================================================
//
//	constructor Dialog( [speed, selector] )
// 	
//  Determines the Dialog's speed and gets the element using the selector.  
//
//	Number speed	[default 10]				: how quickly each character is printed, in ms.
//  jQuery element	[default ".dialog-box"]		: a jQuery selector for the element which will
//												  function as a dialog box
//
//  printDialog( String dialog )				: prints out dialog to the specified element
//  promptNext()								: idles until the player clicks on the dialog box
//
//=======================================================================================

function Dialog (speed, selector, headSelector){
	
	this.speed = speed === undefined ? 10 : speed;
	this.element = selector === undefined ? $(".dialog-box") : $(selector);
	this.head = headSelector === undefined ? $(".dialog-head") : $(headSelector);
	
};

Dialog.prototype.clearDialog = function (blocking) { 
	sequential.newFunction(blocking, function(next){
	
	this.element.empty();
	next();
	
}.bind(this))};

Dialog.prototype.printDialog = function (dialog, blocking) {
	sequential.newFunction(blocking, function(next){
	
	this.head.addClass("talking");
	
	var letters = dialog.split("");
	var toRemove = 0;
	
	var nextLetter = function (){
		if (letters.length){ 
			this.element.append(letters.shift());
			toRemove = window.setTimeout(nextLetter, this.speed);
		} else {
			this.element.off("click");
			this.head.removeClass("talking");
			console.log("hello", next);
			next();
		}	
	}.bind(this);
	
	this.element.one("click", function(){
		this.element.text(this.element.text() + letters.join(""));
		window.clearTimeout(toRemove);
		this.head.removeClass("talking");
		next();
	}.bind(this));
	
	toRemove = window.setTimeout(nextLetter, this.speed);
	
}.bind(this))};
	
Dialog.prototype.promptNext = function (blocking) {
	sequential.newFunction( blocking, function(next){
		
	this.element.append('<div class="dialog-box-arrow"></div><div class="dialog-continue">click to continue</div>');
	this.element.one("click", function(){
		next();
	}.bind(this));
	
}.bind(this))};

//=======================================================================================
// class Animal:
//=======================================================================================
//
//	constructor Animal( type, [elementClass], sound )
//
//	String type									: the type of animal represented.
//  String elementClass							: the selector used to identify Animal elements
//			[default [type]]		  			  defaults to [type]	
//	
//=======================================================================================

function Animal ( type, elementClass, sound ){
	
	if ( type === undefined ){
		throw "Animal.prototype: Argument 'type' is a required argument.";
	}
		
	this.type = type;
	this.elementClass = elementClass === undefined ? this.type : elementClass;
	
}

//=======================================================================================
// class Field:
//=======================================================================================
//
//	constructor Field( [selector, animalClass, wanderingClass, animateFreq] )
//
//	jQuery element [default $(".field")]			: the jQuery representing the field. Is 
//													  determined from $(selector)
//  String animalClass [default "animal"]			: the selector used to identify Animal elements.
//												  	  used to create the Animal elements.
//  String wanderingClass 							: the selector used to identify wandering
// 		[default "field-wandering"]					  animal elements. 
//  Number animateFreq								: represents the amount of time a 'tick' of
//		[default 10]								  animation should take, in ms
//
//  spawn( Animal animalType )						: creates an Element inside the field Element that
//													  represents an Animal
//
//=======================================================================================

function Field ( selector, animalClass, wanderingClass, animateFreq ){

	this.selector = selector === undefined ? ".field" : selector;
	this.animalClass = animalClass === undefined ? "animal" : animalClass;
	this.wanderingClass = wanderingClass === undefined ? "field-wandering" : wanderingClass;
	this.animateFreq = animateFreq === undefined ? 500 : animateFreq;
	
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

			var newXPos = xPos + Math.cos(heading) * 3;
			var newYPos = yPos + Math.sin(heading) * 3;
			
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
	
	interact('.'+this.animalClass).draggable({
		onstart: function(event){
			
			event.target.classList.remove(this.wanderingClass);
			event.target.classList.add("panic");
			
		}.bind(this),
		onmove: function (event){
			
			var newXPos = parseFloat(event.target.getAttribute("x-pos")) + event.dx;
			var newYPos = parseFloat(event.target.getAttribute("y-pos")) + event.dy;
			
			event.target.setAttribute("x-pos", newXPos);
			event.target.setAttribute("y-pos", newYPos);
			
			$(event.target).transition({
				x: newXPos,
				y: newYPos
			}, 0, "linear");
			
		},
		onend: function (event){
			
			var xPos = parseFloat(event.target.getAttribute("x-pos"));
			var yPos = parseFloat(event.target.getAttribute("y-pos"));
			
			var dim = event.target.getBoundingClientRect();
		
			if (xPos > this.element.width() - dim.width){
				xPos = this.element.width() - dim.width;
			} else if (xPos < 0){
				xPos = 0;
			}
			
			if (yPos > this.element.height() - dim.height){
				yPos = this.element.height() - dim.height;
			} else if (yPos < 0){
				yPos = 0;
			}
			
			event.target.setAttribute("x-pos", xPos);
			event.target.setAttribute("y-pos", yPos);
			
			$(event.target)
				.transition({
					x: xPos,
					y: yPos
				}, 300, "snap", function(){
					$(event.target)
						.removeClass("panic")
						.addClass(field.wanderingClass);
				}
			);
			
		}.bind(this)
	});	
	
	window.setTimeout(this.updater, this.animateFreq);
	
}

Field.prototype.spawn = function (animalType, blocking){
	sequential.newFunction(blocking, function(next){
		
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


//=======================================================================================
// class Dropzone:
//=======================================================================================
//
//	constructor Field( [selector] )
//
//	jQuery element [default $(".field")]			: the jQuery representing the field. Is 
//													  determined from $(selector)
//  String animalClass [default "animal"]			: the selector used to identify Animal elements.
//												  	  used to create the Animal elements.
//  String wanderingClass 							: the selector used to identify wandering
//		[default "field-wandering"]					  animal elements. 
//  Number animateFreq								: represents the amount of time a 'tick' of
//		[default 10]								  animation should take, in ms
//
//  accept( [[ Animal ] animalList] or null )		: makes dropzone only accept the Animals in
//													  animalList. If animalList is omitted, accepts
//													  all. If animalList is null, accepts nothing.
//
//=======================================================================================

function Dropzone ( selector, accepts ){

	this.selector = selector === undefined ? ".dropzone" : selector;
	this._accept(accepts);
	
	this._isWaiting = false;
	this._nDrops = 0;
	
	this.isAccepted = function (element){
		console.log(this.accepts === true)
		return ( (this.accepts === true) || 
				 (this.accepts instanceof Array && this.accepts.reduce(function(prev, curr, ind, arr){
				   return prev || element.classList.contains(curr);
			   }, false)));
	}.bind(this);
	
	interact(selector).dropzone({
		ondragenter: function(event){
			if (this.isAccepted(event.relatedTarget)){
				event.target.classList.add("drop-hover");
			} else {
				event.target.classList.add("wrong-hover");
			}
		}.bind(this),
		ondragleave: function(event){
			if (this.isAccepted(event.relatedTarget)){
				event.target.classList.remove("drop-hover");
			} else {
				event.target.classList.remove("wrong-hover");
			}
		}.bind(this),
		ondrop: function(event){
			if (this.isAccepted(event.relatedTarget)){
				$(event.relatedTarget)
					.transition({
						opacity: 0.0,
						y: '+=100'
					}, 500, "ease", $(event.relatedTarget).remove);
				event.target.classList.remove("drop-hover");
				
				if (--this._dropsNeeded == 0){
					this._isWaiting = false;
					this.nextInSequence();
				}
			} else {
				event.target.classList.remove("wrong-hover");
				//dialog.printDialog("That's the wrong animal!").nonBlocking()();
			}
		}.bind(this)
	});
	
}

Dropzone.prototype._accept = function (animalList){
	
	this.accepts = animalList instanceof Array ? animalList.map(function(curr){return curr.elementClass}) : animalList;
	
};

Dropzone.prototype.accept = function (animalList, blocking){
	sequential.newFunction(blocking, function(next){
	
	this._accept(animalList);	
	next();
	
}.bind(this))};

Dropzone.prototype.waitForNDrops = function (dropNumber, blocking){ 
	sequential.newFunction(blocking, function(next){
	
	this._dropsNeeded = dropNumber;
	this._isWaiting = true;
	this.nextInSequence = next;
	
}.bind(this))};



//=======================================================================================
//  Program main:
//=======================================================================================

//
// initialize variables
//

var dialog = new Dialog(15);
var field = new Field(undefined, undefined, undefined, 30);
var truck = new Dropzone(".truck", null);

var cow = new Animal("cow");
var pig = new Animal("pig");
var horse = new Animal("horse");
var sheep = new Animal("sheep");


//
// create sequence of actions
//
// Each element in the list contains a function call, each 
// returning a function. When a function completes its task
// or gets the expected input, the next function is called.
// 
// To ensure that the next function is called, each returned 
// function must trigger the global /game/ variable event
// "next", which notifies that the given function has stopped.
//

dialog.printDialog('Howdy! You must be my neighbor!', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog('Glad you could come take over my farm!', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog('Before I leave though, I need you to help me out with loading animals onto my truck.', BLOCKING);
dialog.promptNext(BLOCKING);

field.spawn(cow, NONBLOCK);
field.spawn(cow, NONBLOCK);
field.spawn(pig, NONBLOCK);
field.spawn(horse, NONBLOCK);
field.spawn(sheep, NONBLOCK);

dialog.clearDialog(BLOCKING);
dialog.printDialog('Try picking up a cow and putting it into the truck.', NONBLOCK);
truck.accept([cow], BLOCKING);
truck.waitForNDrops(1, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog('Good job!', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog('Try picking up a pig and putting it into the truck.', NONBLOCK);
truck.accept([pig], BLOCKING);
truck.waitForNDrops(1, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog('You\'re great at this!', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog('Now get a horse and put it in.', NONBLOCK);
truck.accept([horse], BLOCKING);
truck.waitForNDrops(1, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog('Almost done!.', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog('Now put the sheep and the cow in.', NONBLOCK);
truck.accept(true, BLOCKING);
truck.waitForNDrops(2, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog('[Insert message here]', NONBLOCK);

console.log(sequential);

};
