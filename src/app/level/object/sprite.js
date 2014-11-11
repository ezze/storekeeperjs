define([
    'easel',
    'lodash'
], function(
    Easel,
    _
) {
    'use strict';

    var data = {
        images: ['img/sprites.png'],
        frames: {
            width: 32,
            height: 32,
            count: 23
        },
        animations: {
            box: [0],
            boxOnGoal: [1],
            wall: [2],
            goal: [3],
            workerLeftStand: [4],
            workerLeftWalk: [5, 12, true, 0.75],
            workerRightStand: [13],
            workerRightWalk: [14, 21, true, 0.75],
            space: [22]
        }
    };

    var spriteSheet = new Easel.SpriteSheet(data);

    var Sprite = function(level, row, column) {
        this._level = level;
        this._name = '';
        this._row = row;
        this._column = column;
        this._width = data.frames.width;
        this._height = data.frames.height;
        this._maxMovesPerCell = 16;
        this._sprite = new Easel.Sprite(spriteSheet, 'space');
        this._sprite.x = column * data.frames.width;
        this._sprite.y = row * data.frames.height;
        this._sprite.vX = data.frames.width / this._maxMovesPerCell;
        this._sprite.vY = data.frames.height / this._maxMovesPerCell;
    };

    Sprite.prototype = {
        getName: function() {
            return this._name;
        },

        find: function() {
            return this._level;
        },

        getRow: function() {
            return this._row;
        },

        getColumn: function() {
            return this._column;
        },

        getSprite: function() {
            return this._sprite;
        },

        transformToLocal: function() {
            var column = this._sprite.x / this._width;
            var row = this._sprite.y / this._height;
            this.setColumn(column);
            this.setRow(row);
        },

        setRow: function(row) {
            if (!_.isNumber(row)) {
                return;
            }
            this._row = row;
        },

        setColumn: function(column) {
            if (!_.isNumber(column)) {
                return;
            }
            this._column = column;
        },

        setSpeedMultiplier: function(num) {
            // TODO: it should be one of allowed values (i.e. pow of 2 or common factor of sprite dimension)
            if (!_.isNumber(num)) {
                this._maxMovesPerCell = num;
            }
        },

        stopAnimation: function() {
            this._sprite.stop();
        }
    };

    return Sprite;
});