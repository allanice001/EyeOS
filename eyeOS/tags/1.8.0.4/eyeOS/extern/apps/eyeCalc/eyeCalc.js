/*
                                  ____   _____
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___
                 / _ \ | | |/ _ \ |  | |\___ \
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/
                       __/ |
                      |___/              1.8

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - www.eyeos.org/team

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2009 eyeOS Team (team@eyeos.org)
*/

init_eyeCalc($myPid,$checknum);

function init_eyeCalc(myPid,checknum) {
	var mem;
	var current_op;
	var dotted = 0;
	var clear = 0;
	
	//Numbers
	for(i=0;i<10;i++) {
		eval('document.getElementById("'+myPid+'_bttn'+i+'").onclick = function(event) {addValue('+i+');};');
	}
	
	//Symbols
	var bttnDot = document.getElementById(myPid+'_bttnDot');
	var bttnEqual = document.getElementById(myPid+'_bttnEqual');
	
	//Operations
	var bttnDivide = document.getElementById(myPid+'_bttnDivide');
	var bttnMultiply = document.getElementById(myPid+'_bttnMultiply');
	var bttnSubstract = document.getElementById(myPid+'_bttnSubstract');
	var bttnAdd = document.getElementById(myPid+'_bttnAdd');
	var bttnSign = document.getElementById(myPid+'_bttnsign');
	
	//Display
	var display = document.getElementById(myPid+'_display');
	
	display.onkeypress = function(ev) {
		var e = new xEvent(ev);
		if(e.keyCode > 47 && e.keyCode < 58) {
			addValue(e.keyCode-48);
		} else if(e.keyCode == 46) {
			addDot();
		} else if(e.keyCode == 35 || e.keyCode == 40 
			|| e.keyCode == 34 || e.keyCode == 37 || e.keyCode == 12 || e.keyCode == 39 || e.keyCode == 36 ||
			e.keyCode == 38 || e.keyCode == 33) {
			if(e.keyCode == 45) {
				addValue(0);
			} else if(e.keyCode == 35) {
				addValue(1);
			} else if(e.keyCode == 40) {
				addValue(2);
			} else if(e.keyCode == 34) {
				addValue(3);
			} else if(e.keyCode == 37) {
				addValue(4);
			} else if(e.keyCode == 12) {
				addValue(5);
			} else if(e.keyCode == 39) {
				addValue(6);
			} else if(e.keyCode == 36) {
				addValue(7);
			} else if(e.keyCode == 38) {
				addValue(8);
			} else if(e.keyCode == 33) {
				addValue(9);
			} 
		}
		return false;
	}
	
	//Special
	var bttnClear = document.getElementById(myPid+'_bttnClear');

	bttnDivide.onclick = function() {startCalc("divide");};
	bttnMultiply.onclick = function() {startCalc("multiply");};
	bttnSubstract.onclick = function() {startCalc("substract");};
	bttnAdd.onclick = function() {startCalc("add");};
	bttnDot.onclick = function() {addDot();};
	bttnEqual.onclick = function() {showResult();};
	bttnClear.onclick = function() {clearScreen();};
	bttnSign.onclick = function() {changeSign()};
	
	//Calculator Functions
	//VGhpcyBzb3VyY2UgY29kZSBpcyBwYXJ0IG9mIHRoZSBleWVPUyBwcm9qZWN0LCB3d3cuZXllb3Mub3Jn
	function showResult(op) {
		if (mem && current_op) {
			switch (current_op) {
				case "divide":
					mem = mem / parseFloat(display.value);
				break
				case "multiply":
					mem = mem * parseFloat(display.value);
				break
				case "substract":
					mem = mem - parseFloat(display.value);
				break
				case "add":
					mem = mem + parseFloat(display.value);
				break
			}
			effectShow(mem);
			dotted = 0;
		}
		if(op) {
			current_op = op;
		} else {
			mem = "";
		} 
	}
	
	function startCalc(op) {
		if(mem) {
			showResult(op);
		} else {
			current_op = op;
			switch(op) {
				case "divide":
					mem = parseFloat(display.value);
				break
				case "multiply":
					mem = parseFloat(display.value);
				break
				case "substract":
					mem = parseFloat(display.value);
				break
				case "add":
					mem = parseFloat(display.value);
				break
			}
		}
		clear = 1;
		dotted = 0;
	}
	
	function addValue(val) {
		if(clear == 1) {
			display.value = 0;
			clear = 0;
		}
		if(dotted == 1) {
			display.value = display.value+val;
		} else {
			display.value = display.value*10+val;
		}
	}
	
	function addDot() {
		if(clear == 1) {
			display.value = 0;
			clear = 0;
		}
		if(dotted != 1) {
			display.value += ".";
			dotted = 1;
		}
	}
	
	function clearScreen() {
		display.value = 0;
		dotted = 0;
		mem = "";
		clear = 0;
		display.style.color = '#000000';
	}
	
	function changeSign() {
		display.value = parseFloat(display.value)*-1
	}
	
	function effectShow(result) {
		display.style.color = "#FFF";
		setTimeout('document.getElementById("$myPid_display").style.color = "#CCC";',60);
		setTimeout('document.getElementById("$myPid_display").style.color = "#999";',120);
		setTimeout('document.getElementById("$myPid_display").style.color = "#666";',180);
		setTimeout('document.getElementById("$myPid_display").style.color = "#333";',240);
		setTimeout('document.getElementById("$myPid_display").style.color = "#000";',300);
		display.value = result;
	}
}