/*
-----------------------------------------------
This code is entirely written by Napat Srichan.
     ** Require "p5.js" library to run. **
     ** Require "nn.js" library to run. **
-----------------------------------------------
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
        this.score=[false,100];
    }
    collisionCheck(objectPosition,objectSpeed){
        if(objectSpeed>this.sp) return false;
        objectSpeed*=0.9;
        var colvec=createVector((this.sp*this.sp-objectSpeed*objectSpeed)/(2*this.acc)/36+this.length+4,0).rotate(this.head.heading());
        var obvec=objectPosition.copy().sub(this.pos);
        var vec=colvec.copy().sub(obvec);
        //edge case
        if(colvec.angleBetween(obvec)>=HALF_PI) return obvec.mag()<3;
        else if(colvec.angleBetween(vec)>=HALF_PI) return vec.mag()<3;
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
        var i=random(0,this.overallprob);
        for(var ii=0;ii<this.problist.length && i>0;ii++){
            i=i-this.problist[ii];
            if(i<0){
                var prob=this.carlist[ii];
                car.type=prob.type;
                car.length=prob.length;
                car.maxsp=prob.maxsp;
                car.acc=prob.acc;
            }
        }
    } 
}

class lane{
    constructor(startPosition,finishPosition,turningPointArray,flowRateInVPH){
        this.startpos=startPosition;
        this.finishpos=finishPosition;
        this.turnlist=turningPointArray.slice();
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
        this.brain=0;
        this.lightconfig=[];
        this.size=0;
        this.steptime=0;    // 1 step time equals to 0.1 second
        this.score=0;
    }
    setting(s){
        this.size=createVector(s.size[0],s.size[1]);
        for(let lanei of s.lane){
            var ilane=new lane(createVector(lanei.startpos[0],lanei.startpos[1]),createVector(lanei.finishpos[0],lanei.finishpos[1]),[],lanei.flowrate);
            ilane.setting(lanei);
            this.lanelist.push(ilane);
        }
        for(let ilight of s.light) this.lightlist.push(new light(createVector(ilight.pos[0],ilight.pos[1])));
        for(let ilc of s.lightconfig) this.lightconfig.push(ilc);
        this.brain=new neuralnetwork([this.lanelist.length,5,this.lightconfig.length]);
    }
    update(speed){
        for(var sp=0;sp<speed;sp++){
            //let the light thinking by nn
            var inp=[];
            for(let ilane of this.lanelist) inp.push(ilane.countlist[0].number-ilane.countlist[1].number);
            inp=this.brain.calculate(inp.slice());
            var max=-999; var imax;
            for(var i=0;i<this.lightconfig.length;i++) if(inp[i]>max){
                max=inp[i]; imax=i;
            }
            for(var i=0;i<this.lightlist.length;i++) this.lightlist[i].status=this.lightconfig[imax][i];
            //loop each lane
            for(var ilane=0;ilane<this.lanelist.length;ilane++){
                var lanei=this.lanelist[ilane];
                //add cars
                if(lanei.carlastadd<this.steptime){
                    var ci=new car(lanei.startpos.copy(),createVector(60,0).rotate(lanei.startdir));
                    lanei.carcustom.customize(ci);
                    lanei.carlist.push(ci);
                    lanei.carlastadd+=36000/lanei.flowrate;
                }
                //delete cars
                if(lanei.carlist.length>0) if(lanei.carlist[0].pos.dist(lanei.finishpos)<3){
                    this.score+=lanei.carlist[0].score[1];
                    lanei.carlist.shift();
                }
                //check the collision for the car
                for(let cari of lanei.carlist) cari.collision=false;
                //check red light
                for(let cari of lanei.carlist) for(let ilight of this.lightlist) if(ilight.status=="red") cari.collision=cari.collision || cari.collisionCheck(ilight.pos,0);
                //check the front car
                for(var icar=lanei.carlist.length-1;icar>0;icar--){
                    lanei.carlist[icar].collision=lanei.carlist[icar].collision || lanei.carlist[icar].collisionCheck(lanei.carlist[icar-1].pos,lanei.carlist[icar-1].sp);
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
                    //calculate the score
                    if(cari.sp==0){
                        if(cari.score[0]==false){
                            cari.score[1]-=10;
                            cari.score[0]=true;
                        }
                        else cari.score[1]-=1;
                    }
                    else cari.score[0]=false;
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
    scorenow(){
        var iscore=this.score;
        for(let ilane of this.lanelist) for(let icar of ilane.carlist) iscore+=icar.score[1];
        return iscore;
    }
}