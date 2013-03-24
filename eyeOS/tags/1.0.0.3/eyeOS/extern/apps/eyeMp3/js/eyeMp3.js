//Load sounds
function eyeMp3_loadSound(myPid,path){
	document.getElementById(myPid+"_flashPlayer").SetVariable("jsValue",path);
    document.getElementById(myPid+"_flashPlayer").SetVariable("jsMethod","newfile");
}
