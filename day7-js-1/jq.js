function $(id){
    if(this===window) return new $(id);
    this.elem = document.getElementById(id);
    this.html = function (textToAdd){
        if(textToAdd)
            this.elem.innerHTML=this.elem.innerHTML+textToAdd;
        return this.elem.innerHTML;
    };
    return this;
}
