var _this = this;
window.onload = function () {
    vectorOffset = 0;
    mcq = document.getElementById("form-float");
    divDetails = document.getElementById("instructions");
    global_style = { font: "14px 'Segoe UI', sans-serif", fill: "#000000", wordWrap: false, wordWrapWidth: _this.width, align: "left" };
    var game = new fbd.Game();
    inputBox = "";
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
            inputBox = { input: [] };
            inputBox["id"] = 0;
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
                this.vector[i].groupStick.clear();
            }
            this.vector = [];
        };
        Diagram.prototype.createInputBoxes = function (i) {
            var id = "force" + i;
            inputBox.input.push({
                name: id,
                dragged: false,
                inputValues: ""
            });
            var body = document.getElementById("body");
            body.innerHTML += "<div id='" + id + "' class='box' style='display: none;'  onclick='getId(this.id)'><input type='text' onkeyup='enterInput(event)' placeholder='Force Label: ' class='form-control box' required></div>";
        };
        Diagram.prototype.addVector = function () {
            if (this.vector.length < this.limit) {
                var i = this.vector.length;
                if (i == 0) {
                    this.vector[i] = new fbd.Vector(this.game, this.game.input.x, this.game.input.y, this.co.x, this.co.y, i);
                    this.createInputBoxes(i);
                }
                else {
                    this.vector[i] = new fbd.Vector(this.game, this.game.input.x, this.game.input.y, this.co.x, this.co.y, i);
                    this.createInputBoxes(i);
                }
            }
        };
        return Diagram;
    })(Phaser.Sprite);
    fbd.Diagram = Diagram;
})(fbd || (fbd = {}));
var fbd;
(function (fbd) {
    var Finish = (function (_super) {
        __extends(Finish, _super);
        function Finish() {
            _super.apply(this, arguments);
        }
        Finish.prototype.create = function () {
            divDetails.innerHTML = "You have completed this exercise!";
            this.clear();
        };
        Finish.prototype.clear = function () {
            mcq.style.display = "none";
        };
        return Finish;
    })(Phaser.State);
    fbd.Finish = Finish;
})(fbd || (fbd = {}));
var fbd;
(function (fbd) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 623, 260, Phaser.CANVAS, 'cannyvas', null, true, true);
            this.state.add('Boot', fbd.Boot, false);
            this.state.add('Preloader', fbd.Preloader, false);
            this.state.add('MainMenu', fbd.MainMenu, false);
            this.state.add('Question', fbd.Question, false);
            this.state.add('Finish', fbd.Finish, false);
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
            this.game.load.image('resolve', 'assets/resolve.gif');
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
            this.initialize();
        };
        Question.prototype.initialize = function () {
            question = sheet.question[_q]; //  short-named variable for referencing of which question and part
            part = sheet.question[_q].part[_p];
            //  diagram initializing
            this.diagram = new fbd.Diagram(this.game, 0, 0, question.pic, question.co[0], question.co[1]);
            this.diagram.limit = question.limit;
            divDetails.innerHTML = part.instruction;
            //  button initializing
            this.btn = new fbd.ButtonLabel(this.game, 0, 0, 'btn', "Submit", this.submit, this, 0, 0, 1, 0);
            this.btn.x = this.game.width - (this.diagram.squareBox.width / 2) - (this.btn.width / 2); // just because I can and you can't
            this.switchParts();
            // reinitialize mcq
            var check = document.getElementsByClassName("check");
            for (var i = 0; i < check.length; i++) {
                check[i].innerHTML = "";
            }
        };
        Question.prototype.switchParts = function () {
            switch (_p) {
                case 0:
                    if (this.diagram.squareBox.resolve.visible) {
                        this.diagram.squareBox.resolve.visible = false;
                        mcq.style.display = "none";
                    }
                    break;
                case 1:
                    if (!this.diagram.squareBox.resolve.visible) {
                        this.diagram.squareBox.resolve.visible = true;
                        mcq.style.display = "none";
                    }
                    break;
                case 2:
                    if (this.diagram.squareBox.resolve.visible) {
                        this.diagram.vector[0].getRelativeAngle();
                        this.diagram.vector[0].drawCurve();
                        mcq.style.display = "inline";
                    }
                    break;
            }
        };
        Question.prototype.submit = function () {
            if (this.btn.label.text == "Submit") {
                if (this.checkAnswers()) {
                    this.diagram.squareBox.showAnswer(0, true);
                    this.btn.label.text = "Next";
                    return;
                }
                else {
                    this.diagram.squareBox.showAnswer(1, false);
                    return;
                }
            }
            if (this.btn.label.text == "Next") {
                _p++;
                if (_q == (sheet.question.length - 1) && _p > 2) {
                    this.game.state.start('Finish', true, false);
                    return;
                }
                if (_p > 2) {
                    _q++;
                    _p = 0;
                    this.diagram.destroyAll();
                    this.initialize();
                }
                part = sheet.question[_q].part[_p];
                divDetails.innerHTML = part.instruction;
                this.btn.label.text = "Submit";
                this.diagram.squareBox.hideAnswer();
                this.switchParts();
                return;
            }
        };
        Question.prototype.checkAnswers = function () {
            if (_p == 0) {
                if (this.part1()) {
                    return true;
                }
                else {
                    return false;
                }
            }
            if (_p == 1) {
                if (this.part2()) {
                    return true;
                }
                else {
                    return false;
                }
            }
            if (_p == 2) {
                if (this.part3()) {
                    return true;
                }
                else {
                    return false;
                }
            }
        };
        Question.prototype.part1 = function () {
            //  check for answers
            //  if any of the vectors has the same angle range
            //  return true and show correct
            //  if wrong
            //  return false and show wrong check mark
            if (this.diagram.vector.length <= 0) {
                console.log("vector length lesser than or = 0");
                return false;
            }
            if (this.diagram.vector.length != question.limit) {
                console.log("vector length  not = to part.answer length");
                return false;
            }
            var allCorrect = 0;
            if (this.diagram.vector.length > 0 || this.diagram.vector.length == part.answer.length) {
                for (var i = 0; i < this.diagram.vector.length; i++) {
                    for (var j = 0; j < part.answer.length; j++) {
                        if (part.answer[j].length > 0) {
                            if (this.diagram.vector[i].angle >= part.answer[j][0] && this.diagram.vector[i].angle <= part.answer[j][1]) {
                                console.log(this.diagram.vector[i].angle, "the vector angle", "answer is  within range and correct!");
                                allCorrect++;
                                break;
                            }
                        }
                        if (part.answer[j].constructor != Array) {
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
            }
            if (allCorrect == question.limit) {
                return true;
            }
            if (allCorrect < question.limit) {
                return false;
            }
        };
        Question.prototype.part2 = function () {
            var allCorrect = 0;
            for (var i = 0; i < this.diagram.vector.length; i++) {
                if (this.diagram.vector[i].group.x == part.answer[0] && this.diagram.vector[i].group.y == part.answer[1]) {
                    allCorrect++;
                }
            }
            if (allCorrect == question.limit) {
                return true;
            }
            if (allCorrect < question.limit) {
                return false;
            }
        };
        Question.prototype.part3 = function () {
            var selectedAnswer = document.getElementsByName("answer");
            var check = document.getElementsByClassName("check");
            var bool = false;
            for (var i = 0; i < selectedAnswer.length; i++) {
                if (part.answer == selectedAnswer[i].value) {
                    bool = true;
                    check[i].style.color = "#00FF00";
                    check[i].innerHTML = "✔";
                }
                else {
                    check[i].style.color = "#FF0000";
                    check[i].innerHTML = "✖";
                }
            }
            return bool;
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
            var bmd = game.make.bitmapData(width, height);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, width, height);
            bmd.ctx.fillStyle = '#ffffff';
            bmd.ctx.fill();
            bmd.ctx.strokeStyle = '#000000';
            bmd.ctx.stroke();
            _super.call(this, game, x, y, bmd);
            //game.add.sprite(x, y, bmd);
            this.anchor.setTo(1, 1);
            // resolve initialize
            this.resolve = game.make.sprite(-this.width, -this.height, "resolve");
            this.addChild(this.resolve);
            // circle initialize
            var circle = game.add.bitmapData(10, 10);
            circle.circle(5, 5, 5, '#000000');
            this.circle = game.make.sprite(-this.width / 2, (-this.height / 2) + 5, circle);
            this.circle.anchor.setTo(0.5, 0.5);
            this.circle.alpha = 0;
            this.addChild(this.circle);
            // result text initialize
            this.result = game.make.text(0, 0, "✖", { fill: '#00FF00', font: '48px Arial' });
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
        SquareBox.prototype.update = function () {
        };
        SquareBox.prototype.showAnswer = function (i, bool) {
            if (bool) {
                divDetails.innerHTML = part.correct;
            }
            switch (_p) {
                case 0:
                    this.result.scale.setTo(1, 1);
                    this.result.position.setTo(-this.width / 2, -this.height / 2);
                    this.result.y = Math.round(this.result.y);
                    this.result.x = Math.round(this.result.x);
                    break;
                case 1:
                    this.result.scale.setTo(0.8, 0.8);
                    this.result.position.setTo(-this.result.width / 2, -this.height + this.result.height / 2);
                    this.result.y = Math.round(this.result.y);
                    this.result.x = Math.round(this.result.x);
                    break;
                case 2:
                    this.result.scale.setTo(0, 0);
                    this.result.position.setTo(-this.result.width / 2, 0);
                    this.result.y = Math.round(this.result.y);
                    this.result.x = Math.round(this.result.x);
                    break;
            }
            this.result.visible = true;
            this.result.text = this.textString[i].text;
            this.result.fill = this.textString[i].fill;
        };
        SquareBox.prototype.hideAnswer = function () {
            this.result.visible = false;
        };
        return SquareBox;
    })(Phaser.Sprite);
    fbd.SquareBox = SquareBox;
})(fbd || (fbd = {}));
var fbd;
(function (fbd) {
    var Vector = (function (_super) {
        __extends(Vector, _super);
        function Vector(game, x, y, regionX, regionY, id) {
            // initialize the vectors and respective booleans yeah
            this.target = true;
            this.clone = false;
            this.id = id;
            this.bmd = game.make.bitmapData(game.width, game.height);
            this.bmdSprite = game.make.sprite(0, 0, this.bmd);
            this.bmdSprite.addChild(this);
            _super.call(this, game, x, y, "arrow-head");
            game.add.existing(this);
            this.bmd.ctx.strokeStyle = "black";
            this.startingPoint = new Phaser.Point(x, y);
            // click region initialize
            this.clickRegion = new Phaser.Rectangle(regionX, regionY, 100, 100);
            this.clickRegion.centerOn(regionX, regionY);
            this.startingPoint = new Phaser.Point(regionX, regionY);
            // arrow head initialize
            this.anchor.setTo(0.5, 0.5);
            this.inputEnabled = true;
            this.events.onInputDown.add(function () {
                this.target = true;
                if (_p == 0) {
                    this.drag();
                }
            }, this);
            this.events.onInputUp.add(function () {
            }, this);
            this.inside = this.clickRegion.contains(this.x, this.y);
            this.groupStick = game.add.bitmapData(game.width, game.height);
            this.groupStick.addToWorld();
            // create force labels
            this.label = game.make.text(0, 0, "", global_style);
            this.label.text = "";
            this.label.inputEnabled = true;
            this.label.events.onInputDown.add(function () {
                document.getElementById(inputBox.input[inputBox.id].name).style.display = "";
                inputBox.input[inputBox.id].dragged = false;
            }, this);
            // create Text angle 
            this.angleRelative = game.make.text(0, 0, "", global_style);
            this.unknown = game.make.text(0, 0, "?", global_style);
            this.addChild(this.unknown);
            this.unknown.visible = false;
            this.unknown.scale.setTo(1.5, 1.5);
            // Group them up baby
            this.group = game.add.group();
            this.group.add(this.bmdSprite);
            this.group.add(this);
            this.group.add(this.angleRelative);
            this.group.add(this.label);
            this.relative = new Phaser.Point(0, 0);
        }
        Vector.prototype.cloneBmd = function () {
            this.groupStick.draw(this.bmdSprite);
            this.groupStick.draw(this);
        };
        Vector.prototype.drawCurve = function () {
            var graphics = this.game.make.graphics(this.startingPoint.x, this.startingPoint.y);
            this.group.add(graphics);
            //  Our first arc will be a line only
            graphics.lineStyle(1, 0x000000);
            // graphics.arc(0, 0, 135, game.math.degToRad(0), game.math.degToRad(90), false);
            // this is from 0 to -90;
            if (this.angle <= 0 && this.angle >= -90) {
                graphics.arc(0, 0, 20, 0, this.rotation, true);
                return;
            }
            if (this.angle >= -180 && this.angle < -90) {
                graphics.arc(0, 0, 20, this.rotation, -3.14, true);
                return;
            }
            if (this.angle >= 0 && this.angle <= 90) {
                graphics.arc(0, 0, 20, 0, this.rotation, false);
                return;
            }
            if (this.angle < 180 && this.angle > 90) {
                graphics.arc(0, 0, 20, this.rotation, -3.14, false);
                return;
            }
        };
        Vector.prototype.getRelativeAngle = function () {
            this.unknown.visible = true;
            this.unknown.angle -= this.angle;
            this.unknown.x += this.width;
            if (this.angle == 0 || this.angle == -180) {
                this.angleRelative.text = "";
            }
            // right top side
            if ((this.angle < 0 && this.angle >= -90)) {
                this.angleRelative.text = String(Math.abs(this.angle));
                this.angleRelative.anchor.setTo(-2, 0.75);
            }
            // left top side
            if ((this.angle > -180 && this.angle < -90)) {
                var temp = 180 - Math.abs(this.angle);
                temp = this.rounder(temp);
                this.angleRelative.text = String(temp);
                this.angleRelative.anchor.setTo(3, 0.75);
            }
            // positive range
            // bottom right
            if (this.angle > 0 && this.angle <= 90) {
                this.angleRelative.text = String(Math.abs(this.angle));
                this.angleRelative.anchor.setTo(-3, -0.75);
            }
            // bottom left
            if (this.angle < 180 && this.angle > 90) {
                var temp = 180 - Math.abs(this.angle);
                temp = this.rounder(temp);
                this.angleRelative.text = String(temp);
                this.angleRelative.anchor.setTo(3, -0.75);
            }
            var angle = document.getElementsByClassName("angle");
            for (var i = 0; i < angle.length; i++) {
                angle[i].innerHTML = this.angleRelative.text;
            }
            this.angleRelative.position.setTo(this.startingPoint.x, this.startingPoint.y);
        };
        // check if inputs are at the left side so can push it to the left
        Vector.prototype.checkLeft = function () {
            if ((this.angle < 180 && this.angle > 90) || (this.angle > -180 && this.angle < -90)) {
                vectorOffset = 110;
            }
            else {
                vectorOffset = -10;
            }
        };
        Vector.prototype.checkInputForce = function () {
            if (this.id == inputBox.id) {
                this.label.text = String(inputBox.input[inputBox.id].inputValues);
                this.label.y = this.y;
            }
            if ((this.angle < 180 && this.angle > 90) || (this.angle > -180 && this.angle < -90)) {
                this.label.x = this.x - this.label.width - 10;
            }
            else {
                this.label.x = this.x + 10;
            }
        };
        Vector.prototype.update = function () {
            if (_p == 1 && !this.clone) {
                this.clone = true;
                this.cloneBmd();
            }
            if (this.game.input.mousePointer.isDown && this.target && _p == 0) {
                this.drag();
            }
            if (!this.game.input.mousePointer.isDown) {
                this.target = false;
            }
            if (this.game.input.mousePointer.isDown && this.target && _p == 1) {
                this.group.x = this.rounder(this.game.input.x - this.startingPoint.x - this.relative.x);
                this.group.y = this.rounder(this.game.input.y - this.startingPoint.y - this.relative.y);
            }
            this.checkInputForce();
        };
        Vector.prototype.getAngle = function (x1, y1, x2, y2) {
            var rad = Phaser.Math.angleBetween(x1, y1, x2, y2);
            var deg = Phaser.Math.radToDeg(rad);
            var round = this.rounder(deg);
            return round;
        };
        Vector.prototype.drag = function () {
            this.inside = this.clickRegion.contains(this.x, this.y);
            if (this.x > 0) {
                inputBox.name = this.id;
                this.inputBox = this.id;
                inputBox.id = this.id;
                //if user click on the region god damn it
                if (!this.inside) {
                    this.inside = this.clickRegion.contains(this.game.input.x, this.game.input.y);
                }
                if (this.inside) {
                    this.x = this.rounder(this.game.input.x);
                    this.y = this.rounder(this.game.input.y);
                    if (this.y == 5 || this.y <= 0) {
                        this.y = 10;
                    }
                    this.position.setTo(this.rounder(this.x), this.rounder(this.y));
                    this.bmd.clear();
                    this.bmd.ctx.beginPath();
                    this.bmd.ctx.moveTo(this.startingPoint.x, this.startingPoint.y);
                    this.bmd.ctx.lineTo(this.rounder(this.x), this.rounder(this.y));
                    this.bmd.ctx.lineWidth = 2;
                    this.bmd.ctx.stroke();
                    this.bmd.ctx.closePath();
                    this.bmd.render();
                    this.angle = this.getAngle(this.startingPoint.x, this.startingPoint.y, this.rounder(this.x), this.rounder(this.y));
                    document.getElementById(inputBox.input[inputBox.id].name).style.display = "none";
                }
                this.checkLeft();
                //console.log("RELATIVE LENGTHS", this.rounder(this.x) - this.startingPoint.x, this.rounder(this.y) - this.startingPoint.y);
                this.relative.setTo(this.rounder(this.x) - this.startingPoint.x, this.rounder(this.y) - this.startingPoint.y);
            }
        };
        Vector.prototype.rounder = function (x, pow) {
            if (pow === void 0) { pow = 5; }
            return Math.ceil(x / pow) * pow;
        };
        return Vector;
    })(Phaser.Sprite);
    fbd.Vector = Vector;
})(fbd || (fbd = {}));
//# sourceMappingURL=game.js.map