/*
-----------------------------------------------
This code is entirely written by Napat Srichan.
     ** Require "p5.js" library to run. **
-----------------------------------------------
*/

/*
TODO :
connect to nn
*/

class car{
    constructor(position,velocity){
        this.pos=position;        //in m
        this.sp=velocity.mag();        //in kmph
        this.head=velocity.normalize();
        this.collision=false;
        this.maxsp=0;
        this.length=0;
        this.acc=0;    //in kmphpst
        this.id=parseInt(random(1000000));
        this.type="";
    }
    collisionCheck(objectPosition,objectVelocity){
        var colvec=this.head.copy().setMag((this.sp*this.sp-objectVelocity.mag()*objectVelocity.mag())/(2*this.acc)/36+this.length+4);
        var obvec=objectPosition.copy().sub(this.pos);
        //edge case
        if(colvec.angleBetween(obvec)>=HALF_PI) return obvec.mag()<3;
        else if(colvec.copy().mult(-1).angleBetween(obvec.copy().sub(colvec))>=HALF_PI) return obvec.copy().sub(colvec).mag()<3;
        //normal case
        else return obvec.copy().sub(colvec.copy().setMag(obvec.dot(colvec)/colvec.mag())).mag()<3;
    }
}

class turnpoint{
    constructor(position,steering,tolane){
        this.pos=position;
        this.steer=steering;
        this.tolane=tolane;
    }
}

class countpoint{
    constructor(position){
        this.pos=position;
        this.lastid=-1;
        this.number=0;
    }
}

//the class that make the car different in properties
class spawnfunction{
    constructor(){
        this.problist=[];
        this.overallprob=0;
        this.carlist=[];
    }
    addcar(carObj,probability){
        this.carlist.push(carObj);
        this.problist.push(probability);
        this.overallprob+=probability;
    }
    customize(car){
        var i=random(this.overallprob);
        for(var ii=0;ii<this.problist.length;ii++){
            if(i<this.problist[ii]){
                var prob=this.carlist[ii];
                car.type=prob.type;
                car.length=prob.length;
                car.maxsp=prob.maxsp;
                car.acc=prob.acc;
            }
            i=i-this.problist[ii];
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
        this.countlist=[];
    }
    setting(s){
        for(let tl of s.turnlist) this.turnlist.push(new turnpoint(createVector(tl.pos[0],tl.pos[1]),tl.steer,tl.tolane));
        this.carcustom=new spawnfunction();
        for(let cf of s.carcustom.carlist) this.carcustom.addcar(cf,0);
        this.carcustom.problist=s.carcustom.problist;
        this.carcustom.overallprob=s.carcustom.overallprob;
        for(let cl of s.countlist) this.countlist.push(new countpoint(createVector(cl.pos[0],cl.pos[1])));
    }
    update(time){
        //if it is the time to spawn the car
        if(this.carlastadd<=time){
            var ci=new car(this.startpos.copy(),createVector(60,0).rotate(this.startdir));
            this.carcustom.customize(ci);
            this.carlist.push(ci);
            this.carlastadd+=36000/this.flowrate;
        }
        //if the car reach the end of the road
        if(this.carlist.length>0) if(this.carlist[0].pos.dist(this.finishpos)<3) this.carlist.shift();
    }
}

class light{
    constructor(position){
        this.pos=position;
        this.status="red";
    }
}

class environment{
    constructor(){
        this.lanelist=[];
        this.lightlist=[];
        this.size=0;
        this.steptime=0;    // 1 step time equals to 0.1 second
    }
    setting(s){
        this.size=createVector(s.size[0],s.size[1]);
        for(let lanei of s.lane){
            var ilane=new lane(createVector(lanei.startpos[0],lanei.startpos[1]),createVector(lanei.finishpos[0],lanei.finishpos[1]),[],lanei.flowrate);
            ilane.setting(lanei);
            this.lanelist.push(ilane);
        }
        for(let ilight of s.light) this.lightlist.push(new light(createVector(ilight.pos[0],ilight.pos[1])));
    }
    update(speed){
        for(var sp=0;sp<speed;sp++){
            for(let ilight of this.lightlist){
                //let the light thinking by nn?
                this.lightlist[0].status="green";
            }
            for(var ilane=0;ilane<this.lanelist.length;ilane++){
                var lanei=this.lanelist[ilane];
                //add or delete cars
                lanei.update(this.steptime);
                //check the collision for the car
                for(let cari of lanei.carlist) cari.collision=false;
                //check red light
                for(let cari of lanei.carlist) for(let ilight of this.lightlist) if(ilight.status=="red") cari.collision=cari.collision || cari.collisionCheck(ilight.pos,createVector(0,0));
                //check the front car
                for(var icar=lanei.carlist.length-1;icar>0;icar--){
                    lanei.carlist[icar].collision=lanei.carlist[icar].collision || lanei.carlist[icar].collisionCheck(lanei.carlist[icar-1].pos,lanei.carlist[icar-1].head.copy().mult(lanei.carlist[icar-1].sp));
                }
                //count the car
                for(let icar of lanei.carlist) for(let ic of lanei.countlist) if(icar.pos.dist(ic.pos)<3 && ic.lastid!=icar.id){
                    ic.number++;
                    ic.lastid=icar.id;
                }
                //update the car
                for(let cari of lanei.carlist){
                    if(cari.collision) cari.sp-=cari.acc;
                    else if(cari.sp<cari.maxsp) cari.sp+=cari.acc;
                    if(cari.sp<0) cari.sp=0;
                    cari.pos.add(cari.head.copy().mult(cari.sp/36));
                }
            }
            this.steptime++;
        }
    }
    show(){
        //draw the grass
        fill(28,107,43);
        rect(-this.size.x/2,-this.size.y/2,this.size.x,this.size.y);
        //draw lanes
        for(let ilane of this.lanelist){
            push();
            translate(ilane.startpos.x,ilane.startpos.y);
            var lanevec=ilane.finishpos.copy().sub(ilane.startpos);
            rotate(lanevec.heading());
            fill(64);
            rect(0,-2,lanevec.mag(),4);
            pop();
        }
        //draw lights
        for(let ilight of this.lightlist){
            if(ilight.status=="red") fill(255,0,0);
            if(ilight.status=="green") fill(0,255,0);
            if(ilight.status=="yellow") fill(255,255,0);
            ellipse(ilight.pos.x,ilight.pos.y,3,3);
        }
        //draw cars
        for(let ilane of this.lanelist) for(let icar of ilane.carlist){
            push();
            translate(icar.pos.x,icar.pos.y);
            rotate(icar.head.heading());
            fill(128,0,0);
            rect(0,-1.5,icar.length,3);
            pop();
        }
    }
}