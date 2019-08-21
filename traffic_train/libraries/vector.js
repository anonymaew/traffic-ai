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
        return sqrt(this.x*this.x+this.y*this.y);
    }
    normalize(){
        return this.setMag(1);
    }
    dist(vec){
        return sqrt((this.x-vec.x)**2+(this.y-vec.y)**2);
    }
    heading(){
        return atan2(this.y,this.x);
    }
    rotate(an){
        var m=this.mag(); var h=this.heading();
        this.x=cos(h+an)*m; this.y=sin(h+an)*m;
        return this;
    }
    angleBetween(vec){
        return abs(this.heading(),vec.heading());
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