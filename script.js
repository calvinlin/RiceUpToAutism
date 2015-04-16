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

	newFn = function (){
		if ( !blocking ){
			game.trigger("next");
		}
		fn.call( $.extend({}, context, { _sequenceNext: function (){
			if ( blocking ){
				game.trigger("next");
			}
		}} )
		);
	};
	
	newFn.blocking = function (){
		blocking = true;
		return newFn;
	};
	
	newFn.nonBlocking = function(){
		blocking = false;
		return newFn;
	};
	
	return newFn;
};


//
// class Dialog:
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

function Dialog ( speed, selector ){
	
	this.speed = speed === undefined ? 10 : speed;
	this.element = selector === undefined ? $(".dialog-box") : $(options.selector);

};

Dialog.prototype.clearDialog = function () { return sequential ( this, true, function(){
	
	this.element.empty();
	this._sequenceNext();
	
}); };

Dialog.prototype.printDialog = function ( dialog ) { return sequential( this, true, function(){
	
	var letters = dialog.split("");
	var toRemove = 0;
	
	var nextLetter = function (){
		if (letters.length){ 
			this.element.append(letters.shift());
			toRemove = window.setTimeout(nextLetter, this.speed);
		} else {
			this.element.off("click");
			this._sequenceNext();
		}	
	}.bind(this);
	
	this.element.one("click", function(){
		this.element.text(this.element.text() + letters.join());
		window.clearTimeout(toRemove);
		this._sequenceNext();
	}.bind(this));
	
	toRemove = window.setTimeout(nextLetter, this.speed);
	
}); };
	
Dialog.prototype.promptNext = function () { return sequential(this, true, function(){
		
	this.element.append('<div class="dialog-box-arrow"></div>');
	this.element.one("click", function(){
		this._sequenceNext();
	}.bind(this));
	
}); };

//
// class Animal:
//
//	constructor Animal( type, [elementClass] )
//
//	String type									: the type of animal represented.
//  String elementClass							: the selector used to identify Animal elements
//			[default [type]-animal-type]		  defaults to [type]-animal-type	
//												  

function Animal ( type, elementClass ){
	
	if ( type === undefined ){
		throw "Animal.constructor: Argument 'type' is a required argument.";
	}
		
	this.type = type;
	this.elementClass = elementClass === undefined ? this.type + "-animal-type" : elementClass;
	
}

//
// class Field:
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

function Field ( selector, animalClass, wanderingClass, animateFreq ){

	this.element = selector === undefined ? $(".field") : $(selector);
	this.animalClass = animalClass === undefined ? "animal" : animalClass;
	this.wanderingClass = wanderingClass === undefined ? "field-wandering" : wanderingClass;
	this.animateFreq = animateFreq === undefined ? 10 : animateFreq;
	
	this.updater = function (){
		
		var self = this;
		
		$('.'+this.wanderingClass+'.'+this.animalClass).each(function(){
			
			var nUpdate = parseInt(this.getAttribute("duration"));
			
			var xPos = parseFloat(this.getAttribute("x-pos"));
			var yPos = parseFloat(this.getAttribute("y-pos"));
			
			var heading = parseFloat(this.getAttribute("heading"));
			
			if (nUpdate === 0){
				heading = Math.PI * 2 * Math.random();
				nUpdate = 300 + Math.round(Math.random() * 200);
			}

			var newXPos = xPos + Math.cos(heading);
			var newYPos = yPos + Math.sin(heading);
			
			var dims = this.getBoundingClientRect();
			
			console.log(newXPos, newYPos);
			
			
			if (newXPos > self.element.width() - dims.width || newXPos < 0){
				heading = Math.atan2(Math.sin(heading), -Math.cos(heading));
				newXPos = xPos + Math.cos(heading);
			}
					
			if (newYPos > self.element.height() - dims.height || newYPos < 0){
				heading = Math.atan2(-Math.sin(heading), Math.cos(heading));
				newYPos = yPos + Math.sin(heading);
			}
			
			console.log(newXPos, newYPos);
			this.setAttribute("duration", --nUpdate);
			this.setAttribute("x-pos", newXPos);
			this.setAttribute("y-pos", newYPos);
			this.setAttribute("heading", heading);
			$(this).transition({x: newXPos, y: newYPos}, 0, "linear");
			
			
		});
		
		window.setTimeout(this.updater, this.animateFreq);
		
	}.bind(this);
	
	window.setTimeout(this.updater, this.animateFreq);

}

Field.prototype.spawn = function ( animalType ){ return sequential( this, false, function (){
	
	var newElement = document.createElement("div");
	newElement.classList.add(this.animalClass);
	newElement.classList.add(this.wanderingClass);
	newElement.classList.add(animalType.type);
	
	this.element.append(newElement);
	
	var dims = newElement.getBoundingClientRect();
	
	newElement.setAttribute("heading", Math.PI * 2 * Math.random());
	newElement.setAttribute("x-pos", Math.random() * (this.element.width() - dims.width));
	newElement.setAttribute("y-pos", Math.random() * (this.element.height() - dims.height));
	newElement.setAttribute("duration", 300 + Math.round(Math.random() * 200));
	
	$(newElement).transition({
		x: parseInt(newElement.getAttribute("x-pos")),
		y: parseInt(newElement.getAttribute("y-pos"))
	}, 0, "linear");
	
}); };

//==========================================================
//  Program main:
//==========================================================

//
// initialize variables
//

var dialog = new Dialog();

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

var dummyAnimal = new Animal("corgi");
var field = new Field(undefined, undefined, undefined, 30);

sequence([field.spawn(dummyAnimal),
          field.spawn(dummyAnimal),
          field.spawn(dummyAnimal),
          field.spawn(dummyAnimal),
          dialog.printDialog('Farmer: "Howdy! You must be my neighbor [username]!"'),
          dialog.promptNext(),
          dialog.clearDialog(),
          dialog.printDialog('Farmer: "Glad you could come take over my farm!"'),
          dialog.promptNext(),
          dialog.clearDialog(),
          dialog.printDialog('Farmer: "Before I leave though, I need you to help me out with loading animals onto my truck."')
]);

};
