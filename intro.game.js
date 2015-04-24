//=======================================================================================
//  Program main:
//=======================================================================================

layerFunction.intro = function (){

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

sequencer.newFunction(BLOCKING, function( next ){
	$("#greyout").transition({ opacity: 0 }, 500, "ease-in-out", function(){
		$(this).css("display", "none");
		$(".dialog-box, .dialog-head").css("z-index", 9);
		next();
	});
});

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

sequencer.newFunction(BLOCKING, function(next){
	$("#greyout")
		.css("display", "block")
		.transition({ opacity: 0.5 }, 500, "ease-in-out", next);
});

sequencer.newFunction(BLOCKING, function( next ){
	$(document.querySelectorAll(".resource-display")).transition({opacity: 1.0}, 500, "ease-in-out");
	$(".growth-display")
		.css("display", "block")
		.transition({opacity: 1.0}, 500, "ease-in-out", next);
	
});

sequencer.newFunction(BLOCKING, function ( next ){
	$(currentLayer.querySelector(".growth-display .token-display")).transition({opacity: 1}, 500, "ease-in-out", next);
});

sequencer.newFunction(BLOCKING, function ( next ){
	
	var tokenDiv = currentLayer.querySelector(".growth-display .token-display .token-value");
	var money = 500;
	var time = 800 / money;
	
	data.incMoneyBy(money);
	function incrementToken (){
		var newVal = (parseInt(tokenDiv.innerHTML) || 0) + 1;
        tokenDiv.innerHTML = newVal;
        if (newVal <= money){
            window.setTimeout(incrementToken, time);
        } else {
        	var actual = document.querySelector("#token-display .resource-type-count");
    		$(actual.cloneNode())
    			.text("+" + money)
    			.appendTo("#token-display")
    			.transition({top: "-=100", opacity: 0}, 500, "ease-in-out", 
    					function(){
    				$(this).remove();
    			});
    		actual.innerHTML = data.getMoney();
        	next();
        }
	}
	
	incrementToken();
	
});

sequencer.newFunction(BLOCKING, function ( next ){
	$(currentLayer.querySelector(".growth-display .xp-display")).transition({opacity: 1}, 500, "ease-in-out", next);
});

sequencer.newFunction(BLOCKING, function ( next ){
	
	var xpDiv = currentLayer.querySelector(".growth-display .xp-display .xp-value");
	var xp = 500;
	var time = 800 / xp;
	
	data.incXPBy(xp);
	function incrementXP(){
		var newVal = (parseInt(xpDiv.innerHTML) || 0) + 1;
        xpDiv.innerHTML = newVal;
        if (newVal <= xp){
            window.setTimeout(incrementXP, time);
        } else {
        	var actual = document.querySelector("#xp-display .resource-type-count");
    		$(actual.cloneNode())
    			.text("+" + xp)
    			.appendTo("#xp-display")
    			.transition({top: "-=100", opacity: 0}, 500, "ease-in-out", 
    					function(){
    				$(this).remove();
    			});
    		actual.innerHTML = data.getXP();
        	next();
        }
	}
	
	incrementXP();
	
});

sequencer.newFunction(BLOCKING, function (next){
	$(document.querySelectorAll(".resource-display")).transition({opacity: 0}, 500, "ease-in-out");
	$(".growth-display").transition({opacity: 0}, 500, "ease-in-out", next);
});

sequencer.newFunction(NONBLOCK, function (next){
	switchToLayer("main");
	next();
});

};
