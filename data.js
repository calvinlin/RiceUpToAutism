// Can I recommend the following? -- Wilmer

function initPlayerData(){
	// define the data model here
	var result = {
		money: 0,
		xp: 0,
		name: "neighbor",
		unlocked_task: [false, false, false, false] 
	};
	window.localStorage.setItem("playerData", JSON.stringify(result));
		
	return result;
}

function getPlayerData(){
	// return the playerData in localStorage if it exists; call initPlayerData
	// to initialize it otherwise
	return JSON.parse(window.localStorage.getItem("playerData")) || initPlayerData();
}

function pushPlayerData( playerData ){
	// assume the given playerData is valid. later, probably validate by creating
	// an actual model to match against.
	window.localSotrage.setItem("playerData", JSON.stringify(result));
}

// The method above will work for the default javascript types and arrays of them
// I assume. If you wanted to implement getters/setters to the things, you could
// do that directly on the data object too.


function dataInit() {
	if (window.localStorage.getItem("money") === null){
		window.localStorage.setItem("money", "0");
	}
	
	if (window.localStorage.getItem("xp") === null){
		window.localStorage.setItem("xp", "0");
	}
	
	if (window.localStorage.getItem("name") === null){
		window.localStorage.setItem("name", "neighbor");
	}
	
	if (window.localStorage.getItem("unlocked_task1") === null){
		window.localStorage.setItem("unlocked_task1", "0");
	}
	
	if (window.localStorage.getItem("unlocked_task2") === null){
		window.localStorage.setItem("unlocked_task2", "0");
	}
	
	if (window.localStorage.getItem("unlocked_task3") === null){
		window.localStorage.setItem("unlocked_task3", "0");
	}
	
	if (window.localStorage.getItem("unlocked_task4") === null){
		window.localStorage.setItem("unlocked_task4", "0");
	}
	getData();
}

	var name;
	var money;
	var xp;
	var unlocked_task1;
	var unlocked_task2;
	var unlocked_task3;
	var unlocked_task4;

function getData() {
	name = window.localStorage.getItem("name");
	money = window.localStorage.getItem("money");
	xp = window.localStorage.getItem("xp");
	unlocked_task1 = window.localStorage.getItem("unlocked_task1");
	unlocked_task2 = window.localStorage.getItem("unlocked_task2");
	unlocked_task3 = window.localStorage.getItem("unlocked_task3");
	unlocked_task4 = window.localStorage.getItem("unlocked_task4");
}

function resetData() {
	localStorage.clear();
}

function getName() {
	return name;
}

function getMoney() {
	return money;
}

function getXP() {
	return xp;
}

function getUnlockedTask1() {
	return unlocked_task1;
}

function getUnlockedTask2() {
	return unlocked_task2;
}


function getUnlockedTask3() {
	return unlocked_task3;
}

function getUnlockedTask4() {
	return unlocked_task4;
}

