/*
var props = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
	prop,
	el = document.createElement('div');

for(var i = 0, l = props.length; i < l; i++) {
	if(typeof el.style[props[i]] !== "undefined") {
		prop = props[i];
		break;
	}
}
*/
function horloge() {
	var angle = 360/60,
		date = new Date(),
		hour = (function() {
			var h = date.getHours();
			if(h > 12) {
				h -= 12;
			}
			return h
		})(),
		minute = date.getMinutes(),
		second = date.getSeconds(),
		hourAngle = (360/12) * hour + (360/(12*60)) * minute;
		
			document.getElementById('trotteuse').style['transform'] = 'rotate('+angle * second+'deg)';
			document.getElementById('minute').style['transform'] = 'rotate(' + angle * ( minute + second/60 ) + 'deg)';
			document.getElementById('heure').style['transform'] = 'rotate(' + (360/12) * ( hour + minute/60 ) + 'deg)';

		setTimeout("horloge()", 500)
}

