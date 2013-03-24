// xPageX r2, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xPageX(e)
{
  var x = 0;
  e = xGetElementById(e);
  while (e) {
    if (xDef(e.offsetLeft)) x += e.offsetLeft;
    try{
      e = xDef(e.offsetParent) ? e.offsetParent : null;
    } catch(err) {
      e = null;
    }
  }
  return x;
}
