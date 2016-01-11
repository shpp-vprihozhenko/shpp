function LRUCache(capacity) {
    this.size=0;
    this.capacity=capacity;

    var cachedElementsNames = [];
    var cachedElementsValues = {};

    function makeElementNameTop(prop) { // move element name to the top of element's names list
        cachedElementsNames.splice(cachedElementsNames.indexOf(prop), 1);
        cachedElementsNames.push(prop);
    }

    this.cache=function(elemName,elemValue){
        if(cachedElementsValues[elemName]!=undefined){ // reset to new value
            cachedElementsValues[elemName]=elemValue;
            makeElementNameTop(elemName);
        } else {
            Object.defineProperty(this, elemName, {     // define new element for this object
                get: function() {                       // with two properties - getter & setter
                    makeElementNameTop(elemName);
                    return cachedElementsValues[elemName];
                },
                set: function(newValue) {
                    cachedElementsValues[elemName] = newValue;
                    makeElementNameTop(elemName);
                },
                enumerable : true,
                configurable : true
            });
            cachedElementsValues[elemName]=elemValue;
            cachedElementsNames.push(elemName);
            if(this.size==this.capacity){               // delete out of capacity element
                var elemToDel=cachedElementsNames.shift(); // which is most useless
                delete cachedElementsValues[elemToDel];
                delete this[elemToDel];
            } else
                this.size++;
        }
        return this;
    }

    this.delete=function(elementName){
        var pos=cachedElementsNames.indexOf(elementName);
        if(pos==-1){
            return false;
        }
        delete cachedElementsValues[elementName];
        delete this[elementName];
        cachedElementsNames.splice(pos);
        this.size--;
        return true;
    }
}

var store = new LRUCache(3);

store.cache('a', 6);
console.log("a="+store.a);
console.log("cache size="+store.size);
console.log("cache capacity="+store.capacity);

store.cache('b', 2);
console.log("b="+store.b);

console.log("a="+store.a);

store.cache('c', 3);
console.log("c="+store.c);
store.cache('d', 4);
console.log("d="+store.d);

console.log("b="+store.b); // b is lost, because a,c,d are more actual

console.log("deleting d");
store.delete('d');
console.log("d is deleted. d="+store.d);
console.log("cache size="+store.size); // must be 2