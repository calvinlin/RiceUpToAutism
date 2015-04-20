window.onload = function (){
	init();
	function init() {
		//if task is not bought yet, change CSS to grey
		//load money amount
		//load XP amount
		$('.layer').hide();
		$('#_mainScreen').show();
	}

	
//=============================================================================
// HOVER FUNCTIONALITY
//-----------------------------------------------------------------------------
// When user hovers over one of the clickable things, the title/status will 
// show
//-----------------------------------------------------------------------------
	
	$('.task').hover(function() {
		$(this).css({ transform: 'scale(1.05)' });
	}
	,function(){
		$(this).css({ transform: 'scale(1)' });
	});        

	
//=============================================================================

//=============================================================================
// NAVIGATE FUNCTIONALITY
//-----------------------------------------------------------------------------
// When one of the things is clicked, it will go and navigate to the specified
// div and hide all the other ones
//-----------------------------------------------------------------------------
	
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

//-----------------------------------------------------------------------------
	function navigate(data) {
		alert(data);
		$('#_mainPage').hide();
		if(data == '11') {
			$('.layer').hide();
			$('#_task1').show();
		}
		else if(data == '12') {
			$('.layer').hide();
			$('#_task2').show();
		}
		else if(data == '13') {
			$('.layer').hide();
			$('#_task3').show();
		}
		else if(data == '14') {
			$('.layer').hide();
			$('#_task4').show();
		}
		else if(data == '1') {
			$('.layer').hide();
			$('#_shop').show();
		}
		else if(data=='2') {
			$('.layer').hide();
			$('#_shop').show();
		}
	}
//=============================================================================


	
};

