module.exports=function getCurrentDateTime() {
    var date = new Date();
    var hour = date.getHours();
    var min  = date.getMinutes();
    var sec  = date.getSeconds();
    return hour + ":" + min + ":" + sec;
}

