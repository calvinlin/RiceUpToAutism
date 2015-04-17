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