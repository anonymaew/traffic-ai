var envi=[],setupData,speed=1,sh=0,si=100;

function preload(){
	setupData=loadJSON("system_config.json");
}

function setup() {
	createCanvas(480, 360, WEBGL);
	frameRate(30);
	strokeWeight(1);
	for(var i=0;i<si;i++){
		var ienv=new environment();
		ienv.setting(setupData)
		envi.push(ienv);
	}
	camera(0,0,200,0,0,0,0,1,0);
}

function draw(){
	background(255);
	for(var i=0;i<si;i++){
		if(sh==i) envi[i].show();
		envi[i].update(speed);
	}
}

function keyPressed(){
	if(key=='a' && speed!=1) speed/=2;
	if(key=='s') speed*=2;
}