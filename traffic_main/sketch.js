var env1,setupData,speed=1;

function preload(){
	setupData=loadJSON("system_config.json");
}

function setup() {
	createCanvas(480, 360, WEBGL);
	frameRate(30);
	strokeWeight(1);
	env1=new environment();
	env1.setting(setupData);
	camera(0,0,200,0,0,0,0,1,0);
}

function draw() {
	background(255);
	env1.show();
	env1.update(speed);
}