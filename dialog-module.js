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
