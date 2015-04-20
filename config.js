window.onload = function (){
	dataInit();
	$('#name').text(getName());
	$('#money').text(getMoney());
	$('#xp').text(getXP());
	$('#task1_status').text(getUnlockedTask1());
	$('#task2_status').text(getUnlockedTask2());
	$('#task3_status').text(getUnlockedTask3());
	$('#task4_status').text(getUnlockedTask4());
	alert(getName());
}

