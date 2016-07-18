(function(){

    //"use strict"; <- causes error in browsers != Chrome

    var DEFAULT_PROPS = ["length", "name", "prototype", "caller", "prototype"];

    var Ns = initiator;
    
    var nsList = [];
//  var inheritanceTree = {}; TODO: add inheritance tree

    function Namespace(namespace, reference) {
        var scope = Ns;

        var names = namespace.split("."),
            i = 0,
            len = names.length,
            last = len - 1;
        for(i; i<len; i++) {
            var name = names[i];
            if(!/^[A-Za-z]+$/.test(name)) {
                throw new Error('Invalid character in namespace '+namespace);
            }

            if(i === last) {
                if(scope[name] && reference && console.warn) {
                    throw new Error('Selected namespace "'+namespace+'" already exist');
                }
                if(reference) {
                    scope[name] = reference;
                    if(nsList.indexOf(namespace) === -1) {
                        nsList.push(namespace);
                    }
                }
            }
            else {
                if(i === 0) {
                    if (DEFAULT_PROPS.indexOf(name) !== -1) {
                        throw new Error('Cannot use reserved word: "' + name + '"');
                    }
                }
                if(typeof scope[name] === "function") {
                    throw new Error('Function cannot be used as a part of namespace: "'+name+'"');
                }
                scope[name] = scope[name] || {};
            }

            scope = scope[name];
        }

        return scope;
    }

    /*
     * Based on John Resig's Simple JavaScript Inheritance http://ejohn.org/blog/simple-javascript-inheritance
     */
    var initializing = false;
    var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    function extend(base, prop) {
        var _super = base.prototype;

        initializing = true;
        var prototype = new base();
        initializing = false;

        for (var name in prop) {
            prototype[name] = typeof prop[name] == 'function' &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    return function() {
                        var tmp = this._super;

                        this._super = _super[name];

                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        function Class() {
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }

        Class.prototype = prototype;
        Class.prototype.constructor = Class;

        return Class;
    }

    function initiator(ns) {
        if(!ns){
            return {
                'list' : nsList.sort()
            }
        }
        return {
            "Class" : function(prop) {
                var _new = extend(function(){}, prop);
                return Namespace(ns, _new);
            },
            "extends": function(_ns){
                var base = Namespace(_ns);
                if(!base) {
                    throw new Error ('No such a class: "'+_ns+'" found');
                }
                if(Object.prototype.toString.call(base) === '[object Object]') { //if base is static
                    throw new Error ('Cannot extend static class');
                }
                return {
                    "Class": function(prop) {
                        var _new = extend(base, prop);
                        return Namespace(ns, _new);
                    }
                }
            },
            "static" : {
                "Class" : function(prop) {
                    if(Object.prototype.toString.call(prop) !== '[object Object]') {
                        throw new Error('Static class must bye type of object');
                    }
                    return Namespace(ns, prop);
                }
            }
        };
    }

    window._ns = Ns;
    
})();