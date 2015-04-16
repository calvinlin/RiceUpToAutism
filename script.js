window.onload = function (){

	
var game = $(document.getElementById("game"));
var sequence = function ( sequenceList ){
	var nCalls = 0;
	game
		.on("next", function (){
			if (sequenceList.length){
				console.log(++nCalls);
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
//	Number speed	[default 10]				: how quickly each character is printed, in ms.
//  String element	[default ".dialog-box"]		: a jQuery selector for the element which will
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
// class Dialog:
//
//	constructor Dialog( [options] )
//
//	Number speed	[default 10]				: how quickly each character is printed, in ms.
//  String element	[default ".dialog-box"]		: a jQuery selector for the element which will
//												  function as a dialog box
//
//  printDialog( String dialog )				: prints out dialog to the specified element
//  promptNext()								: idles until the player clicks on the dialog box
//


function Animal ( type, elementClass ){
	
	if ( type === undefined ){
		throw "Animal.constructor: Argument 'type' is a required argument.";
	}
		
	this.type = type;
	this.elementClass = elementClass === undefined ? this.type + "-animal-type" : elementClass;
	
}

function Field ( selector, animalClass ){

	this.element = selector === undefined ? $(".field") : $(selector);
	this.animalClass = animalClass === undefined ? "animal" : animalClass;
	
}

Field.prototype.spawn = function ( animalType ){ return sequential( this, false, function (){
	
	this.element.append('<div class="' + animalType.type + ' ' + this.animalClass + '"></div>');
	
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


sequence([
          dialog.printDialog('Farmer: "Howdy! You must be my neighbor [username]!"'),
          dialog.promptNext(),
          dialog.clearDialog(),
          dialog.printDialog('Farmer: "Glad you could come take over my farm!"'),
          dialog.promptNext(),
          dialog.clearDialog(),
          dialog.printDialog('Farmer: "Before I leave though, I need you to help me out with loading animals onto my truck."')	          
]);

};
