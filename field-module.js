//=======================================================================================
// class Field:
//=======================================================================================
//
//	constructor Field( [selector, animalClass, wanderingClass, animateFreq] )
//
//	jQuery element [default $(".field")]			: the jQuery representing the field. Is 
//													  determined from $(selector)
//  String animalClass [default "animal"]			: the selector used to identify Animal elements.
//												  	  used to create the Animal elements.
//  String wanderingClass 							: the selector used to identify wandering
// 		[default "field-wandering"]					  animal elements. 
//  Number animateFreq								: represents the amount of time a 'tick' of
//		[default 10]								  animation should take, in ms
//
//  spawn( Animal animalType )						: creates an Element inside the field Element that
//													  represents an Animal
//
//=======================================================================================

function Field (sequencer, selector, animalClass, wanderingClass, animateFreq ){

	this.sequencer = sequencer;
	this.selector = selector === undefined ? ".field" : selector;
	this.animalClass = animalClass === undefined ? "animal" : animalClass;
	this.wanderingClass = wanderingClass === undefined ? "field-wandering" : wanderingClass;
	this.animateFreq = animateFreq === undefined ? 500 : animateFreq;
	
	this.element = $(this.selector);
	
	this.updater = function (){
		
		var self = this;
		
		$('.'+this.wanderingClass+'.'+this.animalClass).each(function(){
			
			var nUpdate = parseInt(this.getAttribute("duration"));
			
			var xPos = parseFloat(this.getAttribute("x-pos"));
			var yPos = parseFloat(this.getAttribute("y-pos"));
			
			var heading = parseFloat(this.getAttribute("heading"));
			
			if (nUpdate === 0){
				heading = Math.PI * 2 * Math.random();
				nUpdate = 150 + Math.round(Math.random() * 100);
			}

			var newXPos = xPos + Math.cos(heading) * 3;
			var newYPos = yPos + Math.sin(heading) * 3;
			
			var dims = this.getBoundingClientRect();
			
			if (newXPos > self.element.width() - dims.width || newXPos < 0){
				heading = Math.atan2(Math.sin(heading), -Math.cos(heading));
				newXPos = xPos + Math.cos(heading) * 3;
			}
					
			if (newYPos > self.element.height() - dims.height || newYPos < 0){
				heading = Math.atan2(-Math.sin(heading), Math.cos(heading));
				newYPos = yPos + Math.sin(heading) * 3;
			}
			
			this.setAttribute("duration", --nUpdate);
			this.setAttribute("x-pos", newXPos);
			this.setAttribute("y-pos", newYPos);
			this.setAttribute("heading", heading);
			$(this).transition({x: newXPos, y: newYPos}, 0, "linear");
			
		});
		
		window.setTimeout(this.updater, this.animateFreq);
		
	}.bind(this);
	
	interact('.'+this.animalClass).draggable({
		onstart: function(event){
			
			event.target.classList.remove(this.wanderingClass);
			event.target.classList.add("panic");
			
			$(event.target).transition({
				scale: [1.25, 1.25]
			}, 0, "linear");
			
		}.bind(this),
		onmove: function (event){
			
			var newXPos = parseFloat(event.target.getAttribute("x-pos")) + event.dx;
			var newYPos = parseFloat(event.target.getAttribute("y-pos")) + event.dy;
			
			event.target.setAttribute("x-pos", newXPos);
			event.target.setAttribute("y-pos", newYPos);
			
			$(event.target).transition({
				x: newXPos,
				y: newYPos
			}, 0, "linear");
			
		},
		onend: function (event){
			
			var xPos = parseFloat(event.target.getAttribute("x-pos"));
			var yPos = parseFloat(event.target.getAttribute("y-pos"));
			
			var dim = event.target.getBoundingClientRect();
		
			if (xPos > this.element.width() - dim.width){
				xPos = this.element.width() - dim.width;
			} else if (xPos < 0){
				xPos = 0;
			}
			
			if (yPos > this.element.height() - dim.height){
				yPos = this.element.height() - dim.height;
			} else if (yPos < 0){
				yPos = 0;
			}
			
			event.target.setAttribute("x-pos", xPos);
			event.target.setAttribute("y-pos", yPos);
			
			$(event.target)
				.transition({
					x: xPos,
					y: yPos
				}, 300, "snap", function(){
					$(event.target)
						.transition({
							scale: [1.0, 1.0]
						}, 50, "snap")
						.removeClass("panic")
						.addClass(this.wanderingClass);
				}.bind(this)
			);
			
		}.bind(this)
	});	
	
	window.setTimeout(this.updater, this.animateFreq);
	
}

Field.prototype.spawn = function (animalType, blocking){
	this.sequencer.newFunction(blocking, function(next){
		
	var newElement = document.createElement("div");
	var wanderingClass = this.wanderingClass;
	newElement.classList.add(this.animalClass);
	newElement.classList.add(animalType.elementClass);
	
	this.element.append(newElement);
	
	var dims = newElement.getBoundingClientRect();
	
	newElement.setAttribute("heading", Math.PI * 2 * Math.random());
	newElement.setAttribute("x-pos", Math.random() * (this.element.width() - dims.width));
	newElement.setAttribute("y-pos", Math.random() * (this.element.height() - dims.height));
	newElement.setAttribute("duration", 150 + Math.round(Math.random() * 100));
	
	$(newElement).transition({
		opacity: 0.0,
		x: parseFloat(newElement.getAttribute("x-pos")),
		y: parseFloat(newElement.getAttribute("y-pos")) - 50
	}, 0, "linear", function(){
		$(newElement).transition({
			opacity: 1,
			y: "+=50"
		}, 500, "ease", function (){
			$(newElement).addClass(wanderingClass).bind();
		});
	});
	
	next();
	
}.bind(this))};
