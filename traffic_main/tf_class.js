/*
-----------------------------------------------
This code is entirely written by Napat Srichan.
     ** Require "p5.js" library to run. **
-----------------------------------------------
*/

/*
TODO :
environment.update()
*/

class car{
    constructor(position,velocity){
        this.pos=position;        //in m
        this.vel=velocity;        //in kmph
        this.collision=false;
        this.maxsp=0;
        this.length=0;
        this.acc=acceleration;    //in kmphpst
        this.id=parseInt(random(1000000));
        this.type="";
    }
    collisionCheck(objectPosition,objectVelocity){
        var colvec=this.vel.copy().setMag((this.vel.mag()*this.vel.mag()-objectVelocity.mag()*objectVelocity.mag())/(2*this.acc*36)+this.length+2);
        var obvec=objectPosition.copy().sub(this.pos);
        //edge case
        if(colvec.angleBetween(obvec)>=HALF_PI) return obvec.mag()<2;
        if(colvec.copy().mult(-1).angleBetween(obvec.copy().sub(colvec))>=HALF_PI) return obvec.copy().sub(colvec).mag()<2;
        //normal case
        return obvec.copy().sub(colvec.copy().setMag(obvec.dot(colvec)/colvec.mag())).mag()<2;
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
        //if it is the time to spawn the car
        if(this.carlastadd<=time){
            var ci=new car(this.startpos,createVector(60,0).rotate(this.startdir));
            ci.
            this.carlastadd+=36000/this.flowrate;
        }
        //if the car reach the end of the road
        if(this.carlist.length>0) if(this.carlist[0].pos.dist(finishpos)<2) this.carlist.shift();
    }
}

class light{
    constructor(position){
        this.pos=position;
        this.status="red";
    }
    collisionCheck(position){
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
                //let the light thinking by nn?
            }
            for(var ilane=0;ilane<this.lanelist;ilane++){
                var lane=this.lanelist[ilane];
                //add or delete cars
                lane.update(this.steptime);
                //check the collision for the car
                for(let car of lane) car.collision=false;
                //check red light
                for(let car of lane) for(let light of this.lightlist) car.collision=light.checkCollision(car.pos);
                //check the front car
                for(var icar=lane.carlist.length-1;icar>0;icar--){
                    lane.carlist[icar].collision=lane.carlist[icar].collisionCheck(lane.carlist[icar-1].pos,lane.carlist[icar-1].vel);
                }
                //update the car
                for(let car of lane){
                    if(car.collision) car.vel.sub(car.vel.copy().setMag(car.acc));
                    else if(car.vel.mag()<car.maxsp) car.vel.add(car.vel.copy().setMag(car.acc));
                    car.pos.add(car.vec);
                }
            }
            this.steptime++;
        }
    }
}