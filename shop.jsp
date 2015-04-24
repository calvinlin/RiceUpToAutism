<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>SHOP</title>
<link rel="stylesheet" type="text/css" href="shopStyles.css">
        
</head>

<body onload="totalcoins();">

<div id="mytitle">SHOP</div>
	
	<script language="javascript" type="text/javascript">
<!-- Hide JavaScript

	var x = 10000;
	
	function totalcoins()
	{
	
	document.getElementById("coins").firstChild.nodeValue= " You have " + x + " coins ";
	
	}

	function changeImage()
	{
		document.getElementById("row1").style.height = "35%";
		document.getElementById("row1").style.width = "35%";
		
		document.getElementById("row2").style.height = "35%";
		document.getElementById("row2").style.width = "35%";
	}
	
	function changeColor()
	{
		document.getElementById("paragraph1").style.color="red";
		document.getElementById("paragraph1").firstChild.nodeValue="SAUMIL JAGIRDAR";
	}
	
	
	function totalcoinsTruck1(element)
	{
		x = x-100;
		document.getElementById("coins").firstChild.nodeValue= " You have " + x + " coins";
		element.onclick = '';
		document.getElementById("t1").firstChild.nodeValue= "BOUGHT!";
		
		var img;
		img = document.getElementById('truck1')
		img.src = "bought.png";
	}
		
	
	function totalcoinsTruck2(element)
	{
		x=x-200;
		document.getElementById("coins").firstChild.nodeValue= "You have " + x + " coins";
		element.onclick = '';
		document.getElementById("t2").firstChild.nodeValue= "BOUGHT!";
		
		var img;
		img = document.getElementById('truck2')
		img.src = "bought.png";
		
	}
	
	function totalcoinsLevel1(element)
	{
		x=x-200;
		document.getElementById("coins").firstChild.nodeValue= "You have " + x + " coins";
		element.onclick = '';
		document.getElementById("l1").firstChild.nodeValue= "BOUGHT!";
		
		var img;
		img = document.getElementById('level1')
		img.src = "bought.png";
		
	}
	
	function totalcoinsLevel2(element)
	{
		x=x-200;
		document.getElementById("coins").firstChild.nodeValue= "You have " + x + " coins";
		element.onclick = '';
		document.getElementById("l2").firstChild.nodeValue= "BOUGHT!";
		
		var img;
		img = document.getElementById('level2')
		img.src = "bought.png";
		
	}
	
	function blink(){
		
		window.setInterval(function(){
			  $('.blink').toggle();
			}, 250);
		
	}
	
-->
</script>
<BR>
<h1 id = "newtrucks">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BUY &nbsp;NEW &nbsp; TRUCKS</h1>
<div id = "row1" >

<div>
<img src = "truck1.jpg" id = "truck1" hspace = "40" width="100" height="100" class = "truck" onclick= "return totalcoinsTruck1(this);" >
<div id="caption1"><h2 id = "t1"><img src = "coin.png" width = "30" height = "30">100<img src = "coin.png" width = "30" height = "30"></h2></div> 
</div>

<div>
<img src = "truck2.jpg" id = "truck2" hspace = "40" width="100" height="100" class = "truck" onclick="return totalcoinsTruck2(this);">
<div id="caption2"><h2 id= "t2"><img src = "coin.png" width = "30" height = "30">200<img src = "coin.png" width = "30" height = "30"></h2></div> 
</div>

</div>

<h1 id= "newlevels">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BUY &nbsp;NEW&nbsp;PROPERTY </h1>
<div id = "row2">

<div class = "LEVELS">
<img src = "im4.jpg" hspace = "40" width="100" height="100" id = "level1" onclick= "return totalcoinsLevel1(this);">
<div id="captionl1"><h2 id= "l1"><img src = "coin.png" width = "30" height = "30">100<img src = "coin.png" width = "30" height = "30"></h2></div>
</div>
<div class = "LEVELS">
<img src = "im5.jpg" hspace = "40" width="100" height="100" id = "level2" onclick= "return totalcoinsLevel2(this);">
<div id="captionl2"><h2 id= "l2"><img src = "coin.png" width = "30" height = "30">200<img src = "coin.png" width = "30" height = "30"></h2></div>
</div>

</div>
<a href="NewFile.jsp"><img src="picket_right.png" width="200" height = "200" id = "next"></a>

<img src = "coin.png" class = "blink" id = "money1" width="100" height="100" onclick = "blink();" >
<img src = "coin.png" class = "blink" id = "money2" width="100" height="100" onclick = "blink();" >
<img src = "coin.png" class = "blink" id = "money3" width="100" height="100" onclick = "blink();" >
<img src = "coin.png" class = "blink" id = "money8" width="100" height="100" onclick = "blink();" >
<img src = "coin.png" class = "blink" id = "money9" width="100" height="100" onclick = "blink();" >
<img src = "coin.png" class = "blink" id = "money10" width="100" height="100" onclick = "blink();" >

<h1 id = "coins">
</h1>
<img src = "store_owner.png" class = "blink" id = "storeowner" width="300" height="350" onclick = "blink();">

<div class="dialog">
    <div class="triangleOutline">
        <div class="triangle"></div>
    </div>
    <div class="dialogBox">
        <h1>Hello There!<br>
        What would you like to buy today dear ??</h1>
    </div>
</div>

</body>
</html>