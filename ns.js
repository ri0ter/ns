(function(){ 

    var Ns = initiator;
    
	var nsList = [];

    function Namespace(namespace, reference) {
        var scope = Ns;

        var names = namespace.split("."),
            i = 0,
            len = names.length,
            last = len - 1;
        for(i; i<len; i++) {
            var name = names[i];
            if(!/^[A-Za-z]+$/.test(name)) {
                throw new Error('Namespace Error: invalid character in namespace');
            }

            if(i === last) {
                if(scope[name] && reference && console.warn) {
                    throw new Error('Selected namespace already exist');
                }
                if(reference) {
                    scope[name] = reference;
                }
                scope = scope[name];

                if(nsList.indexOf(namespace) === -1) {
                    nsList.push(namespace);
                }
            }
            else {
                if(typeof scope[name] === "function") {
                    throw new Error('Namespace Error: Function cannot be used as a part of namespace');
                }
                scope[name] = scope[name] || {};
            }

            if(i === 0) {
                scope = scope[name];
            }
        }

        return scope;
    }

    /*
	 *	Based on John Resig's Simple JavaScript Inheritance http://ejohn.org/blog/simple-javascript-inheritance
     */
    var initializing = false;
    var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    function extend(base, prop) {
        var _super = base.prototype;

        initializing = true;
        var prototype = new base();
        initializing = false;

        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" &&
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
            "extends": function(_ns){
                var base = Namespace(_ns);
                if(!base) {
                    throw new Error ("No such a class found at given namespace");
                }
                return {
                    "Class": function(prop) {
                        var _new = extend(base, prop);
                        return Namespace(ns, _new);
                    }
                }
            },
            "Class" : function(prop) {
                var _new = extend(function(){}, prop);
                return Namespace(ns, _new);
            }
        };
    }

    window._ns = Ns;
    
})();