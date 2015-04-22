window.onload = function (){
	
	function init() {
		//if task is not bought yet, change CSS to grey
		//load money amount
		//load XP amount
		$('.layer').hide();
		$('#_mainScreen').show();
		var _data = fetchPlayerData();
		checkLevelUnlocked(_data);
		getXPandMoney(_data);
		startMusic();
		
	}
	
	var _data = fetchPlayerData();
	var mainMusic = new Audio('audio/bgm.mp3');
	var taskMusic = new Audio('audio/task.mp3');
	init();
	$('.nonClickable').click(function(){return false;});
	
	
//=============================================================================
// MUSIC FUNCTIONALITY
//-----------------------------------------------------------------------------
// Remembers music file locations, starts/stops when necessary 
//-----------------------------------------------------------------------------
		
		// Recommendation:
		//
		// toggle is deprecated I think, so:
		//
		// // if you still want to use toggle for other things 
		// function toggle (fn1, fn2){
		// 		var clicked = 0;
		// 		return function (){(clicked ^= 1) ? fn1() : fn2()};
		// }
		// document.getElementById("music").addEventListener("click", toggle(startMusic, stopMusic));
		//
	
		$('#music').toggle(
				function () {
					startMusic();
				},
				function () {
					stopMusic();
				}
		);
		
		function stopMusic() {
			mainMusic.pause();
			mainMusic.currentTime = 0;
			
			taskMusic.pause();
			taskMusic.currentTime = 0;
		}
		
		function startMusic() {
			stopMusic();
			if($('#_mainScreen').is(':visible')) {
				mainMusic.play();
			}
			else {
				taskMusic.play();
			}
		}
//=============================================================================

	
//=============================================================================
// HOVER FUNCTIONALITY
//-----------------------------------------------------------------------------
// When user hovers over one of the clickable things, the title/status will 
// show
//-----------------------------------------------------------------------------
	
//	$('.task').hover(function() {
//		$(this).css({ transform: 'scale(1.05)' });
//	}
//	,function(){
//		$(this).css({ transform: 'scale(1)' });
//	});

//=============================================================================

//=============================================================================
// NAVIGATE FUNCTIONALITY
//-----------------------------------------------------------------------------
// When one of the things is clicked, it will go and navigate to the specified
// div and hide all the other ones
//-----------------------------------------------------------------------------

// recommendation:
//
//	have all clickable things that change layers as .layer-changer (or something like that)
//  and the current active layer as .layer (so that its class is .active.layer) and then have:
//  
// $(".layer-changer").click(function(){
//	$(this).closest(".layer").hide(); 				// assume the element just clicked is part of the currently visible layer
//	$("#_" + this.id.replace(/[\W_]/, '')).show();	// transforms e.g. "#task_1" to "#_task1"
//  taskMusic.play();
// });
//
	
	$('#task_1').on('click', function() {
		navigate('11');
	});
	$('#task_2').on('click', function() {
		navigate('12');
	});
	$('#task_3').on('click', function() {
		navigate('13');
	});
	$('#task_4').on('click', function() {
		navigate('14');
	});
	$('#shop').on('click', function() {
		navigate('1');
	});
	$('#achievements').on('click', function() {
		navigate('2');
	});


	function navigate(data) {
		stopMusic();

		if((data == '11') && (_data.hasUnlockedTask("pigpen"))) {
			$('.layer').hide();
			$('#_task1').show();
			taskMusic.play();
		}
		else if(data == '12' && (_data.hasUnlockedTask("stable"))) {
			$('.layer').hide();
			$('#_task2').show();
			taskMusic.play();
		}
		else if(data == '13' && (_data.hasUnlockedTask("shearing"))) {
			$('.layer').hide();
			$('#_task3').show();
			taskMusic.play();
		}
		else if(data == '14' && (_data.hasUnlockedTask("eggsort"))) {
			$('.layer').hide();
			$('#_task4').show();
			taskMusic.play();
		}
		else if(data == '1') {
			$('.layer').hide();
			$('#_shop').show();
			taskMusic.play();
		}
//		else if(data=='2') {
//			$('.layer').hide();
//			$('#_shop').show();
//			taskMusic.play();
//		}
	}
//=============================================================================

	function checkLevelUnlocked(data) {

		if(data.hasUnlockedTask("pigpen") == false) {
			$('#task_1').css('background','url("resources/images/property_icon/pig_pen_locked.png") center/cover');
			$('#task1_locked').show();
			$('#task_1').addClass('nonClickable');
			
			//prevent image growing on hover
			$('#task_1').hover(function() {
				$(this).css({ transform: 'scale(1)' });
			}
			,function(){
				$(this).css({ transform: 'scale(1)' });
			});
		}
		else {
			$('#task_1').css('background','url("resources/images/property_icon/pig_pen.png") center/cover');
			$('#task1_locked').hide();
			$('#task_1').removeClass('nonClickable');
			
			//allow image growing on hover
			$('#task_1').hover(function() {
				$(this).css({ transform: 'scale(1.05)' });
			}
			,function(){
				$(this).css({ transform: 'scale(1)' });
			});
		}
		
		if(data.hasUnlockedTask("stable") == false) {
			$('#task_2').css('background','url("resources/images/property_icon/stable_locked.png") center/cover');
			$('#task2_locked').show();
			$('#task_2').addClass('nonClickable');
			
			//prevent image growing on hover
			$('#task_2').hover(function() {
				$(this).css({ transform: 'scale(1)' });
			}
			,function(){
				$(this).css({ transform: 'scale(1)' });
			});
		}
		else {
			$('#task_2').css('background','url("resources/images/property_icon/stable.png") center/cover');
			$('#task2_locked').hide();
			$('#task_2').removeClass('nonClickable');
			
			//allow image growing on hover
			$('#task_2').hover(function() {
				$(this).css({ transform: 'scale(1.05)' });
			}
			,function(){
				$(this).css({ transform: 'scale(1)' });
			});
		}
		
		if(data.hasUnlockedTask("shearing") == false) {
			$('#task_3').css('background','url("resources/images/property_icon/sheep_pen_locked.png") center/cover');
			$('#task3_locked').show();
			$('#task_3').addClass('nonClickable');
			
			//prevent image growing on hover
			$('#task_3').hover(function() {
				$(this).css({ transform: 'scale(1)' });
			}
			,function(){
				$(this).css({ transform: 'scale(1)' });
			});
		}
		else {
			$('#task_3').css('background','url("resources/images/property_icon/sheep_pen.png") center/cover');
			$('#task3_locked').hide();
			$('#task_3').removeClass('nonClickable');
			
			//allow image growing on hover
			$('#task_3').hover(function() {
				$(this).css({ transform: 'scale(1.05)' });
			}
			,function(){
				$(this).css({ transform: 'scale(1)' });
			});
		}
		
		if(data.hasUnlockedTask("eggsort") == false) {
			$('#task_4').css('background','url("resources/images/property_icon/chicken_coup_locked.png") center/cover');
			$('#task4_locked').show();
			$('#task_4').addClass('nonClickable');
			
			//prevent image growing on hover
			$('#task_4').hover(function() {
				$(this).css({ transform: 'scale(1)' });
			}
			,function(){
				$(this).css({ transform: 'scale(1)' });
			});
		}
		else {
			$('#task_4').css('background','url("resources/images/property_icon/chicken_coup.png") center/cover');
			$('#task4_locked').hide();
			$('#task_4').removeClass('nonClickable');
			
			//prevent image growing on hover
			$('#task_4').hover(function() {
				$(this).css({ transform: 'scale(1.05)' });
			}
			,function(){
				$(this).css({ transform: 'scale(1)' });
			});
		}
	}
	
	function getXPandMoney(data) {
		$('#_xp').text(data.getXP());
		$('#_money').text(data.getMoney());
	}
	
};

