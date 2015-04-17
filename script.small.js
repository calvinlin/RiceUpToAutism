//=======================================================================================
//  Program main:
//=======================================================================================

window.onload = function (){

//
// initialize variables
//

var dialog = new Dialog(15);
var field = new Field(undefined, undefined, undefined, 30);
var truck = new Dropzone(".truck", null);

var cow = new Animal("cow");
var pig = new Animal("pig");
var horse = new Animal("horse");
var sheep = new Animal("sheep");


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
dialog.printDialog('Try picking up a cow and putting it into the truck.', NONBLOCK);
truck.accept([cow], BLOCKING);
truck.waitForNDrops(1, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog('Good job!', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog('Try picking up a pig and putting it into the truck.', NONBLOCK);
truck.accept([pig], BLOCKING);
truck.waitForNDrops(1, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog('You\'re great at this!', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog('Now get a horse and put it in.', NONBLOCK);
truck.accept([horse], BLOCKING);
truck.waitForNDrops(1, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog('Almost done!.', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog('Now put the sheep and the cow in.', NONBLOCK);
truck.accept(true, BLOCKING);
truck.waitForNDrops(2, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog('[Insert message here]', NONBLOCK);

};
