init_eyeCalc($myPid,$checknum);

function init_eyeCalc(myPid,checknum) {
	var mem;
	var current_op;
	var dotted = 0;
	
	//Numbers
	var but_number_1 = document.getElementById(myPid+'_but_number_1');
	var but_number_2 = document.getElementById(myPid+'_but_number_2');
	var but_number_3 = document.getElementById(myPid+'_but_number_3');
	var but_number_4 = document.getElementById(myPid+'_but_number_4');
	var but_number_5 = document.getElementById(myPid+'_but_number_5');
	var but_number_6 = document.getElementById(myPid+'_but_number_6');
	var but_number_7 = document.getElementById(myPid+'_but_number_7');
	var but_number_8 = document.getElementById(myPid+'_but_number_8');
	var but_number_9 = document.getElementById(myPid+'_but_number_9');
	var but_number_0 = document.getElementById(myPid+'_but_number_0');
	
	//Symbols
	var but_symbol_dot = document.getElementById(myPid+'_but_symbol_dot');
	var but_symbol_equal = document.getElementById(myPid+'_but_symbol_equal');
	
	//Operations
	var but_op_divide = document.getElementById(myPid+'_but_op_divide');
	var but_op_multiply = document.getElementById(myPid+'_but_op_multiply');
	var but_op_substract = document.getElementById(myPid+'_but_op_substract');
	var but_op_add = document.getElementById(myPid+'_but_op_add');
	
	//Display
	var display = document.getElementById(myPid+'_display');
	
	//Special
	var but_exit = document.getElementById(myPid+'_but_exit');
	var but_clear = document.getElementById(myPid+'_but_clear');
	
	//Assigning Functions
	but_number_1.onclick = function() {addValue(1);};
	but_number_1.onmouseover = function() {but_number_1.src="index.php?extern=apps/eyeCalc/img/1_x.png";if(IEversion!=0){fixPNG(but_number_1.id);}};
	but_number_1.onmouseout = function() {but_number_1.src="index.php?extern=apps/eyeCalc/img/1.png";if(IEversion!=0){fixPNG(but_number_1.id);}};
	but_number_2.onclick = function() {addValue(2);};
	but_number_2.onmouseover = function() {but_number_2.src="index.php?extern=apps/eyeCalc/img/2_x.png";if(IEversion!=0){fixPNG(but_number_2.id);}};
	but_number_2.onmouseout = function() {but_number_2.src="index.php?extern=apps/eyeCalc/img/2.png";if(IEversion!=0){fixPNG(but_number_2.id);}};
	but_number_3.onclick = function() {addValue(3);};
	but_number_3.onmouseover = function() {but_number_3.src="index.php?extern=apps/eyeCalc/img/3_x.png";if(IEversion!=0){fixPNG(but_number_3.id);}};
	but_number_3.onmouseout = function() {but_number_3.src="index.php?extern=apps/eyeCalc/img/3.png";if(IEversion!=0){fixPNG(but_number_3.id);}};
	but_number_4.onclick = function() {addValue(4);};
	but_number_4.onmouseover = function() {but_number_4.src="index.php?extern=apps/eyeCalc/img/4_x.png";if(IEversion!=0){fixPNG(but_number_4.id);}};
	but_number_4.onmouseout = function() {but_number_4.src="index.php?extern=apps/eyeCalc/img/4.png";if(IEversion!=0){fixPNG(but_number_4.id);}};
	but_number_5.onclick = function() {addValue(5);};
	but_number_5.onmouseover = function() {but_number_5.src="index.php?extern=apps/eyeCalc/img/5_x.png";if(IEversion!=0){fixPNG(but_number_5.id);}};
	but_number_5.onmouseout = function() {but_number_5.src="index.php?extern=apps/eyeCalc/img/5.png";if(IEversion!=0){fixPNG(but_number_5.id);}};
	but_number_6.onclick = function() {addValue(6);};
	but_number_6.onmouseover = function() {but_number_6.src="index.php?extern=apps/eyeCalc/img/6_x.png";if(IEversion!=0){fixPNG(but_number_6.id);}};
	but_number_6.onmouseout = function() {but_number_6.src="index.php?extern=apps/eyeCalc/img/6.png";if(IEversion!=0){fixPNG(but_number_6.id);}};
	but_number_7.onclick = function() {addValue(7);};
	but_number_7.onmouseover = function() {but_number_7.src="index.php?extern=apps/eyeCalc/img/7_x.png";if(IEversion!=0){fixPNG(but_number_7.id);}};
	but_number_7.onmouseout = function() {but_number_7.src="index.php?extern=apps/eyeCalc/img/7.png";if(IEversion!=0){fixPNG(but_number_7.id);}};
	but_number_8.onclick = function() {addValue(8);};
	but_number_8.onmouseover = function() {but_number_8.src="index.php?extern=apps/eyeCalc/img/8_x.png";if(IEversion!=0){fixPNG(but_number_8.id);}};
	but_number_8.onmouseout = function() {but_number_8.src="index.php?extern=apps/eyeCalc/img/8.png";if(IEversion!=0){fixPNG(but_number_8.id);}};
	but_number_9.onclick = function() {addValue(9);};
	but_number_9.onmouseover = function() {but_number_9.src="index.php?extern=apps/eyeCalc/img/9_x.png";if(IEversion!=0){fixPNG(but_number_9.id);}};
	but_number_9.onmouseout = function() {but_number_9.src="index.php?extern=apps/eyeCalc/img/9.png";if(IEversion!=0){fixPNG(but_number_9.id);}};
	but_number_0.onclick = function() {addValue(0);};
	but_number_0.onmouseover = function() {but_number_0.src="index.php?extern=apps/eyeCalc/img/0_x.png";if(IEversion!=0){fixPNG(but_number_0.id);}};
	but_number_0.onmouseout = function() {but_number_0.src="index.php?extern=apps/eyeCalc/img/0.png";if(IEversion!=0){fixPNG(but_number_0.id);}};
	
	but_op_divide.onclick = function() {startCalc("divide");};
	but_op_divide.onmouseover = function() {but_op_divide.src="index.php?extern=apps/eyeCalc/img/divide_x.png";if(IEversion!=0){fixPNG(but_op_divide.id);}};
	but_op_divide.onmouseout = function() {but_op_divide.src="index.php?extern=apps/eyeCalc/img/divide.png";if(IEversion!=0){fixPNG(but_op_divide.id);}};
	but_op_multiply.onclick = function() {startCalc("multiply");};
	but_op_multiply.onmouseover = function() {but_op_multiply.src="index.php?extern=apps/eyeCalc/img/multiply_x.png";if(IEversion!=0){fixPNG(but_op_multiply.id);}};
	but_op_multiply.onmouseout = function() {but_op_multiply.src="index.php?extern=apps/eyeCalc/img/multiply.png";if(IEversion!=0){fixPNG(but_op_multiply.id);}};
	but_op_substract.onclick = function() {startCalc("substract");};
	but_op_substract.onmouseover = function() {but_op_substract.src="index.php?extern=apps/eyeCalc/img/substract_x.png";if(IEversion!=0){fixPNG(but_op_substract.id);}};
	but_op_substract.onmouseout = function() {but_op_substract.src="index.php?extern=apps/eyeCalc/img/substract.png";if(IEversion!=0){fixPNG(but_op_substract.id);}};
	but_op_add.onclick = function() {startCalc("add");};
	but_op_add.onmouseover = function() {but_op_add.src="index.php?extern=apps/eyeCalc/img/add_x.png";if(IEversion!=0){fixPNG(but_op_add.id);}};
	but_op_add.onmouseout = function() {but_op_add.src="index.php?extern=apps/eyeCalc/img/add.png";if(IEversion!=0){fixPNG(but_op_add.id);}};
	
	but_symbol_dot.onclick = function() {addDot();};
	but_symbol_dot.onmouseover = function() {but_symbol_dot.src="index.php?extern=apps/eyeCalc/img/dot_x.png";if(IEversion!=0){fixPNG(but_symbol_dot.id);}};
	but_symbol_dot.onmouseout = function() {but_symbol_dot.src="index.php?extern=apps/eyeCalc/img/dot.png";if(IEversion!=0){fixPNG(but_symbol_dot.id);}};
	but_symbol_equal.onclick = function() {showResult();};
	but_symbol_equal.onmouseover = function() {but_symbol_equal.src="index.php?extern=apps/eyeCalc/img/equal_x.png";if(IEversion!=0){fixPNG(but_symbol_equal.id);}};
	but_symbol_equal.onmouseout = function() {but_symbol_equal.src="index.php?extern=apps/eyeCalc/img/equal.png";if(IEversion!=0){fixPNG(but_symbol_equal.id);}};
	
	
	but_exit.onclick = function() {sendMsg(checknum,'Close','');};
	but_exit.onmouseover = function() {but_exit.src="index.php?extern=apps/eyeCalc/img/close_x.png";if(IEversion!=0){fixPNG(but_exit.id);}};
	but_exit.onmouseout = function() {but_exit.src="index.php?extern=apps/eyeCalc/img/close.png";if(IEversion!=0){fixPNG(but_exit.id);}};
	
	
	but_clear.onclick = function() {clearScreen();};
	but_clear.onmouseover = function() {but_clear.src="index.php?extern=apps/eyeCalc/img/c_x.png";if(IEversion!=0){fixPNG(but_clear.id);}};
	but_clear.onmouseout = function() {but_clear.src="index.php?extern=apps/eyeCalc/img/c.png";if(IEversion!=0){fixPNG(but_clear.id);}};
	
	//Calculator Functions
	function showResult() {
		var result;
		if (mem && current_op && display.value != "") {
			switch (current_op) {
				case "divide":
					result = mem / parseFloat(display.value);
				break
				case "multiply":
					result = mem * parseFloat(display.value);
				break
				case "substract":
					result = mem - parseFloat(display.value);
				break
				case "add":
					result = mem + parseFloat(display.value);
				break
			}
			display.value = result;
			result = "";
			mem = "";
			current_op = "";
			dotted = 0;
		}
	}
	
	function startCalc(op) {
		if (display.value != "")
		{
			current_op = op;
			switch(op) {
				case "divide":
					if (mem) {
						mem = mem / parseFloat(display.value);
					}else{
						mem = parseFloat(display.value);
					}
				break
				case "multiply":
					if (mem) {
						mem = mem * parseFloat(display.value);
					}else{
						mem = parseFloat(display.value);
					}
				break
				case "substract":
					if (mem) {
						mem = mem - parseFloat(display.value);
					}else{
						mem = parseFloat(display.value);
					}
				break
				case "add":
					if (mem) {
						mem = mem + parseFloat(display.value);
					}else{
						mem = parseFloat(display.value);
					}
				break
			}
			display.value = "";
			dotted = 0;
		}
	}
	function addValue(val) {
		display.value = display.value+val;
	}
	
	function addDot() {
		if (display.value != "" && dotted == 0)
		{
			display.value += ".";
			dotted = 1;
		}
	}
	
	function clearScreen() {
		display.value = "";
		dotted = "";
		mem = "";
		result = "";
	}

}

