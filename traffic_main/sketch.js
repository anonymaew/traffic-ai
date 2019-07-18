var envi=[],setupData,speed=1,sh=0,si=10;

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
	camera(0,0,800,0,0,0,0,1,0);
}

function draw(){
	background(255);
	var li=[]; li.push(envi[0].steptime);
	for(var i=0;i<si;i++){
		if(sh==i) envi[i].show();
		envi[i].update(speed);
		li.push(envi[i].scorenow());
	}
	if(envi[0].steptime>1800) breed();
}

function keyPressed(){
	if(key=='a' && speed!=1) speed/=2;
	if(key=='s') speed*=2;
}

function breed(){
	var li=[];
	for(let ie of envi) li.push(ie.scorenow());
	var lis=[];
	for(let i of li) lis.push(map(i,Math.min(...li),Math.max(...li),0,1));
	//for(var i=0;i<lis.length;i++) lis[i]*=lis[i];
	console.log(lis);
	var nenvi=[];
	for(var i=0;i<si;i++){
		var randnum=random();
		var min=9; var imin;
		for(var j=0;j<lis.length;j++){
			var num=lis[j];
			if(num-randnum>0) if(num-randnum<min){
				min=num-randnum; imin=j;
			}
		}
		var ienv=new environment();
		ienv.setting(setupData);
		ienv.brain=envi[imin].brain.copy();
		ienv.brain.mutate(0.05);
		nenvi.push(ienv);
	}
	envi=nenvi;
}