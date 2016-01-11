user = {
    firstName: "dfg",
    sayHi: function() {
        console.log( this.firstName );
    }
};

console.log( "begin." );

setTimeout(user.sayHi, 1000); // undefined (не Вася!)

//setTimeout(function() {
//    user.sayHi(); // Вася
//}, 1000);

//var user = {
//    firstName: "Вася",
//    sayHi: function() {
//        console.log( this.firstName );
//    }
//};
//
//setTimeout(function() {
//    user.sayHi(); // Вася
//}, 1000);

//function bind(func, context) {
//    return function() { // (*)
//        return func.apply(context, arguments);
//    };
//}
//function f() {
//    console.log( this );
//}
//
//var g = bind(f, "Context");
//g(); // Context

//function bind(func, context) {
//    return function() {
//        return func.apply(context, arguments);
//    };
//}
//
//var user = {
//    firstName: "dogg",
//    sayHi: function() {
//        console.log( this.firstName );
//    }
//};
//
//setTimeout(bind(user.sayHi, user), 1000);