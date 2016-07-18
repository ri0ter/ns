describe("Ns tests: ", function(){

    var defaultProps = ["length", "name", "prototype"];

    beforeEach(function() {
        // clear all properties from _ns before each test
        // woulde be good to clear ns().list but this variable is not accessible from outside of the closure ...
        var props = Object.getOwnPropertyNames(_ns);
        for(var i = 0; i<props.length; i++) {
            var prop = props[i];
            if(defaultProps.indexOf(prop) === -1) {
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

});