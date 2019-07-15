var env1,setupData,speed=1;
var timetable={
	"normal":0,
	"library":0
};

function preload(){
	setupData=loadJSON("system_config.json");
}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	frameRate(30);
	strokeWeight(1);
	env1=new environment();
	env1.setting(setupData);
	camera(0,0,500,0,0,0,0,1,0);
}

function draw() {
	background(255);
	env1.show();
	env1.update(speed);
}
/*
function keyPressed(){
	if(key==='a' && speed!=1) speed=speed/2;
	if(key==='s') speed=speed*2;
}
*/