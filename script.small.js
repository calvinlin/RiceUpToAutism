//=======================================================================================
//  Program main:
//=======================================================================================

window.onload = function (){

//
//	initialize the data
//

var data = fetchPlayerData();
	
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
var chicken = new Animal("chicken", undefined, undefined, "images/chicken.jpg"); //added chicken - Emory
var goat = new Animal("goat", undefined, undefined, "images/goat.jpg"); //added goat - Emory


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
field.spawn(goat, NONBLOCK);
field.spawn(pig, NONBLOCK);
field.spawn(horse, NONBLOCK);
field.spawn(sheep, NONBLOCK);
field.spawn(chicken, NONBLOCK);

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
dialog.printDialog('Nice Job!', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialogWithImage('Now put the sheep in!', sheep.image, "left", NONBLOCK);
truck.accept([sheep], BLOCKING);
truck.waitForNDrops(1, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog('Great work!', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialogWithImage('Now toss chicken in!', chicken.image, "left", NONBLOCK);
truck.accept([chicken], BLOCKING);
truck.waitForNDrops(1, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog('Almost done!.', BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialogWithImage('Last animal! Can you bring the goat in?', goat.image, "left", NONBLOCK);
truck.accept([goat], BLOCKING);
truck.waitForNDrops(1, BLOCKING);

truck.accept(false, BLOCKING);
dialog.clearDialog(BLOCKING);
dialog.printDialog("Thanks neighbor! You did a pretty good job here.", BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog("Here on out you can do similar tasks like this and gain XP points and gold tokens.", BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog("See these properties? Some of them you can't buy yet, but don't worry, complete enough tasks and one day you will be able to buy all of them!", BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog("Each property has it's own task that you can complete over and over again to obtain gold tokens as well as XP points.", BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog("Generate enough XP points and you'll go up a level!", BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog("I hope you enjoy working on this farm as much as I did!", BLOCKING);
dialog.promptNext(BLOCKING);

dialog.clearDialog(BLOCKING);
dialog.printDialog("Oh look at the time! I must be going, good luck neighbor!", NONBLOCK);


};
