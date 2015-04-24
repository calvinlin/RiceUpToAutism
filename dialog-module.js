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

function Dialog (sequencer, speed, selector, headSelector){
	
	this.sequencer = sequencer;
	this.speed = speed === undefined ? 10 : speed;
	this.element = selector === undefined ? $(".dialog-box") : $(selector);
	this.head = headSelector === undefined ? $(".dialog-head") : $(headSelector);
	
};

Dialog.prototype._dialog = function(callback, dialog, image, align){
	
	if (image !== undefined){
		$('<div class="dialog-box-image"></div>')
			.css("background-image", "url(" + image + ")")
			.appendTo(this.element);
		this.element.addClass("with-image-" + align);
	}
	
	this.head.addClass("talking");
	
	var textBox = $('<div class="dialog-box-text"></div>').appendTo(this.element);
	var letters = dialog.split("");
	var toRemove = 0;
	
	var nextLetter = function (){
		if (letters.length){ 
			textBox.append(letters.shift());
			toRemove = window.setTimeout(nextLetter, this.speed);
		} else {
			this.element.off("click");
			this.head.removeClass("talking");
			callback();
		}	
	}.bind(this);
	
	this.element.one("click", function(){
		textBox.text(this.element.text() + letters.join(""));
		window.clearTimeout(toRemove);
		this.head.removeClass("talking");
		callback();
	}.bind(this));
	 
	toRemove = window.setTimeout(nextLetter, this.speed);
	
}

Dialog.prototype.clearDialog = function (blocking) { 
	this.sequencer.newFunction(blocking, function(next){
	
	this.element.empty();
	this.element.removeClass("with-image-left").removeClass("with-image-right");
	next();
	
}.bind(this))};

Dialog.prototype.printDialog = function (dialog, blocking) {
	this.sequencer.newFunction(blocking, function(next){
	
	this._dialog(next, dialog);
	
}.bind(this))};

Dialog.prototype.printDialogWithImage = function (dialog, image, align, blocking) {
	this.sequencer.newFunction(blocking, function(next){
	
	this._dialog(next, dialog, image, align);
	
}.bind(this))};


Dialog.prototype.promptNext = function (blocking) {
	this.sequencer.newFunction(blocking, function(next){
		
	this.element.append('<div class="dialog-box-arrow"></div><div class="dialog-continue">click to continue</div>');
	this.element.one("click", next);
	
}.bind(this))};
