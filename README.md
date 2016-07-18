# ns
Library for creating namespaces classes with inheritance based on John Resig's Simple JavaScript Inheritance http://ejohn.org/blog/simple-javascript-inheritance.
Usefull especially when you don't want to use some big javascript framework and you'd like to organize your code.

Usage:
```
_ns("some.namespace.MyClass").Class({
    init: function(a) {
       this.a = a;
    },
    getA: function() {
        return this.a;
    }
});

_ns("some.namespace.OtherClass").extends("some.namespace.MyClass").Class({
    init: function(a,b) {
        this._super(a);
        this.b = b;
    },
    getB: function() {
        return this.b;
    }
});

var myClass = new _ns.some.namespace.MyClass(1);
var otherClass = new _ns.some.namespace.OtherClass(2, 3);

myClass.getA();
otherClass.getA();
otherClass.getB();
```

It might be more natural to use with your own "namespace" for eg. your company name. To do this you have to remove original _ns from window and swap it with your own.
```
window.company = window._ns;
delete window._ns;
````

and then you're be able to, write it like that:
```
company("some.namespace.AwesomeClass").Class({
    init: function(n) {
        this.n = n;
    },
    setN: function(n) {
        this.n = n;
    },
    getN: function(n) {
        return this.n;
    }
});

var awesome = new company.some.namespace.AwesomeClass(5);
awesome.getN();
