/*
-----------------------------------------------
This code is entirely written by Napat Srichan.
     ** Require "p5.js" library to run. **
-----------------------------------------------
*/

/*
TODO :
spawnfunction.customize()
lane.update()
environment.update()
*/

class car{
    constructor(position,velocity){
        this.pos=position;
        this.vel=velocity;
        this.collision=false;
        this.maxsp=0;
        this.length=0;
        this.nextpos=0;
        this.nextvel=0;
        this.acc=acceleration;
        this.id=parseInt(random(1000000));
        this.type="";
    }
}

class turnpoint{
    constructor(position,steering){
        this.pos=position;
        this.steer=steering;
    }
}

//the class that make the car different in properties
class spawnfunction{
    constructor(){
        this.problist=[];
        this.overallprob=0;
        this.carlist=[];
    }
    addcar(name,carLength,maximumSpeed,acceleration,probability){
        this.carlist.push({
            type:name,
            length:carLength,
            maxsp:maximumSpeed,
            acc:acceleration,
        });
        this.problist.push(probability);
        this.overallprob+=probability;
    }
    customize(car){
        var i=random(overallprob);
        for(var ii=)
    } 
}

class lane{
    constructor(startPosition,finishPosition,turningPointArray,flowRateInVPH){
        this.startpos=startPosition;
        this.finishpos=finishPosition;
        this.turnlist=turningPointArray.splice();
        this.carlist=[];
        this.numbercar=0;
        this.startdir=finishPosition.copy().sub(startPosition).heading();
        this.flowrate=flowRateInVPH;
        this.carlastadd=0;
    }
    update(){
        if(this.flowrate)
    }
}

class light{
    constructor(position,redlightDurationList,yellowlightDurationList,greenlightDurationList){
        this.pos=position;
        this.redlist=redlightDurationList.splice();
        this.yellowlist=yellowlightDurationList.splice();
        this.greenlist=greenlightDurationList.splice();
        this.status="";
    }
    update(time){
        for(let l of this.redlist) if(time>=l[0] && time<l[1]) this.status="red";
        for(let l of this.yellowlist) if(time>=l[0] && time<l[1]) this.status="yellow";
        for(let l of this.greenlist) if(time>=l[0] && time<l[1]) this.status="green";
    }
}

class environment{
    constructor(){
        this.lanelist=[];
        this.lightlist=[];
        this.steptime=0;    // 1 step time equals to 0.1 second 
    }
    update(speed){
        for(var sp=0;sp<speed;sp++){
            for(let lane of lanelist){
                if(steptime>lane.carlastadd){                                   //if it is the time to spawn a car
                    
                    lane.carlasadd=steptime+36000/lane.flowrate;
                }
            }
            steptime++;
        }
    }
}