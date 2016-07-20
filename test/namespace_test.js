describe("Ns tests: ", function(){

    var DEFAULT_PROPS = ["length", "name", "arguments", "caller", "prototype"];

    beforeEach(function() {
        // clear all properties from _ns before each test
        // woulde be good to clear ns().list but this variable is not accessible from outside of the closure ...
        var props = Object.getOwnPropertyNames(_ns);
        for(var i = 0; i<props.length; i++) {
            var prop = props[i];
            if(DEFAULT_PROPS.indexOf(prop) === -1) {
                _ns[prop] = null;
                delete _ns[prop];
            }
        }
    });

    afterEach(function() {

    });

    it("Cheks if _ns exists", function() {
        expect(_ns).to.exist;
    });

    it("Creates test.case.Example class", function() {
        var _class = _ns("test.case.Example").Class({
            init: function() {

            }
        });

        expect(_ns.test.case.Example).to.exist;
    });

    it("Creates test.case.Extended class and extends it with test.case.Base", function() {
        _ns("test.case.Base").Class({
            init: function() {

            }
        });

        var _class = _ns("test.case.Extended").extends("test.case.Base").Class({
            init: function() {

            }
        });

        expect(_ns.test.case.Extended).to.exist;
    });

    it("Won't extend a class that doesn't exist", function() {
        expect(function(){
            _ns("test.case.Try").extends("test.case.NotExisting").Class({
                init: function() {

                }
            });
        }).to.throw('No such a class: "test.case.NotExisting" found');
    });

    it("Will create a static class", function() {
        _ns("test.case.StaticClass").static.Class({
            "DoSomething" : function() {

            },
            "DoSomethingElse" : function() {

            }
        });

        expect(_ns.test.case.StaticClass).to.exist;
    });

    it("Will get a propper iheritance list", function() {
        _ns("test.case.ClassA").Class({
            init: function() {

            }
        });

        _ns("test.case.ClassB").extends("test.case.ClassA").Class({
            init: function() {

            }
        });

        expect(_ns().getClasspath("test.case.ClassB")).to.eql(["test.case.ClassA"]);

        _ns("test.case.ClassC").extends("test.case.ClassB").Class({
            init: function() {

            }
        });

        expect(_ns().getClasspath("test.case.ClassC")).to.eql(["test.case.ClassB", "test.case.ClassA"]);
    });

});