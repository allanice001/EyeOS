/*
*                 eyeos - The Open Source Cloud's Web Desktop
*                               Version 2.0
*                   Copyright (C) 2007 - 2010 eyeos Team 
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License
* version 3 along with this program in the file "LICENSE".  If not, see 
* <http://www.gnu.org/licenses/agpl-3.0.txt>.
* 
* See www.eyeos.org for more details. All requests should be sent to licensing@eyeos.org
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* eyeos" logo and retain the original copyright notice. If the display of the 
* logo is not reasonably feasible for technical reasons, the Appropriate Legal Notices
* must display the words "Powered by eyeos" and retain the original copyright notice. 
*/

MathProcessor = function(table) {
    var o = this;
	o.table = table;
	o.tableModel = table.getTableModel();
    o.o = {
        "+": function(a, b){return a + b;},
        "-": function(a, b){return a - b;},
        "%": function(a, b){return a % b;},
        "/": function(a, b){return a / b;},
        "*": function(a, b){return a * b;},
        "^": function(a, b){return Math.pow(a, b);},
        "~": function(a, b){return Math.sqrt(a, b);}
    };
    o.s = {"^": 3, "~": 3, "*": 2, "/": 2, "%": 1, "+": 0, "-": 0};
    o.u = {"+": 1, "-": -1}, o.p = {"(": 1, ")": -1};

};
with({p: MathProcessor.prototype}){
    p.methods = {
        div: function(a, b){return parseInt(a / b);},
        fra: function(a){return a - parseInt(a);},
		PROD: function (a) {
			var result = new Number();
			var tempsArgs = this.splitArgs(arguments);
			for (var i = 0; i < tempsArgs.length; ++i) {
				if (!isNaN(tempsArgs[i])) {
					result *= parseFloat(tempsArgs[i]);
				} else {
					var tempValue = this.tableModel.getAlphaValue(tempsArgs[i]);
					result *= parseFloat(tempValue);
				}
			}
			return result;
		},
		SUM: function (a) {
			var result = new Number();
			var tempsArgs = this.splitArgs(arguments);
			for (var i = 0; i < tempsArgs.length; ++i) {
				if (!isNaN(tempsArgs[i])) {
					result += tempsArgs[i];
				} else {
					//console.log(tempsArgs[i]);
					var tempValue = this.tableModel.getAlphaValue(tempsArgs[i]);
					result += tempValue;
				}
			}
			return result;
		},
		AVG: function (a) {
			var result = new Number();
			var arguments = this.splitArgs(arguments);
			for (var i = 0; i < arguments.length; ++i) {
				if (!isNaN(arguments[i])) {
					result += arguments[i];
				} else {
					var tempValue = this.tableModel.getAlphaValue(arguments[i]);
					result += tempValue;
				}
			}
			var defResult = result / arguments.length;
			return defResult;
		},
		MAX: function (a) {
			var result = new Number();
			var tempResult = new Array();
			var arguments = this.splitArgs(arguments);
			for (var i = 0; i < arguments.length; ++i) {
				var tempValue;
				if (!isNaN(arguments[i])) {
					tempValue = arguments[i];
				} else {
					tempValue = this.tableModel.getAlphaValue(arguments[i]);
				}
				tempResult.push(parseFloat(tempValue));
			}
			return Math.max.apply(Math, tempResult);
		},
		MIN: function (a) {
			var result = new Number();
			var tempResult = new Array();
			var arguments = this.splitArgs(arguments);
			for (var i = 0; i < arguments.length; ++i) {
				var tempValue;
				if (!isNaN(arguments[i])) {
					tempValue = arguments[i];
				} else {
					tempValue = this.tableModel.getAlphaValue(arguments[i]);
				}
				tempResult.push(parseFloat(tempValue));
			}
			return Math.min.apply(Math, tempResult);
		},
        medium: function(n1, n2, n3, n){for(var r = 0, a, l = (a = arguments).length; l; r += a[--l]);return r / a.length;},
		sqrt: function (a) {return Math.sqrt(a);}
    };

    p.parse = function(e){
		if(e.match(/^[A-Za-z][0-9]+$/) || e.match(/^[A-Za-z][0-9]+\:[A-Za-z][0-9]+$/)) {
			return e;
		}
        for(var n, x, _ = this, o = [], s = [x = _.RPN(e.replace(/ /g, "").split(""))]; s.length;)
            for((n = s[s.length-1], --s.length); n[2]; o[o.length] = n, s[s.length] = n[3], n = n[2]);
        for(; (n = o.pop()) != undefined; n[0] = _.o[n[0]](isNaN_c(n[2][0]) ? _.f(n[2][0]) : n[2][0], isNaN_c(n[3][0]) ? _.f(n[3][0]) : n[3][0]));
		return x[0];
    };

	p.splitArgs = function (e) {
		var args = new Array();
		for (var i = 0; i < e.length; ++i) {
			if (isNaN(e[i])) {
				if (this.splitRanges(e[i]) != null) {
					var tempArray = this.splitRanges(e[i]);
					args = args.concat(tempArray);
				} else {
					args.push(e[i]);
				}
			} else {
				args.push(parseFloat(e[i]));
			}
		}
		return args;
	};

	p.splitRanges = function (e) {
		var splitted = e.split(":");
		if (splitted.length == "2") {
			//console.log('entro aqui');
			var firstCol = this.tableModel._letters.indexOf(splitted[0].split("")[0]);
			var lastCol = this.tableModel._letters.indexOf(splitted[1].split("")[0]);
			var firstRow = parseInt(splitted[0].substr(1));
			var lastRow = parseInt(splitted[1].substr(1));
			var toReturn = new Array();
			for (var i = firstCol; i <= lastCol; ++i) {
				var itemLetter = this.tableModel._letters[i];
				for (var f = firstRow; f <= lastRow; ++f) {
					toReturn.push(itemLetter + f);
				}
			}
			//console.log('return ranges with value')
			return toReturn;
		} else {
			//console.log('return ranges with no value')
			return null;
		}
	};
	
    p.RPN = function(e){
        var x, r, _ = this, c = r = [, , , 0];
        if(e[0] in _.u || !e.unshift("+"))
            for(; e[1] in _.u; e[0] = _.u[e.shift()] * _.u[e[0]] + 1 ? "+" : "-");
        (c[3] = [_.u[e.shift()], c, , 0])[1][0] = "*", (r = [, , c, 0])[2][1] = r;
        (c[2] = _.v(e))[1] = c;
        (!e.length && (r = c)) || (e[0] in _.s && ((c = r)[0] = e.shift(), !e.length && _.error()));
        while(e.length){
            if(e[0] in _.u){
                for(; e[1] in _.u; e[0] = _.u[e.shift()] * _.u[e[0]] + 1 ? "+" : "-");
                (c = c[3] = ["*", c, , 0])[2] = [-1, c, , 0];
            }
            (c[3] = _.v(e))[1] = c;
            e[0] in _.s && (c = _.s[e[0]] > _.s[c[0]] ?
                ((c[3] = (x = c[3], c[2]))[1][2] = [e.shift(), c, x, 0])[2][1] = c[2]
                : r == c ? (r = [e.shift(), , c, 0])[2][1] = r
                : ((r[2] = (x = r[2], [e.shift(), r, ,0]))[2] = x)[1] = r[2]);
        }
        return r;
    };
    p.v = function(e){
        var i, j, l, m, _ = this;
		//by joca, the pro
		if((m = e[0].match(/[A-Za-z]/))) {
			if("0123456789.".indexOf(e[1]) + 1){
				for(i = 0, l = e.length; ++i < l && "0123456789.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ:".indexOf(e[i]) + 1;);
				return [e.splice(0,i).join("")];
			}
		}

        if("0123456789.".indexOf(e[0]) + 1){
            for(i = -1, l = e.length; ++i < l && "0123456789.".indexOf(e[i]) + 1;);
            return [+e.splice(0,i).join(""), , , 0];
        }
        else if(e[0] == "("){
            for(i = 0, l = e.length, j = 1; ++i < l && (e[i] in _.p && (j += _.p[e[i]]), j););
            return _.RPN(l = e.splice(0,i), l.shift(), !j && e.shift());
        }
        else{
            if(((j = e[0].toLowerCase()) >= "a" && j <= "z") || j == "_"){
                for(i = 0; ((j = e[++i].toLowerCase()) >= "a" && j <= "z") || j == "_" || (j >= 0 && j <= 9););
                if(j == "("){
                    for(var l = e.length, j = 1; ++i < l && (e[i] in _.p && (j += _.p[e[i]]), j););
                    return [e.splice(0,i+1).join(""), , , 0];
                }
            }
        }
        _.error();
    };
    p.f = function(e){
        var n, i = 0;
        if( ( (e = e.split(""))[i] >= "a" && e[i] <= "z" ) || (e[i] >= "A" && e[i] <= "Z") || e[i] == "_" ) {
			//comprueba si la cadena empieza con a, z o _
			//incremente e, que es un array con toda la cadena separada por caracteres
			//hasta que lo encuentra sea diferente de a-z0-9_
            while((e[++i] >= "a" && e[i] <= "z") || (e[i] >= "A" && e[i] <= "Z") || e[i] == "_" || (e[i] >= 0 && e[i] <= 9));
			//si lo que encuentra es un paretensis, entra aqui
            if(e[i] == "(") {
				//junta todo en "n", y comprueba que "n" esté dentro de methods, si está, hacemos shift, sino, error
				//el shift parece que sea para borrar el ) que cierra
                !this.methods[n = e.splice(0, i).join("").toUpperCase()] && this.error("Função \"" + n + "\" não encontrada"), e.shift();
				//a es un array que empieza vacio, i empieza en -1 y j empieza en 1.
				//gira mientras e[++i] exista y e[i] esté dentor de this.p (this.p?) y ademas, luego el tio incrementa j con el contenido
				//de this.p[e[i]] 
                for(var a = [], i = -1, j = 1; e[++i] && (e[i] in this.p && (j += this.p[e[i]]), j);) {
                    j == 1 && (e[i] == "," || e[i] == ";") && (a.push(this.parse(e.splice(0, i).join(""))), e.shift(), i = -1);
				}
				var part = e.splice(0,i).join("");
				a.push(this.parse(part)), !j && e.shift();
			}
            return this.methods[n].apply(this, a);
        }
    };
    p.error = function(s){
        throw new Error("MathProcessor: " + (s || "Erro na expressão"));
    };
}

function isNaN_c(x) {
	if(isNaN(x)) {
		if(x.match(/^[A-Za-z][0-9]+$/) || x.match(/^[A-Za-z][0-9]+\:[A-Za-z][0-9]+$/)) {
			return false;
		}
		return true;
	}
	return false;
}
