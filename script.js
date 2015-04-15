window.onload = function (){
	var dialogs = [
		'Farmer: "Howdy! You must be my neighbor [username]!"', 
		'Farmer: "Glad you could come take over my farm!"',
		'Farmer: "Before I leave though, I need you to help me out with loading animals onto my truck."'
	];
	rpgDialog.createDialog(dialogs, ".dialog-box", 30);
};
