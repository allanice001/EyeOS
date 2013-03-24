/*
                                  ____   _____ 
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___  
                 / _ \ | | |/ _ \ |  | |\___ \ 
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/ 
                       __/ |                   
                      |___/              1.2

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - eyeOS.org/whoarewe

     eyeOS is released under the GNU General Public License (GPL)
            provided with this release in license.txt
             or via web at gnu.org/licenses/gpl.txt

        Copyright 2005-2007 eyeOS Team (team@eyeos.org)
        
*/

function Shape_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var width = params['width'];
	var height = params['height'];
	var visible = params['visible'];
	var type = params['type'];
	var sidesNumber = params['sidesNumber'];
	var length = params['length'];
	var radius = params['radius'];
	var color = params['lineColor'];

	var myContainer = document.createElement('div');
	
	if(type == 'polygon' && length > 0 && sidesNumber > 2) {
		var myShape = document.createElement('div');
		var apothem = params['apothem'];
		var stride = 360/sidesNumber;
		myContainer.setAttribute('id', name+'_GlobalContainer');
		
		/*width = apothem*2+'px';
		height= apothem*2+'px';
		
		var myX = width/2-length;
		var myY = height+apothem;*/
		for(var angle = 0; angle < 360; angle += stride) {
			//drawline(myX, myY, length, angle);
			
			if(angle > 90 && angle < 270) {
				
			}
		}
		
		myShape.setAttribute('id', name);
		myShape.style.width = width+'px';
		myShape.style.height= height+'px';
	
		myContainer.style.width = width+'px';
		myContainer.style.height= height+'px';
		myContainer.appendChild(myShape);
	} else if(type == 'circle' && radius > 0) {
		var myShape = document.createElement('div');
		myContainer.setAttribute('id', name+'_GlobalContainer');
		
		width = radius*2+'px';
		height= radius*2+'px';
		
		var r2 = radius * radius;
		
		for(myX = -radius; myX <= radius; myX++) {
			myY = Math.sqrt(r2 - myX*myX);
            
			myPx = document.createElement('div');
			myPx.style.width = '1px';
			myPx.style.height = '1px';
			myPx.style.top = (myY+20)+'px';
			myPx.style.left = (myX+20)+'px';
			myPx.style.position = 'absolute';
			myPx.style.background = color;
			myShape.appendChild(myPx);
			
			myPx = document.createElement('div');
			myPx.style.width = '1px';
			myPx.style.height = '1px';
			myPx.style.top = (radius-myY)+'px';
			myPx.style.left = (radius-myX)+'px';
			myPx.style.position = 'absolute';
			myPx.style.background = color;
			myShape.appendChild(myPx);
		}
		
		myShape.setAttribute('id', name);
		myShape.style.width = width+'px';
		myShape.style.height= height+'px';
	
		myContainer.style.width = width+'px';
		myContainer.style.height= height+'px';
		myContainer.appendChild(myShape);
	} else if(type == 'rectangle') {
		myContainer.setAttribute('id', name);
		myContainer.style.width = width+'px';
		myContainer.style.height= height+'px';
		myContainer.style.border = '1px solid '+color;
	} else {
		return;
	}
	
	if(visible == 0) {
		myContainer.style.visibility = 'hidden';
	}

	createWidget(name+'_Container',father,myContainer,horiz,vert,x,y,width,height,'eyeShape',cent);
}