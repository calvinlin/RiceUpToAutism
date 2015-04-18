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

function Dropzone (sequencer, selector, accepts){

	this.sequencer = sequencer;
	this.selector = selector === undefined ? ".dropzone" : selector;
	this._accept(accepts);
	
	this._isWaiting = false;
	this._nDrops = 0;
	
	this.isAccepted = function (element){
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
			}
		}.bind(this)
	});
	
}

Dropzone.prototype._accept = function (animalList){
	
	this.accepts = animalList instanceof Array ? animalList.map(function(curr){return curr.elementClass}) : animalList;
	
};

Dropzone.prototype.accept = function (animalList, blocking){
	this.sequencer.newFunction(blocking, function(next){
	
	this._accept(animalList);	
	next();
	
}.bind(this))};

Dropzone.prototype.waitForNDrops = function (dropNumber, blocking){ 
	this.sequencer.newFunction(blocking, function(next){
	
	this._dropsNeeded = dropNumber;
	this._isWaiting = true;
	this.nextInSequence = next;
	
}.bind(this))};
