//=======================================================================================
//  Program main:
//=======================================================================================

window.onload = function (){

//
// initialize variables
//

var sequencer = new Sequential();
	
var dialog = new Dialog(sequencer, 15);
var field = new Field(sequencer, undefined, undefined, undefined, 30);
var truck = new Dropzone(sequencer, ".truck", null);

var cow = new Animal("cow", undefined, undefined, "images/cow.png");
var pig = new Animal("pig", undefined, undefined, "images/pig.png");
var horse = new Animal("horse", undefined, undefined, "images/horse.png");
var sheep = new Animal("sheep", undefined, undefined, "images/sheep.png");


//
// create sequence of actions
//
// Each element in the list contains a function call, each 
// returning a function. When a function completes its task
// or gets the expected input, the next function is called.
// 

dialog.printDialog('Howdy! You must be my neighbor!', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog('Glad you could come take over my farm!', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog('Before I leave though, I need you to help me out with loading animals onto my truck.', BLOCKING);
dialog.promptNext(BLOCKING);

field.spawn(cow, NONBLOCK);
field.spawn(cow, NONBLOCK);
field.spawn(pig, NONBLOCK);
field.spawn(horse, NONBLOCK);
field.spawn(sheep, NONBLOCK);

dialog.clearDialog(BLOCKING);
dialog.printDialogWithImage('Try picking up a cow and putting it into the truck.', cow.image, "left", NONBLOCK);
truck.accept([cow], BLOCKING);
truck.waitForNDrops(1, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog('Good job!', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialogWithImage('Try picking up a pig and putting it into the truck.', pig.image, "left", NONBLOCK);
truck.accept([pig], BLOCKING);
truck.waitForNDrops(1, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog('You\'re great at this!', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialogWithImage('Now get a horse and put it in.', horse.image, "left", NONBLOCK);
truck.accept([horse], BLOCKING);
truck.waitForNDrops(1, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog('Almost done!.', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialogWithImage('Now put the sheep and the cow in.', sheep.image, "left", NONBLOCK);
truck.accept(true, BLOCKING);
truck.waitForNDrops(2, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog('[Insert message here]', NONBLOCK);

};
