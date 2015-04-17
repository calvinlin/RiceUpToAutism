/**
 * New node file
 */


var BLOCKING = "blocking";
var NONBLOCK = "nonblock";

var sequential = {
	sequence: [],
	newFunction: function (blocking, fn){
		this.sequence.push(function(){
			if (blocking !== undefined){
				if (blocking){
					fn(this.sequence.shift())
				} else {
					fn(function(){});
					this.sequence.shift()();
				}
			} else {
				fn(function(){});
			}
		});
	},
	execute: this.sequence.shift();
};

