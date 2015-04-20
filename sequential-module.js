var BLOCKING = "blocking";
var NONBLOCK = "nonblock";

function Sequential (){
	
	this._sequence = [];
	this._active = false;
	this._next
	
};

Sequential.prototype._next = function (){
	return this._sequence.length ? this._sequence.shift() : function(){ this._active = false }.bind(this);
};

var count = 0;
Sequential.prototype.newFunction =  function (blocking, fn){
	if (blocking !== undefined){
		this._sequence.push(function(){
			this._active = true;
			if (blocking === BLOCKING){
				fn(function(){ this._next()(); }.bind(this));
			} else if (blocking === NONBLOCK){
				fn(function(){});
				this._next()();
			}
		}.bind(this));
		if (!this._active){
			this._sequence.shift()();
		}
	} else {
		fn(function(){});
	}
	
};
