class vector{
    constructor(xx,yy){
        this.x=xx; this.y=yy;
    }
    copy(){
        return new vector(this.x,this.y);
    }
    add(vec){
        this.x+=vec.x; this.y+=vec.y;
        return this;
    }
    sub(vec){
        this.x-=vec.x; this.y-=vec.y;
        return this;
    }
    mult(c){
        this.x*=c; this.y*=c;
        return this;
    }
    mag(){
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }
    normalize(){
        return this.setMag(1);
    }
    dist(vec){
        return Math.sqrt((this.x-vec.x)**2+(this.y-vec.y)**2);
    }
    heading(){
        return Math.atan2(this.y,this.x);
    }
    rotate(an){
        var m=this.mag(); var h=this.heading();
        this.x=Math.cos(h+an)*m; this.y=Math.sin(h+an)*m;
        return this;
    }
    angleBetween(vec){
        return Math.abs(this.heading(),vec.heading());
    }
    dot(vec){
        return this.x*vec.x+this.y*vec.y;
    }
    setMag(c){
        var m=this.mag();
        this.x*=c/m; this.y*=c/m;
        return this;
    }
}