var envi=[],setupData,speed=1,sh=0,si=10,envshow,gen=0,showOption=true,result={},savefile,fileAvail=true;

function preload(){
	setupData=loadJSON("system_config.json");
	var a=new XMLHttpRequest();
	fileAvail=a.open('HEAD',"neural.json",false).send().status!=404;
	if(fileAvail) savefile=loadJSON("neural.json");
}

function setup() {
	createCanvas(480, 360, WEBGL);
	frameRate(30);
	strokeWeight(1);
	if(!fileAvail) console.log("gay");
	for(var i=0;i<si;i++){
		var ienv=new environment();
		ienv.setting(setupData)
		envi.push(ienv);
	}
	camera(0,0,800,0,0,0,0,1,0);
}

function draw(){
	background(255);
	for(var i=0;i<si;i++){
		//if(sh==i) envi[i].show();
		envi[i].update(speed);
	}
	if(gen>0){
		envshow.update(speed);
		if(showOption) envshow.show();
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
	var lis=[]; var lisi=[];
	for(let i of li) lis.push(map(i,Math.min(...li),Math.max(...li),0,1));
	for(var i=0;i<lis.length;i++) lis[i]*=lis[i];
	console.log(Math.max(...li));
	//console.log(lis);
	var nenvi=[];
	var sum=0; for(let n of lis) sum+=n;
	for(var i=0;i<si;i++){
		var randnum=random(sum);
		var imin;
		for(var j=0;j<lis.length && randnum>0;j++){
			randnum-=lis[j];
			if(randnum<0) imin=j;
		}
		var ienv=new environment();
		ienv.setting(setupData);
		ienv.brain=envi[imin].brain.copy();
		lisi.push(imin);
		ienv.brain.mutate(0.02);
		nenvi.push(ienv);
	}
	//console.log(lisi);
	envshow=new environment();
	envshow.setting(setupData);
	envshow.brain=envi[imin].brain.copy();
	var iob={
		"brain":envshow.brain,
		"score":Math.max(...li)
	}
	result[gen]=iob;
	envi=nenvi;
	gen++;
}

function saveResult(){
	saveJSON(result,"neural.json");
}