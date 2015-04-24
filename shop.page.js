layerFunction.shop = function (){

	var data = fetchPlayerData();
	var sequencer = new Sequential();
	var dialog = new Dialog(sequencer, undefined, "#dialog-box");
	
	var prices = {
			tractor: [5000, 25000, 100000],
			task: [
			       {price: 5000, task: "eggsort"}, 
			       {price: 25000, task: "pigpen"},
			       {price: 100000, task: "stable"}
			]
	};
	
	var truckRow = currentLayer.querySelector('#truck-row');
	
	var tractorListings = currentLayer.querySelectorAll("#truck-row .item");
	for (var i = data.getTractorTier(); i < tractorListings.length; ++i){
		tractorListings[i].classList.add("locked");
		tractorListings[i].addEventListener("click", function(){
			var j = i;
			return function(event){
				if (prices.tractor[j]> data.getMoney()){
					dialog.clearDialog(BLOCKING);
					dialog.printDialog("Sorry, you'll need " + (prices.tractor[j] - data.getMoney()).toString() + " more tokens for that.", BLOCKING);
				} else {
					data.unlockTractor(j + 1);
					data.decMoneyBy(prices.tractor[j]);
					switchToLayer("shop");
				}
			};
		}());
	}
	
	var propertyRow = currentLayer.querySelector('#property-row');
	
	var propertyListings = currentLayer.querySelectorAll("#property-row .item");
	for (var i = 0; i < propertyListings.length; ++i){
		if (!data.hasUnlockedTask(prices.task[i].task)){
			propertyListings[i].classList.add("locked");
			propertyListings[i].addEventListener("click", function(){
				var j = i;
				return function(event){
					if (prices.task[j].price > data.getMoney()){
						dialog.clearDialog(BLOCKING);
						dialog.printDialog("Sorry, you'll need " + 
								(prices.task[j].price - data.getMoney()).toString() + " more tokens for that.", BLOCKING);
					} else {
						data.unlockTask(prices.task[j].task);
						data.decMoneyBy(prices.task[j].price);
						switchToLayer("shop");
					}
				};
			}());
		}
	}
	
	
	currentLayer.querySelector("#exit").addEventListener("click", switchToLayer.bind(null, "main"));
										
}