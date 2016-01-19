var _this = this;
window.onload = function () {
    divDetails = document.getElementById("instructions");
    global_style = { font: "14px 'Segoe UI', sans-serif", fill: "#000000", wordWrap: false, wordWrapWidth: _this.width, align: "left" };
    var game = new fbd.Game();
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fbd;
(function (fbd) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('loadEmpty', 'assets/loading-bar-empty.gif');
            this.load.image('loadFill', 'assets/loading-bar-fill.gif');
        };
        Boot.prototype.create = function () {
            Phaser.Canvas.setImageRenderingCrisp(this.game.canvas); //for Canvas, modern approach
            Phaser.Canvas.setSmoothingEnabled(this.game.context, false); //also for Canvas, legacy approach
            //PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST; //for WebGL
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;
            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    fbd.Boot = Boot;
})(fbd || (fbd = {}));
var fbd;
(function (fbd) {
    var ButtonLabel = (function (_super) {
        __extends(ButtonLabel, _super);
        function ButtonLabel(game, x, y, key, label, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {
            _super.call(this, game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
            game.add.existing(this);
            this.label = game.make.text(0, 0, label, global_style);
            this.label.anchor.setTo(0.5, 0.5);
            this.label.position.setTo(this.width / 2, this.height / 2);
            this.label.y = Math.round(this.label.y);
            this.label.x = Math.round(this.label.x);
            this.addChild(this.label);
        }
        return ButtonLabel;
    })(Phaser.Button);
    fbd.ButtonLabel = ButtonLabel;
})(fbd || (fbd = {}));
var fbd;
(function (fbd) {
    var Diagram = (function (_super) {
        __extends(Diagram, _super);
        function Diagram(game, x, y, key, startX, startY) {
            _super.call(this, game, x, y, key);
            this.game = game;
            this.game.add.existing(this);
            // diagram
            this.picture = this.game.make.sprite(0, 0, key);
            this.addChild(this.picture);
            // square box
            this.squareBox = new fbd.SquareBox(game, this.game.world.width, this.picture.height, 1);
            this.vector = [];
            var circle = game.add.bitmapData(10, 10);
            circle.circle(5, 5, 5, '#000000');
            this.circle = game.make.sprite(startX, startY, circle);
            this.circle.anchor.setTo(0.5, 0.5);
            this.circle.inputEnabled = true;
            this.circle.events.onInputDown.add(this.addVector, this);
            this.addChild(this.circle);
            this.addChild(this.squareBox);
            this.co = new Phaser.Point(startX, startY);
        }
        Diagram.prototype.destroyAll = function () {
            this.destroy();
            for (var i = 0; i < this.vector.length; i++) {
                this.vector[i].group.destroy();
                this.vector[i].destroy();
            }
        };
        Diagram.prototype.addVector = function () {
            if (this.vector.length < this.limit) {
                var i = this.vector.length;
                if (i == 0) {
                    this.vector[i] = new fbd.Vector(this.game, this.game.input.x, this.game.input.y, this.co.x, this.co.y);
                }
                else {
                    this.vector[i] = new fbd.Vector(this.game, this.game.input.x, this.game.input.y, this.co.x, this.co.y);
                }
            }
        };
        return Diagram;
    })(Phaser.Sprite);
    fbd.Diagram = Diagram;
})(fbd || (fbd = {}));
var fbd;
(function (fbd) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 623, 300, Phaser.CANVAS, 'cannyvas', null, true, false);
            this.state.add('Boot', fbd.Boot, false);
            this.state.add('Preloader', fbd.Preloader, false);
            this.state.add('MainMenu', fbd.MainMenu, false);
            this.state.add('Question', fbd.Question, false);
            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    fbd.Game = Game;
})(fbd || (fbd = {}));
var fbd;
(function (fbd) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            this.game.state.start('Question', true, false);
            _q = 0;
            _p = 0;
        };
        return MainMenu;
    })(Phaser.State);
    fbd.MainMenu = MainMenu;
})(fbd || (fbd = {}));
var fbd;
(function (fbd) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(this.game.width / 2, this.game.height / 2, 'loadEmpty');
            this.preloadBarFill = this.add.sprite(this.game.width / 2, this.game.height / 2, 'loadFill');
            this.preloadBar.x -= this.preloadBar.width / 2;
            this.preloadBar.y -= this.preloadBar.height / 2;
            this.preloadBarFill.x = this.preloadBar.x;
            this.preloadBarFill.y = this.preloadBar.y;
            this.load.setPreloadSprite(this.preloadBarFill);
            //  Load our actual games assets
            //  Question diagrams
            for (var i = 1; i < 2; i++) {
                var pic = 'pic' + i;
                var images = 'assets/questions/' + i + '.gif';
                this.load.image(pic, images);
            }
            //  Buttons
            this.game.load.spritesheet('btn', 'assets/btn.gif', 120, 33, 2);
            this.game.load.image('arrow-head', 'assets/arrow-head.gif');
            this.game.load.json('sheet', 'sheet.json');
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 50, Phaser.Easing.Linear.None, true);
            var tween2 = this.add.tween(this.preloadBarFill).to({ alpha: 0 }, 50, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
            var load = new Phaser.Loader(this.game);
            if (load.hasLoaded) {
                this.preloadBar.alpha = 0;
                this.preloadBarFill.alpha = 0;
            }
        };
        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return Preloader;
    })(Phaser.State);
    fbd.Preloader = Preloader;
})(fbd || (fbd = {}));
var fbd;
(function (fbd) {
    var Question = (function (_super) {
        __extends(Question, _super);
        function Question() {
            _super.apply(this, arguments);
        }
        Question.prototype.create = function () {
            //  getting data externally
            sheet = this.game.cache.getJSON('sheet');
            question = sheet.question[_q]; //  short-named variable for referencing of which question and part
            part = sheet.question[_q].part[_p];
            //  diagram initializing
            this.diagram = new fbd.Diagram(this.game, 0, 0, question.pic, question.co[0], question.co[1]);
            this.diagram.limit = question.limit;
            divDetails.innerHTML = part.instruction;
            //  button initializing
            this.btn = new fbd.ButtonLabel(this.game, 0, 0, 'btn', "Submit", this.submit, this, 0, 0, 1, 0);
            this.btn.x = this.game.width - (this.diagram.squareBox.width / 2) - (this.btn.width / 2); // just because I can and you can't
            //  testing purposes
            //this.input.onDown.add(this.submit, this);
        };
        Question.prototype.submit = function () {
            if (this.checkAnswers()) {
                this.diagram.squareBox.showAnswer(0, true);
            }
            else {
                this.diagram.squareBox.showAnswer(1, false);
            }
        };
        Question.prototype.checkAnswers = function () {
            //  check for answers
            //  if any of the vectors has the same angle range
            //  return true and show correct
            //  if wrong
            //  return false and show wrong check mark
            if (this.diagram.vector.length <= 0) {
                console.log("vector length lesser than or = 0");
                return false;
            }
            if (this.diagram.vector.length != part.answer.length) {
                console.log("vector length  not = to part.answer length");
                return false;
            }
            var allCorrect = 0;
            if (this.diagram.vector.length > 0 || this.diagram.vector.length == part.answer.length) {
                for (var i = 0; i < this.diagram.vector.length; i++) {
                    for (var j = 0; j < part.answer.length; j++) {
                        if (this.diagram.vector[i].angle != part.answer[j]) {
                            //console.log(this.diagram.vector[i].angle,"the vector angle", part.answer[j], "the answer", "answer is wrong");
                            continue;
                        }
                        if (this.diagram.vector[i].angle == part.answer[j]) {
                            console.log(this.diagram.vector[i].angle, "the vector angle", part.answer[j], "the answer", "answer is correct!");
                            allCorrect++;
                            break;
                        }
                    }
                }
            }
            if (allCorrect == part.answer.length) {
                return true;
            }
            if (allCorrect < part.answer.length) {
                return false;
            }
        };
        Question.prototype.render = function () {
        };
        return Question;
    })(Phaser.State);
    fbd.Question = Question;
})(fbd || (fbd = {}));
var fbd;
(function (fbd) {
    var SquareBox = (function (_super) {
        __extends(SquareBox, _super);
        function SquareBox(game, x, y, type) {
            // square box initialize
            var width = 200; // example;
            var height = 150; // example;
            var bmd = game.add.bitmapData(width, height);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, width, height);
            bmd.ctx.fillStyle = '#ffffff';
            bmd.ctx.fill();
            bmd.ctx.strokeStyle = '#000000';
            bmd.ctx.stroke();
            game.make.sprite(x, y, bmd);
            _super.call(this, game, x, y, bmd);
            this.anchor.setTo(1, 1);
            this.result = game.make.text(0, 0, '', { fill: '#00FF00', font: '48px Arial' });
            this.addChild(this.result);
            this.result.anchor.setTo(0.5, 0.5);
            this.result.position.setTo(-this.width / 2, -this.height / 2);
            this.result.y = Math.round(this.result.y);
            this.result.x = Math.round(this.result.x);
            //  textString[0] is correct, textString[1] is wrong;
            this.textString = [
                { 'text': "✔", 'fill': '#00FF00' },
                { 'text': "✖", 'fill': '#FF0000' }
            ];
            this.result.visible = false;
        }
        SquareBox.prototype.showAnswer = function (i, bool) {
            if (bool) {
                divDetails.innerHTML = part.correct;
            }
            this.result.visible = true;
            this.result.text = this.textString[i].text;
            this.result.fill = this.textString[i].fill;
        };
        SquareBox.prototype.update = function () {
        };
        return SquareBox;
    })(Phaser.Sprite);
    fbd.SquareBox = SquareBox;
})(fbd || (fbd = {}));
var fbd;
(function (fbd) {
    var Vector = (function (_super) {
        __extends(Vector, _super);
        function Vector(game, x, y, regionX, regionY) {
            this.bmd = game.make.bitmapData(game.width, game.height);
            this.bmdSprite = game.make.sprite(0, 0, this.bmd);
            _super.call(this, game, x, y, "arrow-head");
            //game.add.existing(this);
            game.make.sprite(x, y, "arrow-head");
            this.addChild(this.bmdSprite);
            this.bmd.ctx.strokeStyle = "black";
            this.startingPoint = new Phaser.Point(x, y);
            // click region initialize
            this.clickRegion = new Phaser.Rectangle(regionX, regionY, 200, 200);
            this.clickRegion.centerOn(regionX, regionY);
            this.startingPoint = new Phaser.Point(regionX, regionY);
            // arrow head initialize
            this.anchor.setTo(0, 0.5);
            this.inputEnabled = true;
            this.events.onInputDown.add(function () {
                this.drag();
                this.target = true;
            }, this);
            this.target = true;
            this.inside = this.clickRegion.contains(this.x, this.y);
            this.group = game.add.group();
            this.group.add(this.bmdSprite);
            this.group.add(this);
        }
        Vector.prototype.update = function () {
            if (this.game.input.mousePointer.isDown && this.target) {
                this.drag();
            }
            if (!this.game.input.mousePointer.isDown) {
                this.target = false;
            }
        };
        Vector.prototype.getAngle = function (x1, y1, x2, y2) {
            var rad = Phaser.Math.angleBetween(x1, y1, x2, y2);
            var deg = Phaser.Math.radToDeg(rad);
            var round = this.rounder(deg);
            return round;
            //return Phaser.Math.angleBetween(x1, y1, x2, y2)
        };
        Vector.prototype.drag = function () {
            this.inside = this.clickRegion.contains(this.x, this.y);
            if (this.x > 0) {
                //if user click on the region god damn it
                if (!this.inside) {
                    this.inside = this.clickRegion.contains(this.game.input.x, this.game.input.y);
                }
                if (this.inside) {
                    this.x = this.game.input.x;
                    this.y = this.game.input.y;
                    this.position.setTo(this.rounder(this.x), this.rounder(this.y));
                    if (this.y <= 0 && this.y <= this.width) {
                        this.y = this.rounder(this.width);
                    }
                    this.bmd.clear();
                    this.bmd.ctx.beginPath();
                    this.bmd.ctx.moveTo(this.startingPoint.x, this.startingPoint.y);
                    this.bmd.ctx.lineTo(this.rounder(this.x), this.rounder(this.y));
                    this.bmd.ctx.lineWidth = 2;
                    this.bmd.ctx.stroke();
                    this.bmd.ctx.closePath();
                    this.bmd.render();
                    this.angle = this.getAngle(this.startingPoint.x, this.startingPoint.y, this.rounder(this.x), this.rounder(this.y));
                }
            }
        };
        Vector.prototype.rounder = function (x) {
            return Math.ceil(x / 5) * 5;
        };
        return Vector;
    })(Phaser.Sprite);
    fbd.Vector = Vector;
})(fbd || (fbd = {}));
//# sourceMappingURL=game.js.map