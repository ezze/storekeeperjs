define([
    'ring',
    './object'
], function(
    Ring,
    Object
) {
    "use strict";

    var Box = Ring.create([Object], {
        constructor: function(level, row, column) {
            this.$super(level, row, column);
            this._sprite.gotoAndStop(['box']);
        }
    });
    return Box;
});