var eyeCatch = {
	Holes : new Array(),
	Enemies : new Array(),
	Infos : new Array(),

	AddHole : function (id,className,message,left,top,width,height) {
		var holeDiv = document.createElement('div');
		holeDiv.className = className;
		holeDiv.id = id + '_hole' + eyeCatch.Holes[id].length;
		holeDiv.style.left = left + 'px';
		holeDiv.style.top = top + 'px';
		holeDiv.style.width = width + 'px';
		holeDiv.style.height = height + 'px';
		document.getElementById(id + '_holes').appendChild(holeDiv);
		var holeArray = new Array();
		holeArray['id'] = id + '_hole' + eyeCatch.Holes[id].length;
		holeArray['message'] = message;
		eyeCatch.Holes[id].push(holeArray);
	},

	AddEnemy : function (id,className,message,left,top,width,height,movex,movey) {
		var enemyDiv = document.createElement('div');
		enemyDiv.className = className;
		enemyDiv.id = id + '_enemy' + eyeCatch.Enemies[id].length;
		enemyDiv.style.left = left + 'px';
		enemyDiv.style.top = top + 'px';
		enemyDiv.style.width = width + 'px';
		enemyDiv.style.height = height + 'px';
		document.getElementById(id + '_field').appendChild(enemyDiv);
		var enemyArray = new Array();
		enemyArray['id'] = id + '_enemy' + eyeCatch.Enemies[id].length;
		enemyArray['message'] = message;
		enemyArray['movex'] = movex;
		enemyArray['movey'] = movey;
		eyeCatch.Enemies[id].push(enemyArray);
	},

	CreateField : function (id,father,messageBox,className,speed,left,top,width,height) {
		eyeCatch.Holes[id] = new Array();
		eyeCatch.Enemies[id] = new Array();
		eyeCatch.Infos[id] = new Array();
		eyeCatch.Infos[id]['messageBox'] = messageBox;
		eyeCatch.Infos[id]['round'] = 0;
		eyeCatch.Infos[id]['speed'] = new Array();
		eyeCatch.Infos[id]['speed']['current'] = 0;
		eyeCatch.Infos[id]['speed']['increase'] = eval(speed);
		eyeCatch.Infos[id]['starttime'] = 0;

		var fieldDiv = document.createElement('div');
		fieldDiv.className = className;
		fieldDiv.id = id + '_field';
		fieldDiv.style.left = left + 'px';
		fieldDiv.style.top = top + 'px';
		fieldDiv.style.width = width + 'px';
		fieldDiv.style.height = height + 'px';
		document.getElementById(father).appendChild(fieldDiv);

		var holesDiv = document.createElement('div');
		holesDiv.id = id + '_holes';
		document.getElementById(id + '_field').appendChild(holesDiv);
	},

	CreatePlayer : function (id,className,left,top,width,height) {
		eyeCatch.Infos[id]['left'] = left;
		eyeCatch.Infos[id]['top'] = top;
		eyeCatch.Infos[id]['width'] = width;
		eyeCatch.Infos[id]['height'] = height;

		var playerDiv = document.createElement('div');
		playerDiv.className = className;
		playerDiv.id = id + '_player';
		playerDiv.style.left = left + 'px';
		playerDiv.style.top = top + 'px';
		playerDiv.style.width = width + 'px';
		playerDiv.style.height = height + 'px';
		document.getElementById(id + '_field').appendChild(playerDiv);

		xEnableDrag(id + '_player',function () { eyeCatch.Start(id); },function (e,left,top) { eyeCatch.OnDrag(id,left,top); });
	},

	HasPoint: function (e1,e2x,e2y,e2w,e2h) {
		var e1x = xLeft(e1);
		var e1y = xTop(e1);
		var e1w = xWidth(e1);
		var e1h = xHeight(e1);

		if (e2x >= e1x && e2x <= e1x + e1w && e2y >= e1y && e2y <= e1y + e1h) {
			return true;
		} else if (e2x >= e1x && e2x <= e1x + e1w && e2y + e2h >= e1y && e2y + e2h <= e1y + e1h) {
			return true;
		} else if (e2x + e2w >= e1x && e2x + e2w <= e1x + e1w && e2y >= e1y && e2y <= e1y + e1h) {
			return true;
		} else if (e2x + e2w >= e1x && e2x + e2w <= e1x + e1w && e2y + e2h >= e1y && e2y + e2h <= e1y + e1h) {
			return true;
		}
		return false;
	},

	MoveEnemies : function (id,start) {
		if (eyeCatch.Infos[id]['round'] || start) {
			for (var enemy = eyeCatch.Enemies[id].length - 1; enemy > -1; enemy--) {
				eyeCatch.MoveEnemy(id,enemy);
			}
			if (eyeCatch.Infos[id]['speed']['increase'][eyeCatch.Infos[id]['round']]) {
				speed = Number(eyeCatch.Infos[id]['speed']['increase'][eyeCatch.Infos[id]['round']][0]);
				eyeCatch.Infos[id]['speed']['current'] = speed;
			} else {
				speed = eyeCatch.Infos[id]['speed']['current'];
			}
			eyeCatch.Infos[id]['round']++;

			var player = document.getElementById(id + '_player');
			if (player) {
				for (var enemy = eyeCatch.Enemies[id].length - 1; enemy > -1; enemy--) {
					if (eyeCatch.HasPoint(eyeCatch.Enemies[id][enemy]['id'],eyeCatch.Infos[id]['left'],eyeCatch.Infos[id]['top'],eyeCatch.Infos[id]['width'],eyeCatch.Infos[id]['height'])) {
						xDisableDrag(player);
						player.parentNode.removeChild(player);
						document.getElementById(eyeCatch.Infos[id]['messageBox']).innerHTML = eyeCatch.Enemies[id][enemy]['message'].replace(/%s/g,((new Date).getTime() - eyeCatch.Infos[id]['starttime']) / 1000);
					}
				}
			}
			setTimeout(function () { eyeCatch.MoveEnemies(id,0); },speed);
		}
	},

	MoveEnemy : function (id,enemy) {
		var element = document.getElementById(eyeCatch.Enemies[id][enemy]['id']);
		if (element) {
			var left = xLeft(element);
			var top = xTop(element);
			var width = xWidth(element);
			var height = xHeight(element);
			if (left >= xWidth(id + '_field') - width || left <= 0) {
				eyeCatch.Enemies[id][enemy]['movex'] *= -1;
			}
			if (top >= xHeight(id + '_field') - height || top <= 0) {
				eyeCatch.Enemies[id][enemy]['movey'] *= -1;
			}
			element.style.left = (eyeCatch.Enemies[id][enemy]['movex'] + left) + 'px';
			element.style.top = (eyeCatch.Enemies[id][enemy]['movey'] + top) + 'px';
		}
	},

	OnDrag : function (id,left,top) {
		var player = document.getElementById(id + '_player');
		if (player) {
			eyeCatch.Infos[id]['left'] += left;
			eyeCatch.Infos[id]['top'] += top;

			if (eyeCatch.Infos[id]['left'] < 0) {
				eyeCatch.Infos[id]['left'] = 0;
			}
			var width = xWidth(id + '_field') - eyeCatch.Infos[id]['width'];
			if (eyeCatch.Infos[id]['left'] > width) {
				eyeCatch.Infos[id]['left'] = width;
			}
			if (eyeCatch.Infos[id]['top'] < 0) {
				eyeCatch.Infos[id]['top'] = 0;
			}
			var height = xHeight(id + '_field') - eyeCatch.Infos[id]['height'];
			if (eyeCatch.Infos[id]['top'] > height) {
				eyeCatch.Infos[id]['top'] = height;
			}

			player.style.left = eyeCatch.Infos[id]['left'] + 'px';
			player.style.top = eyeCatch.Infos[id]['top'] + 'px';

			for (var hole = eyeCatch.Holes[id].length - 1; hole > -1; hole--) {
				if (eyeCatch.HasPoint(eyeCatch.Holes[id][hole]['id'],eyeCatch.Infos[id]['left'],eyeCatch.Infos[id]['top'],eyeCatch.Infos[id]['width'],eyeCatch.Infos[id]['height'])) {
					xDisableDrag(player);
					player.parentNode.removeChild(player);
					document.getElementById(eyeCatch.Infos[id]['messageBox']).innerHTML = eyeCatch.Holes[id][hole]['message'].replace(/%s/g,((new Date).getTime() - eyeCatch.Infos[id]['starttime']) / 1000);
				}
			}
		}
	},

	Remove : function (id) {
		eyeCatch.Holes[id] = new Array();
		eyeCatch.Enemies[id] = new Array();
		eyeCatch.Infos[id] = new Array();

		var e = document.getElementById(id + '_field');
		if (e) {
			e.parentNode.removeChild(e);
		}
	},

	Start : function (id) {
		if (!eyeCatch.Infos[id]['round']) {
			eyeCatch.Infos[id]['starttime'] = (new Date()).getTime();
			eyeCatch.MoveEnemies(id,1);
		}
	}
}