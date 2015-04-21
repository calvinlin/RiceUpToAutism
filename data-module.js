// Call this function at the beginning of loading the game. Or whenever 
// you need to, I guess.

function fetchPlayerData(){

	// the model is defined here. it doesn't matter outside of this 
	// function, since there'll be methods and no direct access. new
	// instances of this are also created to "reset" data
	function Model (){
		this.money 			= 0;
		this.xp				= 0;
		this.name			= "neighbor";
		this.unlocked_task 	= [false, false, false, false]; 
	};
	
	// fetch the index of the most recent update
	var index = window.localStorage.getItem("playerDataindex");
	
	// have a local variable to store the data. this object will not be 
	// returned from here.
	var data;
	
	// if the index does not exist, neither does the record; create a 
	// new data entry at [index], setting [index] to 0
	//
	// this is also where the model is defined.
	if (index === null){
		window.localStorage.setItem("playerData[0]", JSON.stringify(data = new Model()));
		window.localStorage.setItem("playerDataIndex", "0");
	} 
	
	// localStorage does have an index and therefore does have data
	// to fetch. great.
	else {
		data = JSON.parse(window.localStorage.getItem("playerData[" + index + "]"));
	}
	
	// define an object to handle accessing the data. the data will effectively
	// be encapsulated and only mutable through this object's methods. also note 
	// that these functions don't use this, so there's nothing to worry about
	// when the methods change context.
	
	// nonconst will be wrapped around functions that modify data. it will 
	// auto-update playerData and the index in localStorage when wrapped 
	// around a function, by running the function first and then calling
	// on localStorage's methods. 
	var nonconst = function ( fn ){ return function (){ 
		var to_return = fn();
		window.localStorage.setItem("playerDataIndex", ++index);
		window.localStorage.setItem("playerData[" + index + "]", JSON.stringify(data));
		return to_return;
	}};
	
	// define the object and its methods, and return it
	return {
		
		// const functions -------------------------
		
		// boring old getters
		getMoney: function (){ return data.money },
		getXP: function (){ return data.xp },
		getName: function (){ return data.name },
		hasUnlockedTask: function (taskNo){ return data.unlocked_task[taskNo] },
		
		// nonconst functions ----------------------
		
		// resets the data, but the old copies remain
		reset: nonconst ( function (amt) { data = new Model() }),
		
		// money incrementers and decrementers
		incMoneyBy: function (amt) { nonconst( function (){ return (data.money += amt) } ) },
		decMoneyBy: function (amt) { nonconst( function (){ return (data.money -= amt) } ) },
		
		// xp incrementers and... decrementers (if needed?)
		incXPBy: function (amt) { nonconst( function () { return (data.xp += amt) } ) },
		decXPBy: function (amt) { nonconst( function () { return (data.xp -= amt) } ) },
		
		// change name... maybe?
		changeName: function (name) { nonconst( function () { return (data.name = name) } ) },
		
		// sets the value of a task to be unlocked 
		unlockTask: function (task) { nonconst( function() { data.unlocked_task[taskNo] = true } ) }
		
	};
};
