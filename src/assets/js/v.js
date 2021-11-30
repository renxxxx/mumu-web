function V(target){
  this.target=target;
  
  V.prototype.attr = function(keyChain,newValue){
    var carrier=target;
    var parent=null;
    if(!this.target || !keyChain){
      return null;
    }
     var keys= keyChain.split('.')
     for(var i in keys){
          parent=target[keys[i-1]];
         if(keys[i].indexOf('[')>=0){
            var key=keys[i].substring(0,keys[i].indexOf('['));
            var index = keys[i].substring(keys[i].indexOf('[')+1,keys[i].indexOf(']'));
            carrier=carrier[key];
            if(carrier==null || carrier==undefined){
              carrier=null;
              break;
            }
            if(carrier.length<=index){
               carrier=null;
                break;
            }
            carrier=carrier[index];
         }else {
            carrier=carrier[keys[i]];
            if(carrier==null || carrier==undefined){
              carrier=null;
              break;
            }
         }
     }
     if(newValue !== undefined && parent){
       parent[keys[keys.length-1]]=newValue
     }
     return carrier;
  }
}

function v(target){
  return new V(target);
}


export default v;