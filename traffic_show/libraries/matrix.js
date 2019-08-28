/*
-----------------------------------------------
This code is entirely written by Napat Srichan.
-----------------------------------------------
*/

class matrix{
    constructor(row,column){
        this.data=[];
        this.size=[row,column];
        for(var i=0;i<this.size[0];i++){
            this.data[i]=[];
            for(var j=0;j<this.size[1];j++) this.data[i][j]=0;
        }
    }
    copy(){
        var im=new matrix(this.size[0],this.size[1]);
        for(var i=0;i<this.size[0];i++) for(var j=0;j<this.size[1];j++) im.data[i][j]=this.data[i][j];
        return im; 
    }
    add(m){
        if(m.size[0]!=this.size[0] || m.size[1]!=this.size[1]) throw "matrix sizes are not the same ".concat(m.size.toString()," and ",this.size.toString());
        for(var i=0;i<this.size[0];i++) for(var j=0;j<this.size[1];j++) this.data[i][j]+=m.data[i][j];
        return this; 
    }
    mult(m){
        if(this.size[1]!=m.size[0]) throw "matrix size are not the same";
        var im=new matrix(this.size[0],m.size[1]);
        for(var i=0;i<this.size[0];i++) for(var j=0;j<m.size[1];j++) for(var k=0;k<this.size[1];k++) im.data[i][j]+=this.data[i][k]*m.data[k][j];
        return im;
    }
    addc(c){
        for(var i=0;i<this.size[0];i++) for(var j=0;j<this.size[1];j++) this.data[i][j]+=c;
        return this;
    }
    multc(c){
        for(var i=0;i<this.size[0];i++) for(var j=0;j<this.size[1];j++) this.data[i][j]*=c;
        return this;
    }
    transpose(){
        var im=new matrix(this.size[1],this.size[0]);
        for(var i=0;i<this.size[0];i++) for(var j=0;j<this.size[1];j++) im.data[j][i]=this.data[i][j];
        this.size=[im.size[0],im.size[1]];
        return this;
    }
}