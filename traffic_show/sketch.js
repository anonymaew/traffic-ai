var envi,setupData,speed=1,sh=0,si=100,envshow,gen=0,showOption=true,resultFile,b;

function preload(){
	setupData=loadJSON("system_config.json");
	resultFile=loadJSON("neural.json");
}

function setup() {
	createCanvas(480, 360, WEBGL);
	frameRate(30);
	strokeWeight(1);
	envi=new environment();
	envi.setting(setupData);
	b=new neuralnetwork([]);
	b.import(resultFile.brain);
	envi.brain=b;
	camera(0,0,800,0,0,0,0,1,0);
}

function draw(){
	background(255);
	for(var i=0;i<speed;i++){
		envi.update(4);
		var resultString=envi.steptime.toString();
		for(let ilane of envi.lanelist) resultString=resultString.concat(",",(ilane.countlist[2].number*10/(envi.steptime )).toString(),",",(ilane.countlist[0].number*10/(envi.steptime )).toString(),",");
		for(let ilight of envi.lightlist) resultString=resultString.concat((ilight.status=="red") ? "R" : "G",",");
		console.log(resultString);
	}
	envi.show();
}