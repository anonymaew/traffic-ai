/*
-----------------------------------------------
This code is entirely written by Napat Srichan.
   ** Require "matrix.js" library to run. **
-----------------------------------------------
*/

class neuralnetwork{
    constructor(nodeList){
        this.weightList=[];
        this.biasList=[];
        this.layer=nodeList;
        for(var i=1;i<this.layer.length;i++){
            var mi=new matrix(this.layer[i],this.layer[i-1]);
            for(var j=0;j<mi.size[0];j++) for(var k=0;k<mi.size[1];k++) mi.data[j][k]=randomGaussian()/Math.sqrt(this.layer[i]);
            this.weightList.push(mi);
            this.biasList.push(new matrix(this.layer[i],1));
        }
    }
    calculate(inputList){
        var dataMatrix=new matrix(inputList.length,1); for(var i=0;i<inputList.length;i++) dataMatrix.data[i][0]=inputList[i];
        for(var i=0;i<this.layer.length-1;i++){
            dataMatrix=this.weightList[i].copy().mult(dataMatrix);
            dataMatrix.add(this.biasList[i]);
            for(var j=0;j<dataMatrix.size[0];j++) for(var k=0;k<dataMatrix.size[1];k++){
                var num=1/(1+Math.exp(-dataMatrix.data[j][k]));
                dataMatrix.data[j][k]=num;
            }
        }
        return dataMatrix.transpose().data;
    }
    mutate(chance){
        for(var i=0;i<this.weightList;i++) for(var j=0;j<iw.size[0];j++) for(var k=0;k<iw.size[1];k++) if(random()<chance) iw.data[j][k]=randomGaussian()/Math.sqrt(iw.layer[i+1]); 
        for(let ib of this.biasList) for(var j=0;j<ib.size[0];j++) for(var k=0;k<ib.size[1];k++) if(random()<chance) ib.data[j][k]=randomGaussian(); 
    }
    copy(){
        var nn=new neuralnetwork([]);
        for(let iw of this.weightList) nn.weightList.push(iw.copy());
        for(let ib of this.biasList) nn.biasList.push(ib.copy());
        nn.layer=this.layer.slice();
        return nn;
    }
    import(s){
        this.weightList=[]; this.biasList=[];
        for(let w of s.weightList){
            var iw=new matrix(w.size[0],w.size[1]);
            iw.data=w.data.slice();
            this.weightList.push(iw);
        }
        for(let b of s.biasList){
            var ib=new matrix(b.size[0],b.size[1]);
            ib.data=b.data.slice();
            this.biasList.push(ib);
        }
        this.layer=s.layer;
    }
    export(){
        s["weightList"]=[]; s["biasList"]=[];
        for(let w of this.weightList) s.weightList.push(w);
        for(let b of this.biasList) s.biasList.push(b);
        return s;
    }
}