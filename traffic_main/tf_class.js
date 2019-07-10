/*
-----------------------------------------------
This code is entirely written by Napat Srichan.
     ** Require "p5.js" library to run. **
-----------------------------------------------
*/

/*
TODO :
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
    constructor(position,steering,tolane){
        this.pos=position;
        this.steer=steering;
        this.tolane=tolane;
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
        var i=random(this.overallprob);
        for(var ii=0;ii<this.problist.length;ii++){
            if(i<this.problist[ii]){
                var prob=problist[ii];
                car.type=prob.type;
                car.length=prob.length;
                car.maxsp=prob.maxsp;
                car.acc=prob.acc;
            }
            i=i-problist[ii];
        }
    } 
}

class lane{
    constructor(startPosition,finishPosition,turningPointArray,flowRateInVPH){
        this.startpos=startPosition;
        this.finishpos=finishPosition;
        this.turnlist=turningPointArray.splice();
        this.carlist=[];
        this.startdir=finishPosition.copy().sub(startPosition).heading();
        this.flowrate=flowRateInVPH;
        this.carlastadd=0;
        this.carcustom=0;
    }
    update(time){
        if(this.carlastadd<=time){
            var ci=new car(this.startpos,createVector(60,0).rotate(this.startdir));
            ci.
            this.carlastadd+=36000/this.flowrate;
        }
    }
}

class light{
    constructor(position){
        this.pos=position;
        this.status="red";
    }
    collisioncheck(position){
        return (this.pos.dist(position)<2 && status=="red");
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
            for(let light of this.lightlist){
                //let the light thinking
            }
            for(let lane of this.lanelist){
                lane.update(this.steptime);
            }
            this.steptime++;
        }
    }
}