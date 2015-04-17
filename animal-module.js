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
