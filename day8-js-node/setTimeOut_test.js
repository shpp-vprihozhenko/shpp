///**
// * Created by Uzer on 12.01.2016.
// */
//function doSetTimeout(i) {
//    //setTimeout(function(){console.log(i);}, 2000);
//    var f=function(){
//        console.log(i);
//    };
//    setTimeout(f, 2000);
//}
//for(var i=0;i<5;i++){
//    doSetTimeout(i);
//}

//for(var i=0;i<5;i++){
//    setTimeout(function(j){console.log(j)}, 2000, i);
//}

for(var i=0;i<5;i++){
    setTimeout(function(i){console.log(i)}, 2000);
}