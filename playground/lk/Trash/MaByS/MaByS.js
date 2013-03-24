var MaByS = {
	DotLetter : '.',
	NumLength : -12,
	
	// Main functions
	
	Add : function(one,two) {
		return MaByS.Intern.Output(MaByS.Intern.Add(MaByS.Intern.Input(one),MaByS.Intern.Input(two)));
	},
	
	Divide : function(one,two) {
		return MaByS.Intern.Output(MaByS.Intern.Divide(MaByS.Intern.Input(one),MaByS.Intern.Input(two)));
	},
	
	Multiply : function(one,two) {
		return MaByS.Intern.Output(MaByS.Intern.Multiply(MaByS.Intern.Input(one),MaByS.Intern.Input(two)));
	},
	
	Subtract : function(one,two) {
		return MaByS.Add(one,'-' + String(two));
	},
	
	// Intern functions
	
	Intern : {
		E : '2.71828182845904523536028747135266249775724709369995',
		LN2 : '0.69314718055994530941723212145817656807550013436026',
		LN10 : '2.30258509299404568401799145468436420760110148862877',
		LOG2E : '1.44269504088896340735992468100189213742664595415299',
		LOG10E : '0.43429448190325182765112891891660508229439700580367',
		PI : '3.14159265358979323846264338327950288419716939937510',
		SQRT1_2 : '0.70710678118654752440084436210484903928483593768847',
		SQRT2 : '1.41421356237309504880168872420969807856967187537694',
		
		Add : function(one,two) {
			var action = '+';
			var array = new Array();
			var exponent = 0;
			var n = 0;
			var output = '';
			var sign = '+';
			var temp = '';
			if (one.substr(0,1) != two.substr(0,1)) {
				action = '-';
				if (one.substr(0,1) == '-') {
					temp = one;
					one = two;
					two = temp;
				}
				if (MaByS.Compare(one.substr(1),two.substr(1)) == 2) {
					sign = '-';
					temp = one;
					one = two;
					two = temp;
				}
			} else if (one.substr(0,1) == '-') {
				sign = '-';
			}
			one = one.substr(1);
			two = two.substr(1);
			one = one.split('.');
			two = two.split('.');
			if (!one[1]) {
				one[1] = '';
			}
			if (!two[1]) {
				two[1] = '';
			}
			while (one[0].length - two[0].length < 0) {
				one[0] = '0' + one[0];
			}
			while (one[0].length - two[0].length > 0) {
				two[0] = '0' + two[0];
			}
			while (one[1].length - two[1].length < 0) {
				one[1] += '0';
			}
			while (one[1].length - two[1].length > 0) {
				two[1] += '0';
			}
			exponent = one[1].length;
			one = one[0] + one[1];
			two = two[0] + two[1];
			if (action == '+') {
				while (one.length) {
					n = Number(MaByS.Intern.Substr(one,-1)) + Number(MaByS.Intern.Substr(two,-1)) + n;
					output = MaByS.Intern.Substr(n,-1) + output;
					n = Number(MaByS.Intern.Substr(n,0,-1));
					one = MaByS.Intern.Substr(one,0,-1);
					two = MaByS.Intern.Substr(two,0,-1);
				}
				if (n) {
					output = String(n) + output;
				}
			} else {
				while (one.length) {
					n = Number(MaByS.Intern.Substr(two,-1)) + n;
					if (MaByS.Compare(MaByS.Intern.Substr(one,-1),n) == 2) {
						n = Number('1' + MaByS.Intern.Substr(one,-1)) - n;
						output = MaByS.Intern.Substr(n,-1) + output;
						n = 1;
					} else {
						n = Number(MaByS.Intern.Substr(one,-1)) - n;
						output = n + output;
						n = 0;
					}
					one = MaByS.Intern.Substr(one,0,-1);
					two = MaByS.Intern.Substr(two,0,-1);
				}
			}
			return sign + output + 'e-' + exponent;
		},
		
		Divide : function(one,two,three) {
			var n = 2;
			var temp = 0;
			var output = '+';
			if (two == '+0') {
				return false;
			}
			if (typeof three != 'number') {
				NumLength = Number(1.25 * MaByS.NumLength);
			}
			if (one.substr(0,1) != two.substr(0,1)) {
				output = '-';
			}
			one = one.substr(1);
			two = two.substr(1);
			while (MaByS.Compare('0',one) == 2 && (MaByS.Compare(n,NumLength) < 2 || MaByS.Compare('0',NumLength) == 2 && n == 2)) {
				temp = 1;
				while (MaByS.Compare(one,MaByS.Intern.Multiply('+' + String(temp),'+' + two)) < 2) {
					temp++;
				}
				temp--;
				one = MaByS.Intern.Input(MaByS.Multiply('10',MaByS.Intern.Add('+' + one,MaByS.Intern.Input('-' + MaByS.Multiply(temp,two)))));
				output += temp;
				if (n == 2) {
					output += '.';
					n--;
				}
				n--;
			}
			return output;
		},
		
		Factorial : function(one) {
			if (one > 0 && Math.floor(one) == one) {
				var output = 1;
				while (one > 0) {
					output *= one;
					one -= 1;
				}
				return output;
			} else {
				return MaByS.Intern.Gamma(one + 1);
			}
		},
		
		Gamma : function(one) { // from http://mathe-online.at/JavaCalc/jcintro.html
			if (one <= 0) {
				if (Math.floor(one) == one) {
					return false;
				} else {
					return parseFloat(MaByS.Intern.PI) / (Math.sin(parseFloat(MaByS.Intern.PI) * one) * Math.exp(loggamma(1 - one)));
				}
			} else {
				return Math.exp(loggamma(one));
			}
			
			function loggamma(x) {
				var v = 1;
				while (x < 8) {
					v *= x;
					x++;
				}
				var w = 1 / (x * x);
				return ((((((((- 3617 / 122400) * w + 7 / 1092) * w - 691 / 360360) * w + 5 / 5940) * w - 1 / 1680) * w + 1 / 1260) * w - 1 / 360) * w + 1 / 12) / x + 0.5 * Math.log(2 * parseFloat(MaByS.Intern.PI)) - Math.log(v) - x + (x - 0.5) * Math.log(x);
			}
		},
		
		Input : function(one,two) {
			var dot = 0;
			var eid = 0;
			var exponent = 0;
			var exponents = new Array();
			exponents[0] = '+';
			var letter = '';
			var output = '+';
			var zero = 1;
			one = String(one);
			if (typeof two == 'undefined' || two == '' || two == '.') {
				two = '.';
			} else {
				two = MaByS.DotLetter;
			}
			while (one.length) {
				letter = one.substr(0,1);
				one = one.substr(1);
				if (letter == '-' && output == '+') {
					output = '-';
				} else if (letter == '-' && output == '-') {
					output = '+';
				} else if (letter == '0' && !zero) {
					output += '0';
				} else if (letter == '1' || letter == '2' || letter == '3' || letter == '4' || letter == '5' || letter == '6' || letter == '7' || letter == '8' || letter == '9') {
					output += letter;
					zero = 0;
				} else if (letter == '.' || letter == MaByS.DotLetter) {
					dot = 1;
					if (zero) {
						output += '0';
						zero = 0;
					}
					output += two;
				} else if (letter == 'e' || letter == 'E') {
					if (zero) {
						return '+0';
					}
					while (one.length) {
						letter = one.substr(0,1);
						one = one.substr(1);
						if (letter == '-' && exponents[eid] == '+') {
							exponents[eid] = '-';
						} else if (letter == '-' && exponents[eid] == '-') {
							exponents[eid] = '+';
						} else if (letter == 'e') {
							eid++;
							exponents[eid] = '+';
						} else if (letter == '0' && exponents[eid] != '+' && exponents[eid] != '-' || letter == '1' || letter == '2' || letter == '3' || letter == '4' || letter == '5' || letter == '6' || letter == '7' || letter == '8' || letter == '9') {
							exponents[eid] += letter;
						} else if (letter == '.' || letter == MaByS.DotLetter) {
							one = '';
						}
					}
				}
			}
			if (zero) {
				return '+0';
			}
			while (dot && MaByS.Intern.Substr(output,-1) == '0') {
				output = MaByS.Intern.Substr(output,0,-1);
			}
			if (MaByS.Intern.Substr(output,-1) == two) {
				output = MaByS.Intern.Substr(output,0,-1);
			}
			while (eid >= 0) {
				if (exponents[eid] != '+' && exponents[eid] != '-') {
					exponent += Number(exponents[eid]);
				}
				eid--;
			}
			if (exponent) {
				output = output.split(two);
				letter = output[0].substr(0,1);
				output[0] = output[0].substr(1);
				if (typeof output[1] == 'undefined') {
					output[1] = '';
				}
				if (exponent < 0) {
					while (output[0].length < -exponent) {
						output[0] = '0' + output[0];
					}
					output[1] = MaByS.Intern.Substr(output[0],exponent) + output[1];
					output[0] = MaByS.Intern.Substr(output[0],0,exponent);
				} else if (exponent > 0) {
					while (output[1].length < exponent) {
						output[1] += '0';
					}
					output[0] += output[1].substr(0,exponent);
					output[1] = output[1].substr(exponent);
				}
				return MaByS.Intern.Input(letter + output[0] + two + output[1],two);
			}
			return output;
		},
		
		Multiply : function(one,two) {
			var dot = 0;
			var letter = '';
			var exponent = '0';
			var output = '0';
			var sign = '+';
			if (one.substr(0,1) != two.substr(0,1)) {
				sign = '-';
			}
			one = one.substr(1);
			two = two.substr(1);
			if (one.length == 1 || one == '10') {
				one = Number(one);
				while (one) {
					output = MaByS.Add(output,two);
					one--;
				}
			} else {
				while (one.length) {
					letter = one.substr(0,1);
					if (letter == '.' || letter == MaByS.DotLetter) {
						dot = 1;
					} else {
						if (dot) {
							exponent = MaByS.Add(exponent,'-1');
						}
						output = MaByS.Add(MaByS.Intern.Multiply('+10','+' + output),MaByS.Intern.Multiply('+' + letter,'+' + two));
					}
					one = one.substr(1);
				}
			}
			return sign + output + 'e' + exponent;
		},
		
		Output : function(one) {
			return MaByS.round(one,MaByS.NumLength);
		},
		
		Substr : function(one,two,three) {
			one = String(one);
			two = Number(two);
			if (two < 0) {
				two += one.length;
			}
			if (one.length < two || two < 0) {
				return false;
			}
			if (typeof three != 'undefined' && three != '') {
				three = Number(three);
				if (three < 0) {
					three += one.length;
				}
				if (one.length < three || three < 0 || two > three) {
					return false;
				}
				return one.substr(two,three);
			} else {
				return one.substr(two);
			}
		},
		
		ToFloat : function(one,two) {
			if (typeof one != 'number') {
				one = parseFloat(MaByS.Intern.Input(one,two));
			}
			return one;
		}
	},
	
	// New functions
	
	ChangeNumSystem : function(one,two,three) {
		var charsA = new Array();
		charsA['0'] = 0; charsA['1'] = 1; charsA['2'] = 2; charsA['3'] = 3; charsA['4'] = 4; charsA['5'] = 5; charsA['6'] = 6; charsA['7'] = 7; charsA['8'] = 8; charsA['9'] = 9; charsA['A'] = 10; charsA['B'] = 11; charsA['C'] = 12; charsA['D'] = 13; charsA['E'] = 14; charsA['F'] = 15; charsA['G'] = 16; charsA['H'] = 17; charsA['I'] = 18; charsA['J'] = 19; charsA['K'] = 20; charsA['L'] = 21; charsA['M'] = 22; charsA['N'] = 23; charsA['O'] = 24; charsA['P'] = 25; charsA['Q'] = 26; charsA['R'] = 27; charsA['S'] = 28; charsA['T'] = 29; charsA['U'] = 30; charsA['V'] = 31; charsA['W'] = 32; charsA['X'] = 33; charsA['Y'] = 34; charsA['Z'] = 35;
		var charsB = new Array();
		charsB['0'] = '0'; charsB['1'] = '1'; charsB['2'] = '2'; charsB['3'] = '3'; charsB['4'] = '4'; charsB['5'] = '5'; charsB['6'] = '6'; charsB['7'] = '7'; charsB['8'] = '8'; charsB['9'] = '9'; charsB['10'] = 'A'; charsB['11'] = 'B'; charsB['12'] = 'C'; charsB['13'] = 'D'; charsB['14'] = 'E'; charsB['15'] = 'F'; charsB['16'] = 'G'; charsB['17'] = 'H'; charsB['18'] = 'I'; charsB['19'] = 'J'; charsB['20'] = 'K'; charsB['21'] = 'L'; charsB['22'] = 'M'; charsB['23'] = 'N'; charsB['24'] = 'O'; charsB['25'] = 'P'; charsB['26'] = 'Q'; charsB['27'] = 'R'; charsB['28'] = 'S'; charsB['29'] = 'T'; charsB['30'] = 'U'; charsB['31'] = 'V'; charsB['32'] = 'W'; charsB['33'] = 'X'; charsB['34'] = 'Y'; charsB['35'] = 'Z';
		var charsRoman = new Array();
		charsRoman['N'] = 1000000; charsRoman['O'] = 500000; charsRoman['P'] = 100000; charsRoman['Q'] = 50000; charsRoman['R'] = 10000; charsRoman['S'] = 5000; charsRoman['M'] = 1000; charsRoman['D'] = 500; charsRoman['C'] = 100; charsRoman['L'] = 50; charsRoman['X'] = 10; charsRoman['V'] = 5; charsRoman['I'] = 1;
		var input = new Array(0,0);
		var last = '';
		var letter = '';
		var status = 0;
		var sign = '+';
		var output = new Array('','');
		var temp = 0;
		if (typeof two == 'undefined' || two == '' || two != 'roman' && (two < 2 || two == 10 || two > 36)) {
			input = MaByS.Intern.Input(one);
			if (input.substr(0,1) == '-') {
				sign = '-';
			}
			input = input.substr(1);
		} else {
			if (two == 'roman') {
				while (one.length && (one.substr(0,1) == '+' || one.substr(0,1) == '-')) {
					if (one.substr(0,1) == '-') {
						if (sign == '-') {
							sign = '+';
						} else {
							sign = '-';
						}
					}
					one = one.substr(1);
				}
			}
			one = String(one).toUpperCase().split(MaByS.DotLetter);
			while (temp < 2) {
				while (typeof one[temp] != 'undefined' && one[temp].length) {
					if (two == 'roman') {
						letter = MaByS.Intern.Substr(one[temp],-1);
						one[temp] = MaByS.Intern.Substr(one[temp],0,-1);
						if (typeof charsRoman[letter] != 'undefined') {
							if (status > charsRoman[letter]) {
								input[temp] -= charsRoman[letter];
							} else {
								input[temp] += charsRoman[letter];
								status = charsRoman[letter];
							}
						}
					} else {
						letter = one[temp].substr(0,1);
						one[temp] = one[temp].substr(1);
						if (typeof charsA[letter] != 'undefined') {
							input[temp] += charsA[letter] * Math.pow(two,status);
							status++;
						} else if (letter == '-' && !input[temp]) {
							if (sign == '-') {
								sign = '+';
							} else {
								sign = '-';
							}
						}
					}
				}
				temp++;
			}
			input = MaByS.Intern.Input(input[0] + '.' + input[1]).substr(1);
		}
		if (typeof three == 'undefined' || three == '' || three != 'roman' && (three < 2 || three == 10 || three > 36)) {
			return MaByS.Intern.Output(sign + input);
		}
		input = input.split('.');
		temp = 0;
		while (temp < 2) {
			if (three == 'roman') {
				for (letter in charsRoman) {
					status = '';
					while (charsRoman[letter] <= input[temp]) {
						input[temp] -= charsRoman[letter];
						status += letter;
					}
					if (last != '' && status.length == 4) {
						status = letter + last;
					} else if (status == '' && 0.8 * charsRoman[letter] < input[temp]) {
						status = MaByS.ChangeNumSystem(charsRoman[letter] - input[temp],10,'roman') + letter;
						input[temp] = 0;
					}
					last = letter;
					output[temp] += status;
				}
			} else {
				while (input[temp] > 0) {
					input[temp] = String(input[temp] / three).split('.');
					if (typeof input[temp][1] != 'undefined') {
						output[temp] = charsB[Math.round(three * ('0.' + input[temp][1]))] + output[temp];
					} else {
						output[temp] = '0' + output[temp];
					}
					input[temp] = input[temp][0];
				}
			}
			temp++;
		}
		if (sign == '-') {
			output[0] = '-' + output[0];
		}
		if (output[1]) {
			output[0] += MaByS.DotLetter + output[1];
		}
		return output[0];
	},
	
	Compare : function(one,two) {
		one = MaByS.Intern.ToFloat(one);
		two = MaByS.Intern.ToFloat(two);
		if (one > two) {
			return 1;
		}
		if (one < two) {
			return 2;
		}
		return 0;
	},
	
	Factorial : function(one) {
		return MaByS.Intern.Output(MaByS.Intern.Factorial(MaByS.Intern.ToFloat(one)));
	},
	
	Gamma : function(one) {
		return MaByS.Intern.Output(MaByS.Intern.Gamma(MaByS.Intern.ToFloat(one)));
	},
	
	ln : function(one) {
		return MaByS.Intern.Output(Math.log(MaByS.Intern.ToFloat(one)) / Math.log(parseFloat(MaByS.Intern.E)));
	},
	
	nCr : function(one,two) {
		one = MaByS.Intern.ToFloat(one);
		two = MaByS.Intern.ToFloat(two);
		return MaByS.round(MaByS.Intern.Factorial(one) / (MaByS.Intern.Factorial(two) * MaByS.Intern.Factorial(one - two)));
	},
	
	nPr : function(one,two) {
		one = MaByS.Intern.ToFloat(one);
		return MaByS.round(MaByS.Intern.Factorial(one) / MaByS.Intern.Factorial(one - MaByS.Intern.ToFloat(two)));
	},
	
	Root : function(one,two) {
		if (typeof two == 'undefined' || two == '') {
			return MaByS.pow(one,0.5);
		}
		return MaByS.pow(one,MaByS.Intern.Divide('+1',MaByS.Intern.Input(two)));
	},
	
	// Changed functions
	
	acos : function(one,two) {
		one = MaByS.Intern.ToFloat(one);
		if (typeof two == 'undefined' || two == '') {
			one = one / 180 * parseFloat(MaByS.Intern.PI);
		}
		return MaByS.Intern.Output(Math.acos(one));
	},
	
	asin : function(one,two) {
		one = MaByS.Intern.ToFloat(one);
		if (typeof two == 'undefined' || two == '') {
			one = one / 180 * parseFloat(MaByS.Intern.PI);
		}
		return MaByS.Intern.Output(Math.asin(one));
	},
	
	atan : function(one,two) {
		one = MaByS.Intern.ToFloat(one);
		if (typeof two == 'undefined' || two == '') {
			one = one / 180 * parseFloat(MaByS.Intern.PI);
		}
		return MaByS.Intern.Output(Math.atan(one));
	},
	
	cos : function(one,two) {
		one = MaByS.Intern.ToFloat(one);
		if (typeof two == 'undefined' || two == '') {
			one = one / 180 * parseFloat(MaByS.Intern.PI);
		}
		return MaByS.Intern.Output(Math.cos(one));
	},
	
	log : function(one,two) {
		if (typeof two == 'undefined' || two == '') {
			two = 10;
		}
		return MaByS.Divide(Math.log(MaByS.Intern.ToFloat(one)),Math.log(MaByS.Intern.ToFloat(two)));
	},
	
	sin : function(one,two) {
		one = MaByS.Intern.ToFloat(one);
		if (typeof two == 'undefined' || two == '') {
			one = one / 180 * parseFloat(MaByS.Intern.PI);
		}
		return MaByS.Intern.Output(Math.sin(one));
	},
	
	tan : function(one,two) {
		one = MaByS.Intern.ToFloat(one);
		if (typeof two == 'undefined' || two == '') {
			one = one / 180 * parseFloat(MaByS.Intern.PI);
		}
		return MaByS.Intern.Output(Math.tan(one));
	},
	
	// Aliases
	
	abs : function(one) {
		return MaByS.Intern.Input(one,1).substr(1);
	},
	
	exp : function(one) {
		return MaByS.Intern.Output(Math.exp(MaByS.Intern.ToFloat(one)));
	},
	
	ceil : function(one,two) {
		return MaByS.round(one,two,'+');
	},
	
	floor : function(one,two) {
		return MaByS.round(one,two,'-');
	},
	
	max : function(one,two) {
		if (MaByS.Intern.ToFloat(one) > MaByS.Intern.ToFloat(two)) {
			return MaByS.Intern.Output(one);
		}
		return MaByS.Intern.Output(two);
	},
	
	min : function(one,two) {
		if (MaByS.Intern.ToFloat(one) < MaByS.Intern.ToFloat(two)) {
			return MaByS.Intern.Output(one);
		}
		return MaByS.Intern.Output(two);
	},
	
	pow : function(one,two) {
		return MaByS.Intern.Output(Math.pow(MaByS.Intern.ToFloat(one),MaByS.Intern.ToFloat(two)));
	},
	
	random : function(one,two,three) {
		if (typeof one == 'undefined' || one == '') {
			one = 0;
		} else {
			one = MaByS.Intern.ToFloat(one);
		}
		if (typeof two == 'undefined' || two == '') {
			two = 9;
		} else {
			two = MaByS.Intern.ToFloat(two);
		}
		if (typeof three == 'undefined' || three == '') {
			three = 1;
		} else {
			three = MaByS.Intern.ToFloat(three);
		}
		return MaByS.Multiply(MaByS.Add(one,MaByS.round(Math.random() * (two / three - one))),three);
	},
	
	round : function(one,two,three) {
		if (!two) {
			two = '0';
		}
		if (!three) {
			three = '0';
		}
		one = MaByS.Intern.Input(one + 'e-' + two).split('.');
		var letter = one[0].substr(0,1);
		one[0] = one[0].substr(1);
		if (typeof one[1] == 'undefined' || one[1] == '') {
			one[1] = '0';
		}
		one[1] = one[1].substr(0,1);
		if (three == '+' || three != '-' && (one[1] == '5' || one[1] == '6' || one[1] == '7' || one[1] == '8' || one[1] == '9')) {
			one[0] = String(parseFloat(one[0]) + 1);
		}
		one = MaByS.Intern.Input(letter + one[0] + 'e' + two,1);
		if (one.substr(0,1) == '+') {
			return one.substr(1);
		}
		return one;
	},
	
	sqrt : function(one) {
		return MaByS.pow(one,0.5);
	},
	
	// Constants
	
	E : function() {
		return MaByS.Intern.Output(MaByS.Intern.E);
	},
	
	LN2 : function() {
		return MaByS.Intern.Output(MaByS.Intern.LN2);
	},
	
	LN10 : function() {
		return MaByS.Intern.Output(MaByS.Intern.LN10);
	},
	
	LOG2E : function() {
		return MaByS.Intern.Output(MaByS.Intern.LOG2E);
	},
	
	LOG10E : function() {
		return MaByS.Intern.Output(MaByS.Intern.LOG10E);
	},
	
	PI : function() {
		return MaByS.Intern.Output(MaByS.Intern.PI);
	},
	
	SQRT1_2 : function() {
		return MaByS.Intern.Output(MaByS.Intern.SQRT1_2);
	},
	
	SQRT2 : function() {
		return MaByS.Intern.Output(MaByS.Intern.SQRT2);
	}
}