// xEnableDrop r3, Copyright 2006-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xEnableDrop(id, f)
{
  var e = xGetElementById(id);
  if (e) {
    e.xDropEnabled = true;
    xEnableDrag.drops[xEnableDrag.drops.length] = {e:e, f:f};
  }
}

xEnableDrag.drop = function (el, ev) // static method
{
  var i, hz = 0, d = null, da = xEnableDrag.drops;
  for (i = 0; i < da.length; ++i) {
    if (da[i] && xHasPoint(da[i].e, ev.pageX, ev.pageY)) {
      var z = getZindex(da[i].e);
      if (z >= hz) {
        hz = z;
        if (!da[i].e.xDropEnabled) {
          d = null;
        } else {
          d = da[i];
        }
      }
    }
  }
  if (d) {
    d.f(d.e, el, ev.pageX, ev.pageY); // drop event
  }
}

function getZindex(e) {
	var z = 0;
	while (e) {
		if (e.style && parseInt(e.style.zIndex)) z += parseInt(e.style.zIndex);
		e = e.parentNode ? e.parentNode : null;
	}
	return z;
}
