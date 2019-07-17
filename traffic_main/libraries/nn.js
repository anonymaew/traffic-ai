/*
-----------------------------------------------
This code is entirely written by Napat Srichan.
    ** Require "math.js" library to run. **
-----------------------------------------------
*/

class neuralnetwork{
    constructor(nodeList){
        this.weightList=[];
        this.biasList=[];
        this.layer=nodeList.length;
        for(var i=1;i<this.layer;i++){
            var mi=math.zeros(nodeList[i],nodeList[i-1]);
            mi=mi.map(function(value,index,matrix){return value=randomGaussian()/sqrt(nodeList[i]);});
            this.weightList.push(mi);
            this.biasList.push(math.zeros(nodeList[i],1))
        }
    }
    calculate(inputList){
        inputList=math.transpose(math.matrix([inputList]));
        for(var i=0;i<this.layer-1;i++){
            inputList=math.add(math.multiply(this.weightList[i],inputList),this.biasList[i]);
            inputList=inputList.map(function(value,index,matrix){return value=1/(1+math.exp(-value))});
        }
        return math.squeeze(inputList)._data;
    }
    mutate(chance){
        this.weightList=this.weightList.map(function(value,index,matrix){
            return value=value.map(function(v,i,m){
                if(random()<chance) v=randomGaussian()/sqrt(value._size[0]);
                return v;
            })
        });
        this.biasList=this.biasList.map(function(value,index,matrix){
            return value=value.map(function(v,i,m){
                if(random()<chance) v=randomGaussian();
                return v;
            })
        });
    }
    copy(){
        var nn=new neuralnetwork([]);
        nn.weightList=this.weightList.map(function(value,index,array){return value.clone()});
        nn.biasList=this.biasList.map(function(value,index,array){return value.clone()});
        nn.layer=this.layer;
        return nn;
    }
    import(s){
        this.weightList=[]; this.biasList=[];
        for(let w of s.weightList) this.weightList.push(math.matrix(w));
        for(let b of s.biasList) this.biasList.push(math.matrix(b));
    }
    export(){
        var s={};
        s["weightList"]=[]; s["biasList"]=[];
        for(let w of this.weightList){
            var rl=[];
            for(let r of w._data) rl.push(r.slice());
            s.weightList.push(rl);
        } 
        for(let b of this.biasList){
            var rl=[];
            for(let r of b._data) rl.push(r.slice());
            s.biasList.push(rl);
        }
        return s;
    }
}