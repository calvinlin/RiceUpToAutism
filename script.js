window.onload = function (){
var game = $(document.getElementById("game"));
var sequence = function ( sequenceList ){
	var nCalls = 0;
	game
		.on("next", function (){
			if (sequenceList.length){
				sequenceList.shift()();
			}
		})
		.trigger("next");
	
};

var sequential = function( context, blocking, fn ){
	
	return $.extend(
			function (){
				if ( !blocking ) { game.trigger("next"); }
				fn.call(context, function (){
					if ( blocking ){
						game.trigger("next");
					}
				})
			},
		{ blocking: function(){ return fn.bind(context, function(){game.trigger("next"); } )} } ,
		{ nonBlocking: function(){
				return function(){
					game.trigger("next");
					fn.call(context, function(){});
				}
		}}
	);
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

function Dialog ( speed, selector ){
	
	this.speed = speed === undefined ? 10 : speed;
	this.element = selector === undefined ? $(".dialog-box") : $(options.selector);

};

Dialog.prototype.clearDialog = function () { return sequential ( this, true, function(nextInSequence){
	
	this.element.empty();
	nextInSequence();
	
}); };

Dialog.prototype.printDialog = function ( dialog ) { return sequential( this, true, function(nextInSequence){
	
	$(".dialog-head").addClass("talking");
	
	var letters = dialog.split("");
	var toRemove = 0;
	
	var nextLetter = function (){
		if (letters.length){ 
			this.element.append(letters.shift());
			toRemove = window.setTimeout(nextLetter, this.speed);
		} else {
			this.element.off("click");
			$(".dialog-head").removeClass("talking");
			nextInSequence();
		}	
	}.bind(this);
	
	this.element.one("click", function(){
		this.element.text(this.element.text() + letters.join(""));
		window.clearTimeout(toRemove);
		$(".dialog-head").removeClass("talking");
		nextInSequence();
	}.bind(this));
	
	toRemove = window.setTimeout(nextLetter, this.speed);
	
}); };
	
Dialog.prototype.promptNext = function () { return sequential(this, true, function(nextInSequence){
		
	this.element.append('<div class="dialog-box-arrow"></div><div class="dialog-continue">click to continue</div>');
	this.element.one("click", function(){
		nextInSequence();
	}.bind(this));
	
}); };

//=======================================================================================
// class Animal:
//=======================================================================================
//
//	constructor Animal( type, [elementClass] )
//
//	String type									: the type of animal represented.
//  String elementClass							: the selector used to identify Animal elements
//			[default [type]]		  			  defaults to [type]	
//
//=======================================================================================

function Animal ( type, elementClass ){
	
	if ( type === undefined ){
		throw "Animal.constructor: Argument 'type' is a required argument.";
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

Field.prototype.spawn = function ( animalType ){ return sequential( this, false, function (nextInSequence){
	
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
	
	nextInSequence();
	
}); };

Field.prototype.waitForPickup = function ( animalType ){ return sequential( this, false, function (nextInSequence){
	
}); };
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

Dropzone.prototype.accept = function (animalList){ return sequential(this, false, function(nextInSequence){
	
	this._accept(animalList);	
	nextInSequence();
	
}); };

Dropzone.prototype.waitForNDrops = function (dropNumber){ return sequential(this, true, function(nextInSequence){
	
	this._dropsNeeded = dropNumber;
	this._isWaiting = true;
	this.nextInSequence = nextInSequence;
	
}); };



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
var name = window.prompt("What is your name?", "Enter name here:");

sequence([
          dialog.printDialog('Howdy! You must be my neighbor ' + name + '!'),
          dialog.promptNext(),
          dialog.clearDialog(),
          dialog.printDialog('Glad you could come take over my farm!'),
          dialog.promptNext(),
          dialog.clearDialog(),
          dialog.printDialog('Before I leave though, I need you to help me out with loading animals onto my truck.'),
          dialog.promptNext(),
          field.spawn(cow),
          field.spawn(cow),
          field.spawn(pig),
          field.spawn(horse),
          field.spawn(sheep),
          dialog.clearDialog(),
          dialog.printDialog('Try picking up a cow and putting it into the truck.').nonBlocking(),
          truck.accept([cow]).blocking(),
          truck.waitForNDrops(1).blocking(),
          truck.accept(false).blocking(),
          dialog.clearDialog(),
          dialog.printDialog('Good job!'),
          dialog.promptNext(),
          dialog.clearDialog(),
          dialog.printDialog('Try picking up a pig and putting it into the truck.').nonBlocking(),
          truck.accept([pig]).blocking(),
          truck.waitForNDrops(1).blocking(),
          truck.accept(false).blocking(),
          dialog.clearDialog(),
          dialog.printDialog('You\'re great at this!'),
          dialog.promptNext(),
          dialog.clearDialog(),
          dialog.printDialog('Now get a horse and put it in.').nonBlocking(),
          truck.accept([horse]).blocking(),
          truck.waitForNDrops(1).blocking(),
          truck.accept(false).blocking(),
          dialog.clearDialog(),
          dialog.printDialog('Almost done!.'),
          dialog.promptNext(),
          dialog.clearDialog(),
          dialog.printDialog('Now put the sheep and the cow in.').nonBlocking(),
          truck.accept(true).blocking(),
          truck.waitForNDrops(2).blocking(),
          truck.accept(false).blocking(),
          dialog.clearDialog(),
          dialog.printDialog('[Insert message here]').nonBlocking()
]);

};
