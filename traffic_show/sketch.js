var envi,setupData,speed=10,sh=0,si=100,envshow,gen=0,showOption=true,resultFile,b;

function preload(){
	setupData=loadJSON("system_config.json");
	resultFile=loadJSON("neural.json");
}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	frameRate(30);
	strokeWeight(1);
	envi=new environment();
	envi.setting(setupData);
	b=new neuralnetwork([]);
	b.import(resultFile.brain);
	envi.brain=b;
	camera(0,0,300,0,0,0,0,1,0);
}

function draw(){
	background(255);
	for(var i=0;i<speed;i++){
		envi.update(1);
		//var resultString=envi.steptime.toString();
		//for(let ilane of envi.lanelist) resultString=resultString.concat(",",(ilane.countlist[2].number*10/(envi.steptime )).toString(),",",(ilane.countlist[0].number*10/(envi.steptime )).toString(),",");
		//for(let ilight of envi.lightlist) resultString=resultString.concat((ilight.status=="red") ? "R" : "G",",");
		//console.log(envi.scorenow());
		//var resultString=envi.steptime.toString().concat(",");
		//for(let ilane of envi.lanelist) resultString=resultString.concat(ilane.countlist[2].number.toString(),",",ilane.steptimegreen.toString(),",");
		//console.log(resultString);
	}
	envi.show();
}