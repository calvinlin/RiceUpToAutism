rpgDialog = {
	createDialog: function ( dialogList, selector, speed ){

		if (speed === undefined) { speed = 10 };
		if (selector === undefined) { 
			selector = ".rpg-dialog"; }
		else { 
			console.log("here");
			$(selector).addClass("rpg-dialog");}
		
		var initial = 0;
		var individual = dialogList[initial];
		var single = function( dialog ) {
			
			for(var i = 0; i < dialog.length; i++) {
				(function(i){    
				setTimeout(function(){
					$(selector).text($(selector).text() + dialog[i]);
					if (i == dialog.length-1 ) {
						$(selector).prepend('<div class="rpg-dialog-arrow"></div>');
						$(selector).bind('click', function() {
							if (dialogList[initial+1]) {
								$(selector).text('');
								initial += 1;
								individual = dialogList[initial].split('');
								single( individual );
							}
							$(selector).unbind("click");
						});
					}
					}, speed * i);  
	    
				})(i);
			}
		};
		
		single(individual);
	}	
}