var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SSMAT;
(function (SSMAT) {
    var AdvancedMenu = (function (_super) {
        __extends(AdvancedMenu, _super);
        function AdvancedMenu() {
            _super.apply(this, arguments);
        }
        AdvancedMenu.prototype.create = function () {
            Parse.User.logOut();
            //static settings 
            this.tileHeight = 30; // set the button height limit according to the tile
            this.clockTime = 0;
            this.noGridCompleted = 0;
            this.game.scale.setResizeCallback(this.setResize, this);
            this.style = { font: "20px Courier", fill: "#FFFFFF", wordWrap: false, wordWrapWidth: 0, align: "center" };
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.score = "";
            this.gravity = 9.81;
            this.dt = 0.0833333333333333;
            this.t = 0;
            this.dropped = false;
            this.started = false;
            this.arrow = [];
            // ground tiles
            this.tiler = this.game.add.tileSprite(0, this.world.height - this.tileHeight, this.game.width, this.game.height, 'tile');
            this.tiler.alpha = 1;
            this.game.physics.arcade.enable(this.tiler);
            this.tiler.body.immovable = true;
            this.tiler.body.allowGravity = false;
            this.grad = this.game.add.sprite(0, 0, "gradient");
            // the image painting itself;
            // Math.floor(Math.random() * (max - min + 1)) + min;
            var randomImage = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
            var stringUrl = 'pic' + randomImage;
            this.image = this.game.add.image(0, 0, stringUrl);
            this.image.width = 450;
            this.image.height = 253;
            var randomMin = (this.game.height / 2) - (this.image.height / 2) - 100;
            var randomMax = (this.game.height) - this.image.height - 200;
            this.image.position.x = (this.game.width / 2) - (this.image.width / 2);
            this.image.position.y = Math.floor(Math.random() * (randomMax - randomMin + 1)) + randomMin;
            this.grad.y = this.image.position.y - 14;
            this.grad.x = this.image.position.x - 14;
            this.image.visible = false;
            // use the bitmap data as the texture for the sprite
            // generate the grid lines
            var distributeWidth = this.image.position.x;
            var distributeHeight = this.image.position.y;
            this.sprite = [];
            this.spriteGroup = this.game.add.group();
            for (var i = 0; i < 2; i++) {
                this.sprite[i] = [];
                distributeWidth = this.image.position.x;
                for (var j = 0; j < 3; j++) {
                    this.sprite[i][j] = new SSMAT.Grid(this.game, distributeWidth, distributeHeight);
                    distributeWidth += this.sprite[i][j].width - 1;
                    this.sprite[i][j].inputEnabled = true;
                    this.sprite[i][j].main = this;
                    this.spriteGroup.addChild(this.sprite[i][j]);
                    // # REMOVE THIS IF DEPLOYING //
                    this.sprite[i][j].events.onInputDown.add(this.testClick, this);
                }
                distributeHeight += 126.5;
            }
            //this.game.input.onDown.add(this.testClick2, this);
            // this is to initialize the main painter
            this.painter = new SSMAT.Painter(this.game, this.world.centerX, this.game.height, 90, this.gravity);
            this.painter.y -= this.painter.height + this.tileHeight;
            //this.painter.y = 509.1707368654838;
            this.painter.anchor.setTo(0.5, 0);
            this.game.physics.arcade.enable(this.painter);
            this.stage.smoothed = false;
            this.game.stage.smoothed = false;
            // adding the wheels for the pulley
            this.wheelGroup = this.game.add.group();
            this.wheel = this.add.sprite(0, 0, 'wheel', 0);
            this.wheelGroup.addChild(this.wheel);
            this.wheel = this.add.sprite(0, 0, 'wheel', 0);
            this.wheelGroup.addChild(this.wheel);
            this.wheelGroup.getChildAt(0).x = this.grad.x - this.wheel.width;
            this.wheelGroup.getChildAt(1).x = this.grad.x + this.grad.width;
            // adding the tons for the pulley (0 for left, 1 for right)
            // tons2 is the weights that we are going to add from the button
            this.graphics = this.add.graphics(0, 0);
            this.tons = [];
            this.tons2 = [];
            this.tons[0] = new SSMAT.Tons(this.game, this.wheelGroup.getChildAt(0).x, this.wheelGroup.getChildAt(0).y + this.wheel.height, 10, this.gravity, "left");
            this.tons[1] = new SSMAT.Tons(this.game, this.wheelGroup.getChildAt(1).x + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height, 10, this.gravity, "right");
            this.tons[0].main = this;
            this.tons[1].main = this;
            this.tons[0].name = "left";
            this.tons[1].name = "right";
            this.game.physics.arcade.enable([this.tons[0], this.tons[1]]);
            this.tons[0].body.allowGravity = false;
            this.tons[1].body.allowGravity = false;
            // the pulley "strings"
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round(this.tons[0].x), Math.round(this.tons[0].y));
            this.graphics.lineTo(Math.round(this.tons[0].x), Math.round(this.wheelGroup.getChildAt(0).y + this.wheel.height / 2));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round((this.tons[0].x) + this.wheel.width), Math.round(this.wheelGroup.getChildAt(0).y + this.wheel.height / 2));
            this.graphics.lineTo(Math.round(this.painter.x), Math.round(this.painter.y));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.lineTo(Math.round(this.painter.x), Math.round(this.painter.y));
            this.graphics.lineTo(Math.round((this.tons[1].x) - this.wheel.width), Math.round(this.wheelGroup.getChildAt(1).y + this.wheel.height / 2));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round(this.tons[1].x), Math.round(this.wheelGroup.getChildAt(1).y + this.wheel.height / 2));
            this.graphics.lineTo(Math.round(this.tons[1].x), Math.round(this.tons[1].y));
            // tweening the main intro screen
            this.button = new SSMAT.ButtonLabel(this.game, this.game.world.width - 82 - 100, this.game.world.height - this.tileHeight, 'button', "ADD WEIGHT", this.addWeight, this, 0, 0, 1, 0);
            this.button.y -= this.button.height;
            this.button.anchor.setTo(0.5, 0);
            this.help = new SSMAT.ButtonLabel(this.game, this.button.x + this.button.width + 1, this.button.y, 'help', "TIPS", this.tips, this, 0, 0, 1, 0);
            this.help.anchor.setTo(0.5, 0);
            this.resetbtn = new SSMAT.ButtonLabel(this.game, this.help.x + this.button.width + 1, this.button.y, 'reset', "RESET!", this.reset, this, 0, 0, 1, 0);
            this.resetbtn.anchor.setTo(0.5, 0);
            this.vector = new SSMAT.ButtonLabel(this.game, this.resetbtn.x + this.button.width + 1, this.button.y, 'vector', "HIDE DETAILS!", this.hide, this, 0, 0, 1, 0);
            this.vector.anchor.setTo(0.5, 0);
            // wind
            this.wind = this.game.rnd.integerInRange(25, 100);
            //this.wind = 51;
            var windAni = Math.abs(this.wind);
            var randomScale = Math.round(Math.random()) * 2 - 1;
            console.log(randomScale);
            this.wind = this.wind * randomScale;
            this.windText = this.game.add.text(0, 0, "Wind: " + this.wind + "N", global_style);
            this.windText.setShadow(1, 1, 'rgba(0,0,0,1)', 0.1, true, true);
            this.windText.smoothed = false;
            this.flag = this.add.sprite(0, 0, "flag", 1);
            this.flag.anchor.setTo(0.5, 1);
            this.flag.x = 200;
            this.flag.y = this.world.height - this.tileHeight;
            this.windText.position.setTo(Math.round(this.flag.x - this.windText.width / 2), this.flag.y - this.flag.height - this.windText.height);
            this.flag.animations.add('wave');
            this.flag.animations.play('wave', windAni / 4, true);
            this.flag.scale.x = randomScale;
            // calculations to make the system in an equilibrium
            this.tons[1].angleA = Phaser.Math.angleBetween(this.painter.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, this.painter.y);
            this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, this.painter.x, this.painter.y);
            this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100;
            this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100;
            this.tons[0].convertAngle();
            this.tons[1].convertAngle();
            // equation (1) to find force of Beta
            var w = Math.round((this.wind / Math.cos(this.tons[0].angleA)) * 1000) / 1000; // (1)
            var f2 = Math.round(((Math.cos(this.tons[1].angleA) + this.wind) / Math.cos(this.tons[0].angleA)) * 1000) / 1000; // (2)
            var f2force1 = this.painter.force - (w * Math.sin(this.tons[1].angleA));
            var f2force2 = (f2 * Math.sin(this.tons[0].angleA)) + Math.sin(this.tons[1].angleA);
            this.tons[1].force = (f2force1 / f2force2);
            console.log(w, "wind", f2, "F2", f2force1, "f2force1", f2force2, "f2force2", (f2force1 / f2force2), "f2force1 / f2force2");
            // equation (2) to find force of alpha
            this.tons[0].force = Math.round(((f2 * this.tons[1].force) + w) * 10) / 10;
            this.tons[0].mass = Math.round((this.tons[0].force / this.gravity) * 10) / 10;
            this.tons[1].mass = Math.round((this.tons[1].force / this.gravity) * 10) / 10;
            this.tons[0]._dx = this.tons[0].position.clone();
            this.tons[1]._dx = this.tons[1].position.clone();
            // setting the correct answers for each grid dynamically
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 3; j++) {
                    var tempPoint = new Phaser.Point(this.sprite[i][j].x + this.sprite[i][j].width / 2, this.sprite[i][j].y + (this.sprite[i][j].height / 2) - (this.painter.height / 2));
                    this.sprite[i][j].painterPos.setTo(this.sprite[i][j].x + this.sprite[i][j].width / 2, this.sprite[i][j].y + (this.sprite[i][j].height / 2) - (this.painter.height / 2));
                    this.sprite[i][j].angleB = Phaser.Math.angleBetween(tempPoint.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, tempPoint.y);
                    this.sprite[i][j].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, tempPoint.x, tempPoint.y);
                    this.sprite[i][j].angleB = Math.round(this.sprite[i][j].angleB * 100) / 100;
                    this.sprite[i][j].angleA = Math.round(this.sprite[i][j].angleA * 100) / 100;
                    this.sprite[i][j].angleA = Math.round(Phaser.Math.radToDeg(this.sprite[i][j].angleA) * 100) / 100;
                    this.sprite[i][j].angleB = Math.round(Phaser.Math.radToDeg(this.sprite[i][j].angleB) * 100) / 100;
                    this.sprite[i][j].setAnswers(2);
                    console.log(this.sprite[i][j].answerA, this.sprite[i][j].answerB);
                }
            }
            // Timer for scoring purposes
            this.timer = this.game.add.text(this.world.centerX, 20, "TIME\n00:00:00", global_style);
            this.timer.align = "center";
            this.timer.setShadow(1, 1, 'rgba(0,0,0,1)', 0.1);
            this.timer.anchor.setTo(0.5, 0);
            this.timer.x = Math.round(this.timer.x);
            this.timer.y = Math.round(this.timer.y);
            this.world.alpha = 0;
            var worldTween = this.add.tween(this.world).to({ alpha: 1 }, 1000, Phaser.Easing.Exponential.InOut, true);
            worldTween.onComplete.addOnce(function () {
                this.image.visible = true;
                this.painter.started = true;
                this.tons[0].started = true;
                this.tons[1].started = true;
                this.started = true;
                this.startGame();
            }, this);
            this.tiler.alpha = 1;
            this.tons[0].dmass = this.tons[0].mass;
            this.tons[1].dmass = this.tons[1].mass;
            this.createArrows();
            // escape timer
            var ESCAPE = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
            this.escape = new SSMAT.Exit(this.game, this.world.centerX, this.world.centerY);
            this.escape.visible = false;
            this.escape.toggleVisibility();
            ESCAPE.onDown.add(function () {
                if (this.escape.visible) {
                    this.escape.visible = false;
                    this.escape.toggleVisibility();
                }
                else {
                    this.escape.visible = true;
                    this.escape.toggleVisibility();
                }
            }, this);
            // adding of game timer
            this.gameTimer = this.game.time.create(false);
        };
        AdvancedMenu.prototype.setResize = function () {
            var randomMin = (this.game.height / 2) - (this.image.height / 2) - 100;
            var randomMax = (this.game.height) - this.image.height - 200;
            this.image.position.x = (this.game.width / 2) - (this.image.width / 2);
            this.image.position.y = Math.floor(Math.random() * (randomMax - randomMin + 1)) + randomMin;
            this.tiler.position.setTo(0, this.game.height - this.tileHeight);
            this.tiler.width = this.game.width;
            this.grad.y = this.image.position.y - 14;
            this.grad.x = this.image.position.x - 14;
            this.wheelGroup.getChildAt(0).x = this.grad.x - this.wheel.width;
            this.wheelGroup.getChildAt(1).x = this.grad.x + this.grad.width;
            this.flag.position.setTo(200, this.world.height - this.tileHeight);
            this.windText.position.setTo(Math.round(this.flag.x - this.windText.width / 2), this.flag.y - this.flag.height - this.windText.height);
            this.timer.position.setTo(this.world.centerX, 20);
            this.tons[0].position.setTo(this.wheelGroup.getChildAt(0).x, this.wheelGroup.getChildAt(0).y + this.wheel.height);
            this.tons[1].position.setTo(this.wheelGroup.getChildAt(1).x + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height);
            this.button.position.setTo(this.game.width - 82 - 100, this.game.height - this.tileHeight - this.button.height);
            this.help.position.setTo(this.button.x + this.button.width + 1, this.button.y);
            this.resetbtn.position.setTo(this.help.x + this.button.width + 1, this.button.y);
            this.vector.position.setTo(this.resetbtn.x + this.button.width + 1, this.button.y);
            this.button.updatePosition();
            this.help.updatePosition();
            this.resetbtn.updatePosition();
            this.vector.updatePosition();
            this.reset();
            var distributeWidth = this.image.position.x;
            var distributeHeight = this.image.position.y;
            for (var i = 0; i < 2; i++) {
                distributeWidth = this.image.position.x;
                for (var j = 0; j < 3; j++) {
                    this.sprite[i][j].position.setTo(distributeWidth, distributeHeight);
                    distributeWidth += this.sprite[i][j].width - 1;
                    var tempPoint = new Phaser.Point(this.sprite[i][j].x + this.sprite[i][j].width / 2, this.sprite[i][j].y + (this.sprite[i][j].height / 2) - (this.painter.height / 2));
                    this.sprite[i][j].angleB = Phaser.Math.angleBetween(tempPoint.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, tempPoint.y);
                    this.sprite[i][j].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, tempPoint.x, tempPoint.y);
                    this.sprite[i][j].angleB = Math.round(this.sprite[i][j].angleB * 100) / 100;
                    this.sprite[i][j].angleA = Math.round(this.sprite[i][j].angleA * 100) / 100;
                    this.sprite[i][j].angleA = Math.round(Phaser.Math.radToDeg(this.sprite[i][j].angleA) * 100) / 100;
                    this.sprite[i][j].angleB = Math.round(Phaser.Math.radToDeg(this.sprite[i][j].angleB) * 100) / 100;
                    this.sprite[i][j].setAnswers(1);
                    console.log(this.sprite[i][j].answerA, this.sprite[i][j].answerB);
                }
                distributeHeight += 126.5;
            }
        };
        AdvancedMenu.prototype.hide = function () {
            for (var i = 0; i < this.arrow.length; i++) {
                this.arrow[i].visible = !this.arrow[i].visible;
                if (i < 2) {
                    this.arrow[i].components[0].visible = this.arrow[i].visible;
                    this.arrow[i].components[1].visible = this.arrow[i].visible;
                }
            }
        };
        AdvancedMenu.prototype.createArrows = function () {
            var point1 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            var point2 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var arrow0Point = new Phaser.Point((point1.x + this.painter.x) / 2, (point1.y + this.painter.y) / 2);
            var arrow1Point = new Phaser.Point((point2.x + this.painter.x) / 2, (point2.y + this.painter.y) / 2);
            this.arrow[0] = new SSMAT.Arrow(this.game, arrow0Point.x, arrow0Point.y, "arrow-green", -1, true);
            this.arrow[0].rotation = this.tons[0].angleA;
            //
            this.arrow[1] = new SSMAT.Arrow(this.game, arrow1Point.x, arrow1Point.y, "arrow-blue", 1, true);
            this.arrow[1].rotation = -this.tons[1].angleA;
            //
            this.arrow[2] = new SSMAT.Arrow(this.game, this.painter.x, this.painter.y + this.painter.height, "arrow-red", 1, false);
            this.arrow[2].rotation = 1.57079633;
            this.arrow[2].main = this;
            this.hide();
        };
        AdvancedMenu.prototype.resetArrows = function () {
            var point1 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            var point2 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var arrow0Point = new Phaser.Point((point1.x + this.painter.x) / 2, (point1.y + this.painter.y) / 2);
            var arrow1Point = new Phaser.Point((point2.x + this.painter.x) / 2, (point2.y + this.painter.y) / 2);
            this.arrow[0].position.copyFrom(arrow0Point);
            this.arrow[0].rotation = this.tons[0].angleA;
            //
            this.arrow[1].position.copyFrom(arrow1Point);
            this.arrow[1].rotation = -this.tons[1].angleA;
            //
            this.arrow[2].position.copyFrom(this.painter.position);
            this.arrow[2].y += this.painter.height;
        };
        AdvancedMenu.prototype.moveArrows = function () {
            var point1 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            var point2 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var arrow0Point = new Phaser.Point((point1.x + this.painter.x) / 2, (point1.y + this.painter.y) / 2);
            var arrow1Point = new Phaser.Point((point2.x + this.painter.x) / 2, (point2.y + this.painter.y) / 2);
            this.arrow[0].position.copyFrom(arrow0Point);
            //this.arrow[0].rotation = this.tons[0].angleA;
            //
            this.arrow[1].position.copyFrom(arrow1Point);
            //this.arrow[1].rotation = -this.tons[1].angleA;
            //
            this.arrow[2].position.copyFrom(this.painter.position);
            this.arrow[2].y += this.painter.height;
        };
        AdvancedMenu.prototype.startGame = function () {
            this.gameTimer = this.game.time.create(false);
            this.gameTimer.start();
            //this.game.time.reset();
        };
        AdvancedMenu.prototype.update = function () {
            //this.game.physics.arcade.collide(this.tiler, [this.tons[0], this.tons[1], this.painter]);
            if (this.started) {
                this.updateTimer();
            }
        };
        AdvancedMenu.prototype.checkFinished = function () {
            if (this.noGridCompleted == 6) {
                this.started = false;
                // moving up the fading background's z-index
                this.black = this.add.sprite(0, 0, "black");
                this.black.alpha = 0;
                // adding the global score;
                document.getElementById("scoretime").innerHTML = "Your time: " + this.score;
                // moving up the final image 
                var test = this.image.key;
                var yPos = this.image.position.clone();
                this.image.destroy(true);
                this.image = this.game.add.image(yPos.x, yPos.y, test);
                this.image.width = 450;
                this.image.height = 253;
                var newPos = (this.game.height / 2) - (this.image.height / 2) - 100;
                this.add.tween(this.image).to({ y: 0, x: 0, width: this.game.width, height: this.game.height }, 1000, Phaser.Easing.Exponential.Out, true);
                var inputadmin_no = document.getElementById("inputfield");
                inputadmin_no.style.opacity = '0';
                document.getElementById("inputfield").style.display = "inline";
                this.add.tween(this.timer).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.Out, true);
                var tween = this.add.tween(this.black).to({ alpha: 1 }, 1000, Phaser.Easing.Exponential.Out, true);
                tween.onUpdateCallback(function () {
                    inputadmin_no.style.opacity = String(this.black.alpha);
                }, this);
                tween.onComplete.addOnce(function () {
                    inputadmin_no.style.opacity = String(this.black.alpha);
                    this.game.state.start('GameOver', true, false, this.score, this.clockTime, this.image);
                }, this);
            }
        };
        AdvancedMenu.prototype.updateTimer = function () {
            var hours = Math.floor(this.gameTimer.seconds / 3600) % 24;
            var minutes = Math.floor(this.gameTimer.seconds / 60) % 60;
            var seconds = Math.floor(this.gameTimer.seconds) % 60;
            this.clockTime = Math.round(this.gameTimer.seconds * 100) / 100;
            //var hours = Math.floor(this.game.time.totalElapsedSeconds() / 3600) % 24;
            //var minutes = Math.floor(this.game.time.totalElapsedSeconds() / 60) % 60;
            //var seconds = Math.floor(this.game.time.totalElapsedSeconds()) % 60;
            //this.clockTime = Math.round(this.game.time.totalElapsedSeconds() * 100) / 100;
            var seconds1 = String(seconds);
            var minutes1 = String(minutes);
            var hours1 = String(hours);
            //If any of the digits becomes a single digit number, pad it with a zero
            if (seconds < 10) {
                seconds1 = '0' + seconds;
            }
            if (minutes < 10) {
                minutes1 = '0' + minutes;
            }
            if (hours < 10) {
                hours1 = '0' + hours;
            }
            this.score = hours1 + ":" + minutes1 + ":" + seconds1;
            this.timer.text = "TIME\n" + hours1 + ":" + minutes1 + ":" + seconds1; // timer height is 40;
        };
        AdvancedMenu.prototype.paintTheLines = function (p1, t) {
            this.moveArrows();
            var ktemp = 0;
            this.graphics.clear();
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round(this.tons[0].x), Math.round(this.tons[0].y));
            this.graphics.lineTo(Math.round(this.tons[0].x), Math.round(this.wheelGroup.getChildAt(0).y + this.wheel.height / 2));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round((this.tons[0].x) + this.wheel.width), Math.round(this.wheelGroup.getChildAt(0).y + this.wheel.height / 2));
            this.graphics.lineTo(Math.round(this.painter.x), Math.round(this.painter.y));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.lineTo(Math.round(this.painter.x), Math.round(this.painter.y));
            this.graphics.lineTo(Math.round((this.tons[1].x) - this.wheel.width), Math.round(this.wheelGroup.getChildAt(1).y + this.wheel.height / 2));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round(this.tons[1].x), Math.round(this.wheelGroup.getChildAt(1).y + this.wheel.height / 2));
            this.graphics.lineTo(Math.round(this.tons[1].x), Math.round(this.tons[1].y));
            if (t == 0) {
                ktemp = 1;
            }
            if (t == 1) {
                ktemp = 0;
            }
            for (var i = 0; i < this.tons[ktemp].ton.length; i++) {
                this.tons[ktemp].ton[i].x = this.tons[ktemp].x;
                //this.tons[ktemp].ton[i].inputEnabled = false;
                if (i == 0) {
                    this.tons[ktemp].ton[i].y = this.tons[ktemp].y + this.tons[ktemp].height;
                }
                else {
                    this.tons[ktemp].ton[i].y = this.tons[ktemp].y + (this.tons[ktemp].height * (i + 1));
                }
            }
            for (i = 0; i < p1.ton.length; i++) {
                p1.ton[i].x = p1.x;
                p1.ton[i].inputEnabled = false;
                if (i == 0) {
                    p1.ton[i].y = p1.y + p1.height;
                }
                else {
                    p1.ton[i].y = p1.y + (p1.height * (i + 1));
                }
            }
            if (p1.ton.length != 0) {
                p1.ton[p1.ton.length - 1].inputEnabled = true;
                p1.ton[p1.ton.length - 1].events.onDragStop.add(this.removeWeight, this);
                p1.ton[p1.ton.length - 1].nT = t;
            }
        };
        // Red button fucntion
        AdvancedMenu.prototype.addWeight = function () {
            var mass = prompt("Please enter the weight/mass:", "0");
            if (Number(mass) > 0 || Number(mass) < 0) {
                var l = this.tons2.length;
                if (l < 5 && l >= 0) {
                    this.tons2[l] = new SSMAT.Tons(this.game, this.button.x - this.button.width - 10, this.game.world.height - this.tileHeight - this.tons[0].height, Number(mass), this.gravity, "add");
                    this.game.physics.arcade.enable(this.tons2[l]);
                    this.tons2[l].body.allowGravity = false;
                    this.tons2[l].inputEnabled = true;
                    this.tons2[l].visible = true;
                    this.tons2[l].input.enableDrag();
                    this.tons2[l].events.onDragStop.add(this.stopDrag, this);
                    this.tons2[l]._dx = this.tons2[0].position.clone();
                    this.tons2[l].anchor.setTo(0.5, 0);
                    if (l != 0) {
                        this.tons2[l].x = this.tons2[l - 1].x - this.tons2[l - 1].width;
                        this.tons2[l - 1].inputEnabled = false;
                        this.tons2[l - 1].events.onDragStop.remove(this.stopDrag, this);
                        this.tons2[l - 1].input.disableDrag();
                    }
                }
            }
        };
        AdvancedMenu.prototype.testClick2 = function () {
            this.painter.x = this.game.input.x;
            this.painter.y = this.game.input.y;
            this.tons[1].angleA = Phaser.Math.angleBetween(this.painter.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, this.painter.y);
            this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, this.painter.x, this.painter.y);
            this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100;
            this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100;
            this.tons[1].convertAngle();
            this.tons[0].convertAngle();
            // equation (1) to find force of Beta
            var w = Math.round((this.wind / Math.cos(this.tons[0].angleA)) * 1000) / 1000; // (1)
            var f2 = Math.round((Math.cos(this.tons[1].angleA) / Math.cos(this.tons[0].angleA)) * 1000) / 1000; // (2)
            var f2force1 = this.painter.force - (w * Math.sin(this.tons[1].angleA));
            var f2force2 = (f2 * Math.sin(this.tons[0].angleA)) + Math.sin(this.tons[1].angleA);
            this.tons[1].force = (f2force1 / f2force2);
            console.log(w, "wind", f2, "F2", f2force1, "f2force1", f2force2, "f2force2", (f2force1 / f2force2), "f2force1 / f2force2");
            // equation (2) to find force of alpha
            this.tons[0].force = Math.round(((f2 * this.tons[1].force) + w) * 10) / 10;
            this.tons[0].mass = Math.round((this.tons[0].force / this.gravity) * 10) / 10;
            this.tons[1].mass = Math.round((this.tons[1].force / this.gravity) * 10) / 10;
            this.tons[0]._dx = this.tons[0].position.clone();
            this.tons[1]._dx = this.tons[1].position.clone();
            this.paintTheLines(this.tons[0], 0);
            this.calcAll();
        };
        AdvancedMenu.prototype.testClick = function (p1) {
            this.painter.x = p1.x + p1.width / 2;
            this.painter.y = p1.y + p1.height / 2 - this.painter.height / 2;
            this.tons[1].angleA = Phaser.Math.angleBetween(this.painter.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, this.painter.y);
            this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, this.painter.x, this.painter.y);
            this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100;
            this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100;
            this.tons[1].convertAngle();
            this.tons[0].convertAngle();
            // equation (1) to find force of Beta
            var w = Math.round((this.wind / Math.cos(this.tons[0].angleA)) * 1000) / 1000; // (1)
            var f2 = Math.round((Math.cos(this.tons[1].angleA) / Math.cos(this.tons[0].angleA)) * 1000) / 1000; // (2)
            var f2force1 = this.painter.force - (w * Math.sin(this.tons[1].angleA));
            var f2force2 = (f2 * Math.sin(this.tons[0].angleA)) + Math.sin(this.tons[1].angleA);
            this.tons[1].force = (f2force1 / f2force2);
            console.log(w, "wind", f2, "F2", f2force1, "f2force1", f2force2, "f2force2", (f2force1 / f2force2), "f2force1 / f2force2");
            // equation (2) to find force of alpha
            this.tons[0].force = Math.round(((f2 * this.tons[1].force) + w) * 10) / 10;
            this.tons[0].mass = Math.round((this.tons[0].force / this.gravity) * 10) / 10;
            this.tons[1].mass = Math.round((this.tons[1].force / this.gravity) * 10) / 10;
            this.tons[0]._dx = this.tons[0].position.clone();
            this.tons[1]._dx = this.tons[1].position.clone();
            this.paintTheLines(this.tons[0], 0);
            this.calcAll();
        };
        // Yellow button function
        AdvancedMenu.prototype.tips = function () {
            var s = [];
            s[0] = "Did you know that you can input negative values to the Tons?";
            s[1] = "If you are stuck, press the green button to reset the pulleys!";
            s[2] = "Hover over to the grey board for the respective angles on each grid!";
            s[3] = "Remember your old friend, TOA CAH SOH?";
            s[4] = "The pulley system is in equilibrium, so every time you add a weight at either side, it will move to the new equilibrium position!";
            s[5] = "Static equilibrium means the sum of the net forces must equal to 0, ring any bell?";
            var no = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
            alert(s[no]);
        };
        // Green button function
        AdvancedMenu.prototype.reset = function () {
            this.painter.x = this.game.world.centerX;
            this.painter.y = this.game.height - (this.painter.height + this.tileHeight);
            this.tons[0].y = this.tons[0]._dx.y;
            this.tons[1].y = this.tons[1]._dx.y;
            this.tons[1].angleA = Phaser.Math.angleBetween(this.painter.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, this.painter.y);
            this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, this.painter.x, this.painter.y);
            this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100;
            this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100;
            this.tons[1].convertAngle();
            this.tons[0].convertAngle();
            var temp2 = Math.round((Math.cos(this.tons[0].angleA) / Math.cos(this.tons[1].angleA)) * 1000) / 1000; // Tons1 = Cos(Ton0.angle) / Cos(Ton1.Angle)
            var temp = Math.round((temp2 * (Math.sin(this.tons[1].angleA)) + Math.sin(this.tons[0].angleA)) * 1000) / 1000;
            this.tons[0].force = Math.round((this.painter.force / temp) * 10) / 10;
            this.tons[1].force = Math.round((this.tons[0].force * temp2) * 10) / 10;
            this.tons[0].mass = Math.round((this.tons[0].force / this.gravity) * 10) / 10;
            this.tons[1].mass = Math.round((this.tons[1].force / this.gravity) * 10) / 10;
            this.calcAll();
            this.graphics.clear();
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(this.tons[0].x, this.tons[0].y);
            this.graphics.lineTo(this.tons[0].x, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            this.graphics.lineTo(this.painter.x, this.painter.y);
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(this.painter.x, this.painter.y);
            this.graphics.lineTo((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(this.tons[1].x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            this.graphics.lineTo(this.tons[1].x, this.tons[1].y);
            this.tons[0].clearTon();
            this.tons[1].clearTon();
            this.resetArrows();
        };
        AdvancedMenu.prototype.removeWeight = function (p1) {
            var i = 0;
            if (p1.nT == 0) {
                i = 1;
            }
            if (p1.nT == 1) {
                i = 0;
            }
            if (this.game.physics.arcade.overlap(p1, this.tons[i])) {
                p1.position.x = this.tons[i].x;
                p1.position.y = this.tons[i].y + this.tons[i].height;
                this.tons[p1.nT].mass -= p1.mass;
                this.tons[p1.nT].calcForce();
                this.tons[p1.nT].ton.pop();
                if (this.tons[p1.nT].ton.length != 0) {
                    this.tons[p1.nT].ton[this.tons[p1.nT].ton.length - 1].inputEnabled = true;
                    this.tons[p1.nT].ton[this.tons[p1.nT].ton.length - 1].events.onDragStop.add(this.removeWeight, this);
                }
                //this.tons[i].dmass = this.tons[i].mass
                this.tons[i].mass += p1.mass;
                this.tons[i].ton.push(p1);
                p1.events.onDragStop.remove(this.stopDrag, this);
                //p1.destroy();
                this.movePainter(i, true, p1);
                //the pop() method removes the last element of an array
                return;
            }
            if (!this.game.physics.arcade.overlap(p1, this.tons[p1.nT])) {
                if (this.tons[p1.nT].ton.length != 0) {
                    this.tons[p1.nT].ton[this.tons[p1.nT].ton.length - 1].inputEnabled = true;
                    this.tons[p1.nT].ton[this.tons[p1.nT].ton.length - 1].events.onDragStop.add(this.removeWeight, this);
                }
                //this.tons[p1.nT].dmass = this.tons[p1.nT].mass
                this.tons[p1.nT].mass -= p1.mass;
                this.tons[p1.nT].calcForce();
                this.tons[p1.nT].ton.pop();
                p1.destroy();
                this.movePainter(p1.nT, false, p1);
                return;
            }
        };
        AdvancedMenu.prototype.stopDrag = function (p1) {
            for (var i = 0; i < 2; i++) {
                if (!this.game.physics.arcade.overlap(p1, this.tons[i])) {
                    p1.position.copyFrom(p1._dx);
                }
                if (this.game.physics.arcade.overlap(p1, this.tons[i])) {
                    p1.position.x = this.tons[i].x;
                    p1.position.y = this.tons[i].y + this.tons[i].height;
                    this.tons[i].mass += p1.mass;
                    p1.percent = ((p1.mass + this.tons[i].dmass) - this.tons[i].dmass) / this.tons[i].dmass;
                    this.tons[i].ton.push(p1);
                    p1.events.onDragStop.remove(this.stopDrag, this);
                    //p1.destroy();
                    this.movePainter(i, true, p1);
                    this.tons2.pop(); //the pop() method removes the last element of an array
                    if (this.tons2.length != 0) {
                        this.tons2[this.tons2.length - 1].inputEnabled = true;
                        this.tons2[this.tons2.length - 1].input.enableDrag();
                        this.tons2[this.tons2.length - 1].events.onDragStop.add(this.stopDrag, this);
                    }
                    break;
                }
            }
        };
        AdvancedMenu.prototype.checkAnswers = function () {
            var array = [];
            array[0] = false;
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 3; j++) {
                    if (this.sprite[i][j].answerA == this.tons[0].mass && this.sprite[i][j].answerB == this.tons[1].mass) {
                        array[0] = true;
                        array[1] = this.sprite[i][j];
                        console.log(array);
                        return array;
                        break;
                    }
                }
            }
            return array;
        };
        AdvancedMenu.prototype.movePainter = function (t, dir, p1) {
            this.tons[0].calcForce();
            this.tons[1].calcForce();
            var array = this.checkAnswers();
            var point1 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var point2 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            console.log(this.tons[1].ton.length, "LENGTH TON");
            if (array[0]) {
                this.tons[0].angleA = array[1].angleinRad[0];
                this.tons[1].angleA = array[1].angleinRad[1];
                var velo2 = array[1].painterPos;
                var ton0Y = this.tons[0].body.y;
                var ton1Y = this.tons[1].body.y;
                this.tons[0].dlengtha = Phaser.Math.distance(point2.x, point2.y, this.painter.x, this.painter.y);
                this.tons[0].dlengthb = Phaser.Math.distance(point2.x, point2.y, velo2.x, velo2.y);
                this.tons[0].dlength = this.tons[0].dlengtha - this.tons[0].dlengthb;
                this.tons[0].dlength = this.tons[0].dlength / 2;
                this.tons[1].dlengtha = Phaser.Math.distance(point1.x, point1.y, this.painter.x, this.painter.y);
                this.tons[1].dlengthb = Phaser.Math.distance(point1.x, point1.y, velo2.x, velo2.y);
                this.tons[1].dlength = this.tons[1].dlengtha - this.tons[1].dlengthb;
                this.tons[1].dlength = this.tons[1].dlength / 2;
                ton0Y = ton0Y + this.tons[0].dlength;
                ton1Y = ton1Y + this.tons[1].dlength;
                this.tons[1].tween = this.add.tween(this.tons[1]).to({ y: ton1Y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.tons[0].tween = this.add.tween(this.tons[0]).to({ y: ton0Y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.arrow[1]).to({ rotation: -this.tons[1].angleA }, 2000, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.arrow[0]).to({ rotation: this.tons[0].angleA }, 2000, Phaser.Easing.Exponential.Out, true);
                this.painter.tween = this.add.tween(this.painter).to({ x: velo2.x, y: velo2.y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.painter.tween.onUpdateCallback(function () {
                    this.paintTheLines(this.tons[t], t);
                }, this);
                this.painter.tween.onComplete.add(function () {
                    this.paintTheLines(this.tons[t], t);
                }, this);
                return;
            }
            if (!array[0] && this.tons[0].ton.length == 0 && this.tons[1].ton.length == 0) {
                var velo3 = new Phaser.Point(this.game.world.centerX, this.game.height - (this.painter.height + this.tileHeight));
                this.tons[1].angleA = Phaser.Math.angleBetween(velo3.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, velo3.y);
                this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, velo3.x, velo3.y);
                this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100;
                this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100;
                this.tons[1].convertAngle();
                this.tons[0].convertAngle();
                this.tons[1].tween = this.add.tween(this.tons[1]).to({ y: this.tons[1]._dx.y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.tons[0].tween = this.add.tween(this.tons[0]).to({ y: this.tons[0]._dx.y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.arrow[1]).to({ rotation: -this.tons[1].angleA }, 2000, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.arrow[0]).to({ rotation: this.tons[0].angleA }, 2000, Phaser.Easing.Exponential.Out, true);
                this.painter.tween = this.add.tween(this.painter).to({ x: velo3.x, y: velo3.y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.painter.tween.onUpdateCallback(function () {
                    this.paintTheLines(this.tons[t], t);
                }, this);
                this.painter.tween.onComplete.add(function () {
                    this.paintTheLines(this.tons[t], t);
                }, this);
                return;
            }
            if (!array[0] && (this.tons[0].ton.length > 0 || this.tons[1].ton.length > 0)) {
                var equationA1 = (this.tons[0].calcForce() * 2);
                var equationA2a = this.tons[1].calcPow() - this.tons[0].calcPow();
                var equationA2b = this.painter.force - (equationA2a / this.painter.force);
                var equationA3 = Math.asin(equationA2b / equationA1);
                this.tons[0].angleA = Math.round(equationA3 * 100) / 100; // angle A from the new equib position
                var equationB1 = (this.tons[0].calcForce() / this.tons[1].calcForce()) * Math.cos(this.tons[0].angleA);
                this.tons[1].angleA = Math.round(Math.acos(equationB1) * 100) / 100; // angle B from the new equib position
                this.tons[0].convertAngle();
                this.tons[1].convertAngle();
                if (isNaN(this.tons[0].angleA) && isNaN(this.tons[1].angleA)) {
                    if (this.tons[0].mass > this.tons[1].mass) {
                        this.tons[0].angleA = 1.06;
                        this.tons[1].angleA = 0;
                    }
                    if (this.tons[1].mass > this.tons[0].mass) {
                        this.tons[1].angleA = 1.06;
                        this.tons[0].angleA = 0;
                    }
                    this.dropped = true;
                }
                if (isNaN(this.tons[0].angleA) || this.tons[0].angleA < 0) {
                    this.tons[0].angleA = 0;
                }
                if (isNaN(this.tons[1].angleA) || this.tons[1].angleA < 0) {
                    this.tons[1].angleA = 0;
                }
                //this.tons[0].angleinDeg = Math.round(Phaser.Math.radToDeg(this.tons[0].angleA) * 100) / 100;
                //this.tons[1].angleinDeg = Math.round(Phaser.Math.radToDeg(this.tons[1].angleA) * 100) / 100;
                this.sumFx = this.tons[1].calcFx() - this.tons[0].calcFx(); // formula to find Sum of X components
                this.sumFy = (this.tons[1].calcFy() + this.tons[0].calcFy()) - this.painter.force; // formula to find Sum of Y components
                var velo = this.calcAll();
                var ton0Y = this.tons[0].body.y;
                var ton1Y = this.tons[1].body.y;
                this.tons[0].dlengtha = Phaser.Math.distance(point2.x, point2.y, this.painter.x, this.painter.y);
                this.tons[0].dlengthb = Phaser.Math.distance(point2.x, point2.y, velo.x, velo.y);
                this.tons[0].dlength = this.tons[0].dlengtha - this.tons[0].dlengthb;
                this.tons[0].dlength = this.tons[0].dlength / 2;
                this.tons[1].dlengtha = Phaser.Math.distance(point1.x, point1.y, this.painter.x, this.painter.y);
                this.tons[1].dlengthb = Phaser.Math.distance(point1.x, point1.y, velo.x, velo.y);
                this.tons[1].dlength = this.tons[1].dlengtha - this.tons[1].dlengthb;
                this.tons[1].dlength = this.tons[1].dlength / 2;
                ton0Y = ton0Y + this.tons[0].dlength;
                ton1Y = ton1Y + this.tons[1].dlength;
                this.tons[1].tween = this.add.tween(this.tons[1]).to({ y: ton1Y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.tons[0].tween = this.add.tween(this.tons[0]).to({ y: ton0Y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.arrow[1]).to({ rotation: -this.tons[1].angleA }, 2000, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.arrow[0]).to({ rotation: this.tons[0].angleA }, 2000, Phaser.Easing.Exponential.Out, true);
                this.painter.tween = this.add.tween(this.painter).to({ x: velo.x, y: velo.y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.painter.tween.onUpdateCallback(function () {
                    this.paintTheLines(this.tons[t], t);
                    this.calcAll();
                }, this);
                this.painter.tween.onComplete.add(function () {
                    this.paintTheLines(this.tons[t], t);
                    this.calcAll();
                }, this);
            }
        };
        AdvancedMenu.prototype.calcAll = function () {
            var point1 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var point0 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            var adj = point1.x - point0.x;
            var thirdAngle = Math.PI - this.tons[0].angleA - this.tons[1].angleA;
            var hypa = (adj * Math.sin(this.tons[1].angleA)) / Math.sin(thirdAngle);
            hypa = Math.round(hypa * 100) / 100;
            var hypb = (adj * Math.sin(this.tons[0].angleA)) / Math.sin(thirdAngle);
            hypb = Math.round(hypb * 100) / 100;
            var opp = hypa * Math.sin(this.tons[1].angleA);
            opp = Math.round(opp * 100) / 100;
            var returnX = hypa * Math.cos(this.tons[0].angleA);
            returnX = Math.round(returnX * 100) / 100;
            var t1 = hypa * hypa;
            var t2 = returnX * returnX;
            var t3 = t1 - t2;
            var t4 = Math.sqrt(t3);
            returnX += point0.x;
            var returnY = t4 + point0.y;
            if (returnY > (this.game.height - (this.painter.height + this.tileHeight))) {
                returnY = this.game.height - (this.painter.height + this.tileHeight);
            }
            var distancePoint = new Phaser.Point(returnX, returnY);
            return distancePoint;
        };
        return AdvancedMenu;
    })(Phaser.State);
    SSMAT.AdvancedMenu = AdvancedMenu;
})(SSMAT || (SSMAT = {}));
/* For debugging purposes

        testClick(p1) {
            this.painter.x = p1.x + p1.width / 2;
            this.painter.y = p1.y + p1.height / 2 - this.painter.height / 2;
            this.tons[1].angleA = Phaser.Math.angleBetween(this.painter.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, this.painter.y)
            this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, this.painter.x, this.painter.y)
            
            this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100;
            this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100;
            
            this.tons[1].convertAngle();
            this.tons[0].convertAngle();
            var temp2 = (Math.cos(this.tons[0].angleA) / Math.cos(this.tons[1].angleA)) // Tons1 = Cos(Ton0.angle) / Cos(Ton1.Angle)
            var temp = (temp2 * (Math.sin(this.tons[1].angleA)) + Math.sin(this.tons[0].angleA))
            this.tons[0].force = Math.round((this.painter.force / temp) * 10) / 10
            this.tons[1].force = Math.round((this.tons[0].force * temp2) * 10) / 10
            this.tons[0].mass = Math.round((this.tons[0].force / this.gravity) * 10) / 10
            this.tons[1].mass = Math.round((this.tons[1].force / this.gravity) * 10) / 10
            this.sumFx = this.tons[1].calcFx() - this.tons[0].calcFx(); // formula to find Sum of X components
            this.sumFy = (this.tons[1].calcFy() + this.tons[0].calcFy()) - this.painter.force  // formula to find Sum of Y components
            
            this.sumR = (this.sumFx * 2) + (this.sumFy * 2);
            if (this.sumR < 0) {
                this.sumR = this.sumR * -1
            }
            this.sumR = Math.sqrt(this.sumR);
            this.sumR = Math.round(this.sumR * 10) / 10;
            this.paintTheLines(this.tons[0], 0);
            this.calcAll();
        }
*/
var _this = this;
window.onload = function () {
    global_style = { font: "24px Verdana Bold", fill: "#FFFFFF", stroke: 'black', strokeThickness: 2, shadowStroke: true, wordWrap: false, wordWrapWidth: _this.width, align: "left" };
    global_game = new SSMAT.Game();
    admin_no = document.getElementById("admin_no").value;
    restartFromLeaderboard = false;
    level_choice = "";
};
function resizeGame() {
    var size = { width: window.innerWidth, height: window.innerHeight };
    console.log('resizing to ', size.width, size.height);
    global_game.width = size.width;
    global_game.height = size.height;
    global_game.canvas.width = size.width;
    global_game.canvas.height = size.height;
    global_game.scale.width = size.width;
    global_game.scale.height = size.height;
    global_game.world.width = size.width;
    global_game.world.height = size.height;
    global_game.renderer.resize(size.width, size.height);
}
var SSMAT;
(function (SSMAT) {
    var Arrow = (function (_super) {
        __extends(Arrow, _super);
        function Arrow(game, x, y, key, scale, components) {
            if (scale === void 0) { scale = 1; }
            if (components === void 0) { components = true; }
            _super.call(this, game, x, y, key);
            this.anchor.setTo(0, 0.5);
            game.add.existing(this);
            this.scale.x = scale;
            this.components = [];
            if (components) {
                this.components[0] = game.add.sprite(0, 0, key);
                this.components[0].rotation = -1.5708;
                this.components[0].anchor.copyFrom(this.anchor);
                this.components[1] = game.add.sprite(0, 0, key);
                this.components[1].scale.x = scale;
                this.components[1].anchor.copyFrom(this.anchor);
            }
        }
        Arrow.prototype.update = function () {
            if (this.components.length > 0) {
                this.components[0].position.copyFrom(this.position);
                this.components[1].position.copyFrom(this.position);
            }
        };
        return Arrow;
    })(Phaser.Sprite);
    SSMAT.Arrow = Arrow;
})(SSMAT || (SSMAT = {}));
var SSMAT;
(function (SSMAT) {
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
    SSMAT.Boot = Boot;
})(SSMAT || (SSMAT = {}));
var SSMAT;
(function (SSMAT) {
    var ButtonLabel = (function (_super) {
        __extends(ButtonLabel, _super);
        function ButtonLabel(game, x, y, key, label, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {
            _super.call(this, game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
            game.add.existing(this);
            this.label = game.add.text(0, 0, label, global_style);
            this.label.y = this.game.world.height - 30 - this.height;
            this.label.x = this.x;
            this.label.anchor.set(0.5, 0.5);
            this.label.y = this.label.y - this.label.height / 2;
            this.label.visible = false;
            this.label.setShadow(1, 1, 'rgba(0,0,0,1)', 0.1);
            this.label.y = Math.round(this.label.y);
            this.label.x = Math.round(this.label.x);
            this.events.onInputOver.add(function () { this.label.visible = true; }, this);
            this.events.onInputOut.add(function () { this.label.visible = false; }, this);
            this.events.onInputDown.add(function () { this.label.visible = false; }, this);
        }
        ButtonLabel.prototype.updatePosition = function () {
            this.label.y = this.game.height - 30 - this.height;
            this.label.x = this.x;
            this.label.y = this.label.y - this.label.height / 2;
            this.label.y = Math.round(this.label.y);
            this.label.x = Math.round(this.label.x);
        };
        return ButtonLabel;
    })(Phaser.Button);
    SSMAT.ButtonLabel = ButtonLabel;
})(SSMAT || (SSMAT = {}));
var SSMAT;
(function (SSMAT) {
    var Exit = (function (_super) {
        __extends(Exit, _super);
        function Exit(game, x, y) {
            _super.call(this, game, x, y, "exit");
            this.anchor.setTo(0.5, 0.6);
            game.add.existing(this);
            this.ok = this.game.add.button(0, 0, "ok-btn", this.exit, this, 1, 0, 1, 0);
            this.ok.anchor.setTo(0.5, 0.5);
            this.cancel = this.game.add.button(0, 0, "cancel-btn", this.cancelled, this, 1, 0, 1, 0);
            this.cancel.anchor.setTo(0.5, 0.5);
            this.ok.position.setTo(this.x - (this.ok.width / 2) - 10, this.y + this.height - 150);
            this.cancel.position.setTo(this.ok.x + this.ok.width + 10, this.y + this.height - 150);
        }
        Exit.prototype.toggleVisibility = function () {
            this.cancel.visible = this.visible;
            this.ok.visible = this.visible;
        };
        Exit.prototype.exit = function () {
            this.game.state.start('Preloader', true, false);
        };
        Exit.prototype.cancelled = function () {
            this.visible = false;
            this.toggleVisibility();
        };
        return Exit;
    })(Phaser.Sprite);
    SSMAT.Exit = Exit;
})(SSMAT || (SSMAT = {}));
var SSMAT;
(function (SSMAT) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            //console.log(window.innerHeight, document.body.offsetHeight, "Window Height");
            _super.call(this, window.innerWidth, window.innerHeight, Phaser.CANVAS, 'content', null, true, false);
            this.state.add('Boot', SSMAT.Boot, false);
            this.state.add('Preloader', SSMAT.Preloader, false);
            this.state.add('MainMenu', SSMAT.MainMenu, false);
            this.state.add('AdvancedMenu', SSMAT.AdvancedMenu, false);
            this.state.add('GameOver', SSMAT.GameOver, false);
            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    SSMAT.Game = Game;
})(SSMAT || (SSMAT = {}));
var SSMAT;
(function (SSMAT) {
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        function GameOver() {
            _super.apply(this, arguments);
        }
        GameOver.prototype.init = function (timer, elapsed, image) {
            this.score = timer;
            this.numscore = Math.round(elapsed * 100) / 100;
            this.black = this.add.sprite(0, 0, "black");
            this.black.alpha = 1;
            this.registered = false;
            //this.image = image;
            this.image = this.game.add.image((this.game.width / 2) - (image.width / 2), (this.game.height / 2) - (image.height / 2) - 100, image.key);
            this.image.width = image.width;
            this.image.height = image.height;
            this.image.position.x = image.x;
            this.image.position.y = image.y;
            //(<HTMLInputElement>document.getElementById("inputfield")).style.display = "inline";
        };
        GameOver.prototype.create = function () {
            console.log("GAME OVER, Your score is: ", this.score, this.numscore);
        };
        GameOver.prototype.update = function () {
            var input = document.getElementById("inputfield");
            if (input.style.display == "none" && this.registered == false && admin_no != "") {
                var admin = admin_no;
                admin = admin.toUpperCase();
                admin_no = admin;
                this.preloadBar = this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloadBar');
                this.preloadBar.anchor.setTo(0.5, 0.5);
                this.preloadBar.position.setTo(this.game.width / 2, this.game.height / 2);
                this.preloadBar.animations.add('load');
                this.preloadBar.animations.play('load', 24, true);
                var score = Parse.Object.extend(level_choice);
                var addscore = new score();
                addscore.currentname = Parse.User.current();
                addscore.numscore = this.numscore;
                addscore.score = this.score;
                addscore.admin = admin;
                addscore.this = this;
                addscore.showLeaderBoard = function () {
                    addscore.this.showLeaderBoard();
                };
                var query = new Parse.Query(score);
                //sign up
                var user = new Parse.User();
                user.set("username", admin);
                user.set("password", "LearningAcademy");
                user.signUp(null, {
                    success: function (user) {
                        // Hooray! Let them use the app now.
                        Parse.User.logIn(admin, "LearningAcademy", {
                            success: function (user) {
                                // Do stuff after successful login.
                                query.equalTo("user", Parse.User.current());
                                query.first({
                                    success: function (object) {
                                        if (object === undefined) {
                                            addscore.set("user", Parse.User.current());
                                            addscore.set("Score", addscore.numscore);
                                            addscore.set("Time", addscore.score);
                                            addscore.set("Last", addscore.score);
                                            addscore.set("admin_no", addscore.admin);
                                            addscore.save();
                                        }
                                        else {
                                            var best = object.get("Score");
                                            if (addscore.numscore <= best) {
                                                object.set("Score", addscore.numscore);
                                                object.set("Time", addscore.score);
                                                object.set("Last", addscore.score);
                                            }
                                            if (addscore.numscore > best) {
                                                object.set("Last", addscore.score);
                                            }
                                            object.save();
                                        }
                                        addscore.showLeaderBoard();
                                    },
                                    error: function (error) {
                                        console.log("Error: ", error.code, " ", error.message);
                                    }
                                });
                            },
                            error: function (user, error) {
                                // The login failed. Check error to see why.
                                console.log("Error: " + error.code + " " + error.message);
                            }
                        });
                    },
                    error: function (user, error) {
                        // If admin number is not inside database, create them anyway
                        console.log("Error: ", error.code, " ", error.message);
                        Parse.User.logIn(admin, "LearningAcademy", {
                            success: function (user) {
                                // Do stuff after successful login.
                                query.equalTo("user", Parse.User.current());
                                query.first({
                                    success: function (object) {
                                        if (object === undefined) {
                                            addscore.set("user", Parse.User.current());
                                            addscore.set("Score", addscore.numscore);
                                            addscore.set("Time", addscore.score);
                                            addscore.set("Last", addscore.score);
                                            addscore.set("admin_no", addscore.admin);
                                            addscore.save();
                                        }
                                        else {
                                            var best = object.get("Score");
                                            if (addscore.numscore <= best) {
                                                object.set("Score", addscore.numscore);
                                                object.set("Time", addscore.score);
                                                object.set("Last", addscore.score);
                                            }
                                            if (addscore.numscore > best) {
                                                object.set("Last", addscore.score);
                                            }
                                            object.save();
                                        }
                                        addscore.showLeaderBoard();
                                    },
                                    error: function (error) {
                                        console.log("Error: ", error.code, " ", error.message);
                                    }
                                });
                            },
                            error: function (user, error) {
                                // The login failed. Check error to see why.
                                console.log("Error: " + error.code + " " + error.message);
                            }
                        });
                    }
                });
                this.registered = true;
            }
            if (restartFromLeaderboard == true) {
                this.restart();
                restartFromLeaderboard = false;
            }
        };
        GameOver.prototype.showLeaderBoard = function () {
            var score = Parse.Object.extend(level_choice);
            var query = new Parse.Query(score);
            var preloadBar = this.preloadBar;
            var temp_this = this;
            document.getElementById("leaderboard_body").innerHTML = "";
            query.ascending("Score");
            query.find({
                success: function (results) {
                    console.log("Successfully retrieved " + results.length + " scores.");
                    // Do something with the returned Parse.Object values
                    var rank = 1;
                    var style = "<tr bgcolor=#904820>";
                    var maxrows = 31;
                    if (results.length > maxrows) {
                        maxrows = results.length;
                    }
                    for (var i = 0; i < maxrows; i++) {
                        if (rank % 2 == 0) {
                            style = "<tr bgcolor=#181818>";
                        }
                        else {
                            style = "<tr bgcolor=#202020>";
                        }
                        if (i < results.length) {
                            var object = results[i];
                            if (object.get('admin_no') == admin_no) {
                                style = "<tr bgcolor=#285c8d id=mine>";
                            }
                            document.getElementById("leaderboard_body").innerHTML += style + "<td align=center>" + rank + "</td> " + "<td align=left>&nbsp;&nbsp;" + object.get('admin_no') + "</td>" + "<td align=center>" + object.get('Last') + "</td>" + "<td align=center>" + object.get('Time') + "</td></tr>";
                            rank++;
                        }
                        if (i > results.length) {
                            document.getElementById("leaderboard_body").innerHTML += style + "<td align=center>" + rank + "</td> " + "<td align=left>&nbsp;&nbsp;" + "</td>" + "<td align=center></td>" + "<td align=center>" + "</td></tr>";
                            rank++;
                        }
                    }
                    preloadBar.visible = false;
                    var leaderboardtable = document.getElementById("scores");
                    leaderboardtable.style.display = 'inline';
                    leaderboardtable.style.opacity = '0';
                    leaderboardtable.style.height = String(window.innerHeight) + 'px';
                    //(<HTMLInputElement>document.getElementById("scores")).style.display = "inline";
                    var elem = document.getElementById("mine");
                    if (elem != undefined) {
                        elem.scrollIntoView(true);
                    }
                    var black = temp_this.add.sprite(0, 0, "black");
                    black.visible = false;
                    black.alpha = 0;
                    var tweenie = temp_this.add.tween(black).to({ alpha: 1 }, 1000, Phaser.Easing.Exponential.Out, true);
                    tweenie.onUpdateCallback(function () {
                        leaderboardtable.style.opacity = String(black.alpha);
                    }, this);
                    tweenie.onComplete.addOnce(function () {
                        temp_this.image.visible = false;
                        leaderboardtable.style.opacity = String(black.alpha);
                    }, this);
                },
                error: function (error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
        };
        GameOver.prototype.restart = function () {
            //var temp = this.input.onDown.addOnce(this.restart, this);
            document.getElementById("scores").style.display = "none";
            this.game.state.start('Preloader', true, false);
        };
        return GameOver;
    })(Phaser.State);
    SSMAT.GameOver = GameOver;
})(SSMAT || (SSMAT = {}));
var SSMAT;
(function (SSMAT) {
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid(game, x, y) {
            this.painterPos = new Phaser.Point(0, 0);
            // create a new bitmap data object
            // var bmd = this.game.add.bitmapData(150, 126.5);
            var bmd = new Phaser.Graphics(game, 0, 0);
            bmd.beginFill(0x333333);
            bmd.lineStyle(1, 0x222222, 1);
            bmd.drawRect(0, 0, 150, 127);
            bmd.endFill();
            bmd.boundsPadding = 0;
            var texture = bmd.generateTexture();
            _super.call(this, game, x, y, texture);
            game.add.existing(this);
            this.hitted = false;
            var style = { font: "14px Courier", fill: "#FFFFFF", wordWrap: false, wordWrapWidth: this.width, align: "center" };
            this.text = game.add.text(0, 0, "", style);
            this.text.anchor.set(0.5);
            this.text.visible = true;
            this.smoothed = false;
            this.text.x = Math.floor(this.x + this.width / 2);
            this.text.y = Math.floor(this.y + this.height / 2);
            this.text.alpha = 0;
            this.events.onInputOver.add(function () {
                if (this.alpha == 1) {
                    var tween = this.main.add.tween(this.text).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
                }
            }, this);
            this.events.onInputOut.add(function () {
                if (this.alpha == 1) {
                    var tween = this.main.add.tween(this.text).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                }
            }, this);
            this.angleinRad = [];
        }
        Grid.prototype.setAnswers = function (type) {
            this.angleinRad[0] = Phaser.Math.degToRad(this.angleA); // Angle alpha
            this.angleinRad[1] = Phaser.Math.degToRad(this.angleB); // Angle beta
            var force0 = 0;
            var force1 = 0;
            if (type == 1) {
                var temp2 = (Math.cos(this.angleinRad[0]) / Math.cos(this.angleinRad[1])); // Tons1 = Cos(Ton0.angle) / Cos(Ton1.Angle)
                var temp = (temp2 * (Math.sin(this.angleinRad[1])) + Math.sin(this.angleinRad[0]));
                force0 = Math.round((this.main.painter.force / temp) * 10) / 10;
                force1 = Math.round((force0 * temp2) * 10) / 10;
            }
            if (type == 2) {
                // equation (1) to find force of Beta
                var w = Math.round((this.main.wind / Math.cos(this.angleinRad[0])) * 1000) / 1000; // (1)
                var f2 = Math.round((Math.cos(this.angleinRad[1]) / Math.cos(this.angleinRad[0])) * 1000) / 1000; // (2)
                var f2force1 = this.main.painter.force - (w * Math.sin(this.angleinRad[1]));
                var f2force2 = (f2 * Math.sin(this.angleinRad[0])) + Math.sin(this.angleinRad[1]);
                force1 = (f2force1 / f2force2);
                //  console.log(w, "wind", f2, "F2", f2force1, "f2force1", f2force2, "f2force2", (f2force1 / f2force2), "f2force1 / f2force2");
                // equation (2) to find force of alpha
                force0 = Math.round(((f2 * force1) + w) * 10) / 10;
            }
            this.answerA = Math.round((force0 / this.main.gravity) * 10) / 10;
            this.answerB = Math.round((force1 / this.main.gravity) * 10) / 10;
            this.text.x = Math.floor(this.x + this.width / 2);
            this.text.y = Math.floor(this.y + this.height / 2);
        };
        Grid.prototype.update = function () {
            if (this.main.started) {
                this.text.text = "α: " + String(this.angleA) + " β: " + String(this.angleB);
            }
            if (this.hitted == false && this.main.tons[0].angleinDeg == this.angleA && this.main.tons[1].angleinDeg == this.angleB && this.alpha == 1 && this.main.tons[0].mass == this.answerA && this.main.tons[1].mass == this.answerB) {
                this.hitted = true;
                this.main.add.tween(this.text).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                this.events.onInputOver.removeAll();
                this.events.onInputOut.removeAll();
                var tween = this.main.add.tween(this).to({ alpha: 0 }, 4000, Phaser.Easing.Linear.None, true, 2000);
                tween.onComplete.addOnce(function () {
                    this.main.noGridCompleted++;
                    this.main.painter.animations.stop(null, true);
                    this.main.checkFinished();
                }, this);
                tween.onStart.addOnce(function () {
                    this.main.painter.animations.play("paint", 4, true);
                }, this);
            }
        };
        return Grid;
    })(Phaser.Sprite);
    SSMAT.Grid = Grid;
})(SSMAT || (SSMAT = {}));
var SSMAT;
(function (SSMAT) {
    var login = (function (_super) {
        __extends(login, _super);
        function login() {
            _super.apply(this, arguments);
        }
        login.prototype.init = function (timer, elapsed) {
            this.black = this.add.sprite(0, 0, "black");
            this.black.alpha = 1;
            this.registered = false;
            document.getElementById("inputfield").style.display = "inline";
        };
        login.prototype.create = function () {
            console.log("GAME OVER, Your score is: ", this.score, this.numscore);
            this.input.onDown.addOnce(this.restart, this);
            var input = document.getElementById("inputfield");
            var admin_no = document.getElementById("admin_no");
            if (input.style.display == "none" && this.registered == false && admin_no.value != "") {
                console.log(admin_no.value);
                var score = Parse.Object.extend("LeaderBoard");
                var addscore = new score();
                //sign up
                var user = new Parse.User();
                user.set("username", admin_no.value);
                user.set("password", "LearningAcademy");
                user.signUp(null, {
                    success: function (user) {
                        // Hooray! Let them use the app now.
                    },
                    error: function (user, error) {
                        // Show the error message somewhere and let the user try again.
                        console.log("Error: ", error.code, " ", error.message);
                    }
                });
                //login
                Parse.User.logIn(admin_no.value, "LearningAcademy", {
                    success: function (user) {
                        // Do stuff after successful login.
                        console.log("Login!: ", user, " ");
                    },
                    error: function (user, error) {
                        // The login failed. Check error to see why.
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
                //addscore.set("user", Parse.User.current());
                //addscore.set("Score", this.numscore);
                //addscore.set("Time", this.score);
                //addscore.save();
                addscore.currentname = Parse.User.current();
                addscore.numscore = this.numscore;
                addscore.score = this.score;
                var query = new Parse.Query(score);
                query.equalTo("user", Parse.User.current());
                query.first({
                    success: function (object) {
                        console.log("Successfully retrieved ", object, "DName");
                        console.log(addscore.numscore);
                        console.log(addscore.score);
                        if (object === undefined) {
                            console.log("undefined!");
                            addscore.set("user", Parse.User.current());
                            addscore.set("Score", addscore.numscore);
                            addscore.set("Time", addscore.score);
                            addscore.save();
                        }
                        else {
                            console.log("defined!");
                            object.set("Score", addscore.numscore);
                            object.set("Time", addscore.score);
                            object.save();
                        }
                    },
                    error: function (error) {
                        console.log("Error: ", error.code, " ", error.message);
                    }
                });
                console.log(this.numscore, this.score);
                this.registered = true;
            }
        };
        login.prototype.update = function () {
        };
        login.prototype.restart = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return login;
    })(Phaser.State);
    SSMAT.login = login;
})(SSMAT || (SSMAT = {}));
var SSMAT;
(function (SSMAT) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            Parse.User.logOut();
            // set on resize event
            this.game.scale.setResizeCallback(this.setResize, this);
            // static settings 
            this.tileHeight = 30; // set the button height limit according to the tile
            this.clockTime = 0;
            this.noGridCompleted = 0;
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.score = "";
            this.gravity = 9.81;
            this.dt = 0.0833333333333333;
            this.t = 0;
            this.dropped = false;
            this.started = false;
            this.arrow = [];
            // background
            // ground tiles
            this.tiler = this.game.add.tileSprite(0, this.world.height - this.tileHeight, this.game.width, this.game.height, 'tile');
            this.tiler.alpha = 1;
            this.game.physics.arcade.enable(this.tiler);
            this.tiler.body.immovable = true;
            this.tiler.body.allowGravity = false;
            this.grad = this.game.add.sprite(0, 0, "gradient");
            // the image painting itself;
            // Math.floor(Math.random() * (max - min + 1)) + min;
            var randomImage = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
            var stringUrl = 'pic' + randomImage;
            this.image = this.game.add.image(0, 0, stringUrl);
            this.image.width = 450;
            this.image.height = 253;
            var randomMin = (this.game.height / 2) - (this.image.height / 2) - 100;
            var randomMax = (this.game.height) - this.image.height - 200;
            this.image.position.x = (this.game.width / 2) - (this.image.width / 2);
            this.image.position.y = Math.floor(Math.random() * (randomMax - randomMin + 1)) + randomMin;
            this.grad.y = this.image.position.y - 14;
            this.grad.x = this.image.position.x - 14;
            this.image.visible = false;
            // use the bitmap data as the texture for the sprite
            // generate the grid lines
            var distributeWidth = this.image.position.x;
            var distributeHeight = this.image.position.y;
            this.sprite = [];
            this.spriteGroup = this.game.add.group();
            for (var i = 0; i < 2; i++) {
                this.sprite[i] = [];
                distributeWidth = this.image.position.x;
                for (var j = 0; j < 3; j++) {
                    this.sprite[i][j] = new SSMAT.Grid(this.game, distributeWidth, distributeHeight);
                    distributeWidth += this.sprite[i][j].width - 1;
                    this.sprite[i][j].inputEnabled = true;
                    this.sprite[i][j].main = this;
                    this.spriteGroup.addChild(this.sprite[i][j]);
                    // # REMOVE THIS IF DEPLOYING //
                    this.sprite[i][j].events.onInputDown.add(this.testClick, this);
                }
                distributeHeight += 126.5;
            }
            // this is to initialize the main painter
            this.painter = new SSMAT.Painter(this.game, this.world.centerX, this.game.height, 90, this.gravity);
            this.painter.y -= this.painter.height + this.tileHeight;
            //this.painter.y = 509.1707368654838;
            this.painter.anchor.setTo(0.5, 0);
            this.game.physics.arcade.enable(this.painter);
            this.stage.smoothed = false;
            this.game.stage.smoothed = false;
            // adding the wheels for the pulley
            this.wheelGroup = this.game.add.group();
            this.wheel = this.add.sprite(0, 0, 'wheel', 0);
            this.wheelGroup.addChild(this.wheel);
            this.wheel = this.add.sprite(0, 0, 'wheel', 0);
            this.wheelGroup.addChild(this.wheel);
            this.wheelGroup.getChildAt(0).x = this.grad.x - this.wheel.width;
            this.wheelGroup.getChildAt(1).x = this.grad.x + this.grad.width;
            // adding the tons for the pulley (0 for left, 1 for right)
            // tons2 is the weights that we are going to add from the button
            this.graphics = this.add.graphics(0, 0);
            this.tons = [];
            this.tons2 = [];
            this.tons[0] = new SSMAT.Tons(this.game, this.wheelGroup.getChildAt(0).x, this.wheelGroup.getChildAt(0).y + this.wheel.height, 10, this.gravity, "left");
            this.tons[1] = new SSMAT.Tons(this.game, this.wheelGroup.getChildAt(1).x + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height, 10, this.gravity, "right");
            this.tons[0].main = this;
            this.tons[1].main = this;
            this.tons[0].name = "left";
            this.tons[1].name = "right";
            this.game.physics.arcade.enable([this.tons[0], this.tons[1]]);
            this.tons[0].body.allowGravity = false;
            this.tons[1].body.allowGravity = false;
            // the pulley "strings"
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round(this.tons[0].x), Math.round(this.tons[0].y));
            this.graphics.lineTo(Math.round(this.tons[0].x), Math.round(this.wheelGroup.getChildAt(0).y + this.wheel.height / 2));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round((this.tons[0].x) + this.wheel.width), Math.round(this.wheelGroup.getChildAt(0).y + this.wheel.height / 2));
            this.graphics.lineTo(Math.round(this.painter.x), Math.round(this.painter.y));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.lineTo(Math.round(this.painter.x), Math.round(this.painter.y));
            this.graphics.lineTo(Math.round((this.tons[1].x) - this.wheel.width), Math.round(this.wheelGroup.getChildAt(1).y + this.wheel.height / 2));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round(this.tons[1].x), Math.round(this.wheelGroup.getChildAt(1).y + this.wheel.height / 2));
            this.graphics.lineTo(Math.round(this.tons[1].x), Math.round(this.tons[1].y));
            // tweening the main intro screen
            // buttons shits
            this.button = new SSMAT.ButtonLabel(this.game, this.game.world.width - 82 - 100, this.game.world.height - this.tileHeight, 'button', "ADD WEIGHT", this.addWeight, this, 0, 0, 1, 0);
            this.button.y -= this.button.height;
            this.button.anchor.setTo(0.5, 0);
            this.help = new SSMAT.ButtonLabel(this.game, this.button.x + this.button.width + 1, this.button.y, 'help', "TIPS", this.tips, this, 0, 0, 1, 0);
            this.help.anchor.setTo(0.5, 0);
            this.resetbtn = new SSMAT.ButtonLabel(this.game, this.help.x + this.button.width + 1, this.button.y, 'reset', "RESET!", this.reset, this, 0, 0, 1, 0);
            this.resetbtn.anchor.setTo(0.5, 0);
            this.vector = new SSMAT.ButtonLabel(this.game, this.resetbtn.x + this.button.width + 1, this.button.y, 'vector', "HIDE DETAILS!", this.hide, this, 0, 0, 1, 0);
            this.vector.anchor.setTo(0.5, 0);
            // calculations to make the system in an equilibrium
            this.tons[1].angleA = Phaser.Math.angleBetween(this.painter.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, this.painter.y);
            this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, this.painter.x, this.painter.y);
            this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100;
            this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100;
            this.tons[0].convertAngle();
            this.tons[1].convertAngle();
            var temp2 = Math.round((Math.cos(this.tons[0].angleA) / Math.cos(this.tons[1].angleA)) * 1000) / 1000; // Tons1 = Cos(Ton0.angle) / Cos(Ton1.Angle)
            var temp = Math.round((temp2 * (Math.sin(this.tons[1].angleA)) + Math.sin(this.tons[0].angleA)) * 1000) / 1000;
            this.tons[0].force = Math.round((this.painter.force / temp) * 10) / 10;
            this.tons[1].force = Math.round((this.tons[0].force * temp2) * 10) / 10;
            this.tons[0].mass = Math.round((this.tons[0].force / this.gravity) * 10) / 10;
            this.tons[1].mass = Math.round((this.tons[1].force / this.gravity) * 10) / 10;
            this.tons[0]._dx = this.tons[0].position.clone();
            this.tons[1]._dx = this.tons[1].position.clone();
            // setting the correct answers for each grid dynamically
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 3; j++) {
                    var tempPoint = new Phaser.Point(this.sprite[i][j].x + this.sprite[i][j].width / 2, this.sprite[i][j].y + (this.sprite[i][j].height / 2) - (this.painter.height / 2));
                    this.sprite[i][j].angleB = Phaser.Math.angleBetween(tempPoint.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, tempPoint.y);
                    this.sprite[i][j].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, tempPoint.x, tempPoint.y);
                    this.sprite[i][j].angleB = Math.round(this.sprite[i][j].angleB * 100) / 100;
                    this.sprite[i][j].angleA = Math.round(this.sprite[i][j].angleA * 100) / 100;
                    this.sprite[i][j].angleA = Math.round(Phaser.Math.radToDeg(this.sprite[i][j].angleA) * 100) / 100;
                    this.sprite[i][j].angleB = Math.round(Phaser.Math.radToDeg(this.sprite[i][j].angleB) * 100) / 100;
                    this.sprite[i][j].setAnswers(1);
                    console.log(this.sprite[i][j].answerA, this.sprite[i][j].answerB);
                }
            }
            // Timer for scoring purposes
            this.timer = this.game.add.text(this.world.centerX, 20, "TIME\n00:00:00", global_style);
            this.timer.align = "center";
            this.timer.setShadow(1, 1, 'rgba(0,0,0,1)', 0.1);
            this.timer.anchor.setTo(0.5, 0);
            this.timer.x = Math.round(this.timer.x);
            this.timer.y = Math.round(this.timer.y);
            this.world.alpha = 0;
            var worldTween = this.add.tween(this.world).to({ alpha: 1 }, 1000, Phaser.Easing.Exponential.InOut, true);
            worldTween.onComplete.addOnce(function () {
                this.image.visible = true;
                this.painter.started = true;
                this.tons[0].started = true;
                this.tons[1].started = true;
                this.started = true;
                this.startGame();
            }, this);
            this.tiler.alpha = 1;
            this.tons[0].dmass = this.tons[0].mass;
            this.tons[1].dmass = this.tons[1].mass;
            this.createArrows();
            this.gameTimer = this.game.time.create(false);
            var ESCAPE = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
            this.escape = new SSMAT.Exit(this.game, this.world.centerX, this.world.centerY);
            this.escape.visible = false;
            this.escape.toggleVisibility();
            ESCAPE.onDown.add(function () {
                if (this.escape.visible) {
                    this.escape.visible = false;
                    this.escape.toggleVisibility();
                }
                else {
                    this.escape.visible = true;
                    this.escape.toggleVisibility();
                }
            }, this);
        };
        // finally finished on create() constructor. put all the other nonsense functions below
        MainMenu.prototype.setResize = function () {
            var randomMin = (this.game.height / 2) - (this.image.height / 2) - 100;
            var randomMax = (this.game.height) - this.image.height - 200;
            this.image.position.x = (this.game.width / 2) - (this.image.width / 2);
            this.image.position.y = Math.floor(Math.random() * (randomMax - randomMin + 1)) + randomMin;
            this.tiler.position.setTo(0, this.game.height - this.tileHeight);
            this.tiler.width = this.game.width;
            this.grad.y = this.image.position.y - 14;
            this.grad.x = this.image.position.x - 14;
            this.wheelGroup.getChildAt(0).x = this.grad.x - this.wheel.width;
            this.wheelGroup.getChildAt(1).x = this.grad.x + this.grad.width;
            this.timer.position.setTo(this.world.centerX, 20);
            this.tons[0].position.setTo(this.wheelGroup.getChildAt(0).x, this.wheelGroup.getChildAt(0).y + this.wheel.height);
            this.tons[1].position.setTo(this.wheelGroup.getChildAt(1).x + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height);
            this.button.position.setTo(this.game.width - 82 - 100, this.game.height - this.tileHeight - this.button.height);
            this.help.position.setTo(this.button.x + this.button.width + 1, this.button.y);
            this.resetbtn.position.setTo(this.help.x + this.button.width + 1, this.button.y);
            this.vector.position.setTo(this.resetbtn.x + this.button.width + 1, this.button.y);
            this.button.updatePosition();
            this.help.updatePosition();
            this.resetbtn.updatePosition();
            this.vector.updatePosition();
            this.reset();
            var distributeWidth = this.image.position.x;
            var distributeHeight = this.image.position.y;
            for (var i = 0; i < 2; i++) {
                distributeWidth = this.image.position.x;
                for (var j = 0; j < 3; j++) {
                    this.sprite[i][j].position.setTo(distributeWidth, distributeHeight);
                    distributeWidth += this.sprite[i][j].width - 1;
                    var tempPoint = new Phaser.Point(this.sprite[i][j].x + this.sprite[i][j].width / 2, this.sprite[i][j].y + (this.sprite[i][j].height / 2) - (this.painter.height / 2));
                    this.sprite[i][j].angleB = Phaser.Math.angleBetween(tempPoint.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, tempPoint.y);
                    this.sprite[i][j].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, tempPoint.x, tempPoint.y);
                    this.sprite[i][j].angleB = Math.round(this.sprite[i][j].angleB * 100) / 100;
                    this.sprite[i][j].angleA = Math.round(this.sprite[i][j].angleA * 100) / 100;
                    this.sprite[i][j].angleA = Math.round(Phaser.Math.radToDeg(this.sprite[i][j].angleA) * 100) / 100;
                    this.sprite[i][j].angleB = Math.round(Phaser.Math.radToDeg(this.sprite[i][j].angleB) * 100) / 100;
                    this.sprite[i][j].setAnswers(1);
                    console.log(this.sprite[i][j].answerA, this.sprite[i][j].answerB);
                }
                distributeHeight += 126.5;
            }
        };
        // vector arrows lah what else.
        MainMenu.prototype.createArrows = function () {
            var point1 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            var point2 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var arrow0Point = new Phaser.Point((point1.x + this.painter.x) / 2, (point1.y + this.painter.y) / 2);
            var arrow1Point = new Phaser.Point((point2.x + this.painter.x) / 2, (point2.y + this.painter.y) / 2);
            this.arrow[0] = new SSMAT.Arrow(this.game, arrow0Point.x, arrow0Point.y, "arrow-green", -1, true);
            this.arrow[0].rotation = this.tons[0].angleA;
            //
            this.arrow[1] = new SSMAT.Arrow(this.game, arrow1Point.x, arrow1Point.y, "arrow-blue", 1, true);
            this.arrow[1].rotation = -this.tons[1].angleA;
            //
            this.arrow[2] = new SSMAT.Arrow(this.game, this.painter.x, this.painter.y + this.painter.height, "arrow-red", 1, false);
            this.arrow[2].rotation = 1.57079633;
            this.arrow[2].main = this;
            this.hide();
        };
        MainMenu.prototype.resetArrows = function () {
            var point1 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            var point2 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var arrow0Point = new Phaser.Point((point1.x + this.painter.x) / 2, (point1.y + this.painter.y) / 2);
            var arrow1Point = new Phaser.Point((point2.x + this.painter.x) / 2, (point2.y + this.painter.y) / 2);
            this.arrow[0].position.copyFrom(arrow0Point);
            this.arrow[0].rotation = this.tons[0].angleA;
            //
            this.arrow[1].position.copyFrom(arrow1Point);
            this.arrow[1].rotation = -this.tons[1].angleA;
            //
            this.arrow[2].position.copyFrom(this.painter.position);
            this.arrow[2].y += this.painter.height;
        };
        MainMenu.prototype.moveArrows = function () {
            var point1 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            var point2 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var arrow0Point = new Phaser.Point((point1.x + this.painter.x) / 2, (point1.y + this.painter.y) / 2);
            var arrow1Point = new Phaser.Point((point2.x + this.painter.x) / 2, (point2.y + this.painter.y) / 2);
            this.arrow[0].position.copyFrom(arrow0Point);
            //this.arrow[0].rotation = this.tons[0].angleA;
            //
            this.arrow[1].position.copyFrom(arrow1Point);
            //this.arrow[1].rotation = -this.tons[1].angleA;
            //
            this.arrow[2].position.copyFrom(this.painter.position);
            this.arrow[2].y += this.painter.height;
        };
        MainMenu.prototype.checkFinished = function () {
            if (this.noGridCompleted == 6) {
                this.started = false;
                // moving up the fading background's z-index
                this.black = this.add.sprite(0, 0, "black");
                this.black.alpha = 0;
                // adding the global score;
                document.getElementById("scoretime").innerHTML = "Your time: " + this.score;
                // moving up the final image 
                var test = this.image.key;
                var yPos = this.image.position.clone();
                this.image.destroy(true);
                this.image = this.game.add.image(yPos.x, yPos.y, test);
                this.image.width = 450;
                this.image.height = 253;
                var newPos = (this.game.height / 2) - (this.image.height / 2) - 100;
                this.add.tween(this.image).to({ y: 0, x: 0, width: this.game.width, height: this.game.height }, 1000, Phaser.Easing.Exponential.Out, true);
                var inputadmin_no = document.getElementById("inputfield");
                inputadmin_no.style.opacity = '0';
                document.getElementById("inputfield").style.display = "inline";
                this.add.tween(this.timer).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.Out, true);
                var tween = this.add.tween(this.black).to({ alpha: 1 }, 1000, Phaser.Easing.Exponential.Out, true);
                tween.onUpdateCallback(function () {
                    inputadmin_no.style.opacity = String(this.black.alpha);
                }, this);
                tween.onComplete.addOnce(function () {
                    inputadmin_no.style.opacity = String(this.black.alpha);
                    this.game.state.start('GameOver', true, false, this.score, this.clockTime, this.image);
                }, this);
            }
        };
        MainMenu.prototype.startGame = function () {
            this.gameTimer.start();
        };
        MainMenu.prototype.update = function () {
            // this.game.physics.arcade.collide(this.tiler, [this.tons[0], this.tons[1], this.painter]);
            if (this.started && !this.game.paused) {
                this.updateTimer();
            }
        };
        MainMenu.prototype.updateTimer = function () {
            var hours = Math.floor(this.gameTimer.seconds / 3600) % 24;
            var minutes = Math.floor(this.gameTimer.seconds / 60) % 60;
            var seconds = Math.floor(this.gameTimer.seconds) % 60;
            this.clockTime = Math.round(this.gameTimer.seconds * 100) / 100;
            var seconds1 = String(seconds);
            var minutes1 = String(minutes);
            var hours1 = String(hours);
            // if any of the digits becomes a single digit number, pad it with a zero
            if (seconds < 10) {
                seconds1 = '0' + seconds;
            }
            if (minutes < 10) {
                minutes1 = '0' + minutes;
            }
            if (hours < 10) {
                hours1 = '0' + hours;
            }
            this.score = hours1 + ":" + minutes1 + ":" + seconds1;
            this.timer.text = "TIME\n" + hours1 + ":" + minutes1 + ":" + seconds1; // timer height is 40;
        };
        MainMenu.prototype.paintTheLines = function (p1, t) {
            this.moveArrows();
            var ktemp = 0;
            this.graphics.clear();
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round(this.tons[0].x), Math.round(this.tons[0].y));
            this.graphics.lineTo(Math.round(this.tons[0].x), Math.round(this.wheelGroup.getChildAt(0).y + this.wheel.height / 2));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round((this.tons[0].x) + this.wheel.width), Math.round(this.wheelGroup.getChildAt(0).y + this.wheel.height / 2));
            this.graphics.lineTo(Math.round(this.painter.x), Math.round(this.painter.y));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.lineTo(Math.round(this.painter.x), Math.round(this.painter.y));
            this.graphics.lineTo(Math.round((this.tons[1].x) - this.wheel.width), Math.round(this.wheelGroup.getChildAt(1).y + this.wheel.height / 2));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round(this.tons[1].x), Math.round(this.wheelGroup.getChildAt(1).y + this.wheel.height / 2));
            this.graphics.lineTo(Math.round(this.tons[1].x), Math.round(this.tons[1].y));
            if (t == 0) {
                ktemp = 1;
            }
            if (t == 1) {
                ktemp = 0;
            }
            for (var i = 0; i < this.tons[ktemp].ton.length; i++) {
                this.tons[ktemp].ton[i].x = this.tons[ktemp].x;
                if (i == 0) {
                    this.tons[ktemp].ton[i].y = this.tons[ktemp].y + this.tons[ktemp].height;
                }
                else {
                    this.tons[ktemp].ton[i].y = this.tons[ktemp].y + (this.tons[ktemp].height * (i + 1));
                }
            }
            for (i = 0; i < p1.ton.length; i++) {
                p1.ton[i].x = p1.x;
                p1.ton[i].inputEnabled = false;
                if (i == 0) {
                    p1.ton[i].y = p1.y + p1.height;
                }
                else {
                    p1.ton[i].y = p1.y + (p1.height * (i + 1));
                }
            }
            if (p1.ton.length != 0) {
                p1.ton[p1.ton.length - 1].inputEnabled = true;
                p1.ton[p1.ton.length - 1].events.onDragStop.add(this.removeWeight, this);
                p1.ton[p1.ton.length - 1].nT = t;
            }
        };
        // Grey button function: hide the arrows
        MainMenu.prototype.hide = function () {
            for (var i = 0; i < this.arrow.length; i++) {
                this.arrow[i].visible = !this.arrow[i].visible;
                if (i < 2) {
                    this.arrow[i].components[0].visible = this.arrow[i].visible;
                    this.arrow[i].components[1].visible = this.arrow[i].visible;
                }
            }
        };
        // Red button function: adding the weight
        MainMenu.prototype.addWeight = function () {
            var mass = prompt("Please enter the weight/mass:", "0");
            if (Number(mass) > 0 || Number(mass) < 0) {
                var l = this.tons2.length;
                if (l < 5 && l >= 0) {
                    this.tons2[l] = new SSMAT.Tons(this.game, this.button.x - this.button.width - 10, this.game.world.height - this.tileHeight - this.tons[0].height, Number(mass), this.gravity, "add");
                    this.game.physics.arcade.enable(this.tons2[l]);
                    this.tons2[l].body.allowGravity = false;
                    this.tons2[l].inputEnabled = true;
                    this.tons2[l].visible = true;
                    this.tons2[l].input.enableDrag();
                    this.tons2[l].events.onDragStop.add(this.stopDrag, this);
                    this.tons2[l]._dx = this.tons2[0].position.clone();
                    this.tons2[l].anchor.setTo(0.5, 0);
                    if (l != 0) {
                        this.tons2[l].x = this.tons2[l - 1].x - this.tons2[l - 1].width;
                        this.tons2[l - 1].inputEnabled = false;
                        this.tons2[l - 1].events.onDragStop.remove(this.stopDrag, this);
                        this.tons2[l - 1].input.disableDrag();
                    }
                }
            }
        };
        // Yellow button function: showing tips
        MainMenu.prototype.tips = function () {
            var s = [];
            s[0] = "Did you know that you can input negative values to the Tons?";
            s[1] = "If you are stuck, press the green button to reset the pulleys!";
            s[2] = "Hover over to the grey board for the respective angles on each grid!";
            s[3] = "Remember your old friend, TOA CAH SOH?";
            s[4] = "The pulley system is in equilibrium, so every time you add a weight at either side, it will move to the new equilibrium position!";
            s[5] = "Static equilibrium means the sum of the net forces must equal to 0, ring any bell?";
            var no = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
            alert(s[no]);
        };
        // Green button function: resetting the shit out of everything
        MainMenu.prototype.reset = function () {
            this.painter.x = this.game.world.centerX;
            this.painter.y = this.game.height - (this.painter.height + this.tileHeight);
            this.tons[0].y = this.tons[0]._dx.y;
            this.tons[1].y = this.tons[1]._dx.y;
            this.tons[1].angleA = Phaser.Math.angleBetween(this.painter.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, this.painter.y);
            this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, this.painter.x, this.painter.y);
            this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100;
            this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100;
            this.tons[1].convertAngle();
            this.tons[0].convertAngle();
            var temp2 = Math.round((Math.cos(this.tons[0].angleA) / Math.cos(this.tons[1].angleA)) * 1000) / 1000; // Tons1 = Cos(Ton0.angle) / Cos(Ton1.Angle)
            var temp = Math.round((temp2 * (Math.sin(this.tons[1].angleA)) + Math.sin(this.tons[0].angleA)) * 1000) / 1000;
            this.tons[0].force = Math.round((this.painter.force / temp) * 10) / 10;
            this.tons[1].force = Math.round((this.tons[0].force * temp2) * 10) / 10;
            this.tons[0].mass = Math.round((this.tons[0].force / this.gravity) * 10) / 10;
            this.tons[1].mass = Math.round((this.tons[1].force / this.gravity) * 10) / 10;
            this.calcAll();
            this.graphics.clear();
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(this.tons[0].x, this.tons[0].y);
            this.graphics.lineTo(this.tons[0].x, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            this.graphics.lineTo(this.painter.x, this.painter.y);
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(this.painter.x, this.painter.y);
            this.graphics.lineTo((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(this.tons[1].x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            this.graphics.lineTo(this.tons[1].x, this.tons[1].y);
            this.tons[0].clearTon();
            this.tons[1].clearTon();
            this.resetArrows();
        };
        // remove the weight after the thing got dragged out
        MainMenu.prototype.removeWeight = function (p1) {
            var i = 0;
            if (p1.nT == 0) {
                i = 1;
            }
            if (p1.nT == 1) {
                i = 0;
            }
            if (this.game.physics.arcade.overlap(p1, this.tons[i])) {
                p1.position.x = this.tons[i].x;
                p1.position.y = this.tons[i].y + this.tons[i].height;
                this.tons[p1.nT].mass -= p1.mass;
                this.tons[p1.nT].calcForce();
                this.tons[p1.nT].ton.pop();
                if (this.tons[p1.nT].ton.length != 0) {
                    this.tons[p1.nT].ton[this.tons[p1.nT].ton.length - 1].inputEnabled = true;
                    this.tons[p1.nT].ton[this.tons[p1.nT].ton.length - 1].events.onDragStop.add(this.removeWeight, this);
                }
                //this.tons[i].dmass = this.tons[i].mass
                this.tons[i].mass += p1.mass;
                this.tons[i].ton.push(p1);
                p1.events.onDragStop.remove(this.stopDrag, this);
                //p1.destroy();
                this.movePainter(i, true, p1);
                //the pop() method removes the last element of an array
                return;
            }
            if (!this.game.physics.arcade.overlap(p1, this.tons[p1.nT])) {
                if (this.tons[p1.nT].ton.length != 0) {
                    this.tons[p1.nT].ton[this.tons[p1.nT].ton.length - 1].inputEnabled = true;
                    this.tons[p1.nT].ton[this.tons[p1.nT].ton.length - 1].events.onDragStop.add(this.removeWeight, this);
                }
                //this.tons[p1.nT].dmass = this.tons[p1.nT].mass
                this.tons[p1.nT].mass -= p1.mass;
                this.tons[p1.nT].calcForce();
                this.tons[p1.nT].ton.pop();
                p1.destroy();
                this.movePainter(p1.nT, false, p1);
                return;
            }
        };
        // once the added weight is inserted to the current weight
        MainMenu.prototype.stopDrag = function (p1) {
            for (var i = 0; i < 2; i++) {
                if (!this.game.physics.arcade.overlap(p1, this.tons[i])) {
                    p1.position.copyFrom(p1._dx);
                }
                if (this.game.physics.arcade.overlap(p1, this.tons[i])) {
                    p1.position.x = this.tons[i].x;
                    p1.position.y = this.tons[i].y + this.tons[i].height;
                    this.tons[i].mass += p1.mass;
                    p1.percent = ((p1.mass + this.tons[i].dmass) - this.tons[i].dmass) / this.tons[i].dmass;
                    this.tons[i].ton.push(p1);
                    p1.events.onDragStop.remove(this.stopDrag, this);
                    //p1.destroy();
                    this.movePainter(i, true, p1);
                    this.tons2.pop(); //the pop() method removes the last element of an array
                    if (this.tons2.length != 0) {
                        this.tons2[this.tons2.length - 1].inputEnabled = true;
                        this.tons2[this.tons2.length - 1].input.enableDrag();
                        this.tons2[this.tons2.length - 1].events.onDragStop.add(this.stopDrag, this);
                    }
                    break;
                }
            }
        };
        MainMenu.prototype.checkAnswers = function () {
            var array = [];
            array[0] = false;
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 3; j++) {
                    if (this.sprite[i][j].answerA == this.tons[0].mass && this.sprite[i][j].answerB == this.tons[1].mass) {
                        array[0] = true;
                        array[1] = this.sprite[i][j];
                        console.log(array);
                        return array;
                        break;
                    }
                }
            }
            return array;
        };
        // move the painter!
        MainMenu.prototype.movePainter = function (t, dir, p1) {
            this.tons[0].calcForce();
            this.tons[1].calcForce();
            var array = this.checkAnswers();
            var point1 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var point2 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            console.log(this.tons[1].ton.length, "LENGTH TON");
            if (array[0]) {
                this.tons[0].angleA = array[1].angleinRad[0];
                this.tons[1].angleA = array[1].angleinRad[1];
                var velo2 = array[1].painterPos;
                var ton0Y = this.tons[0].body.y;
                var ton1Y = this.tons[1].body.y;
                this.tons[0].dlengtha = Phaser.Math.distance(point2.x, point2.y, this.painter.x, this.painter.y);
                this.tons[0].dlengthb = Phaser.Math.distance(point2.x, point2.y, velo2.x, velo2.y);
                this.tons[0].dlength = this.tons[0].dlengtha - this.tons[0].dlengthb;
                this.tons[0].dlength = this.tons[0].dlength / 2;
                this.tons[1].dlengtha = Phaser.Math.distance(point1.x, point1.y, this.painter.x, this.painter.y);
                this.tons[1].dlengthb = Phaser.Math.distance(point1.x, point1.y, velo2.x, velo2.y);
                this.tons[1].dlength = this.tons[1].dlengtha - this.tons[1].dlengthb;
                this.tons[1].dlength = this.tons[1].dlength / 2;
                ton0Y = ton0Y + this.tons[0].dlength;
                ton1Y = ton1Y + this.tons[1].dlength;
                this.tons[1].tween = this.add.tween(this.tons[1]).to({ y: ton1Y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.tons[0].tween = this.add.tween(this.tons[0]).to({ y: ton0Y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.arrow[1]).to({ rotation: -this.tons[1].angleA }, 2000, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.arrow[0]).to({ rotation: this.tons[0].angleA }, 2000, Phaser.Easing.Exponential.Out, true);
                this.painter.tween = this.add.tween(this.painter).to({ x: velo2.x, y: velo2.y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.painter.tween.onUpdateCallback(function () {
                    this.paintTheLines(this.tons[t], t);
                }, this);
                this.painter.tween.onComplete.add(function () {
                    this.paintTheLines(this.tons[t], t);
                }, this);
                return;
            }
            if (!array[0] && this.tons[0].ton.length == 0 && this.tons[1].ton.length == 0) {
                var velo3 = new Phaser.Point(this.game.world.centerX, this.game.height - (this.painter.height + this.tileHeight));
                this.tons[1].angleA = Phaser.Math.angleBetween(velo3.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, velo3.y);
                this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, velo3.x, velo3.y);
                this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100;
                this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100;
                this.tons[1].convertAngle();
                this.tons[0].convertAngle();
                this.tons[1].tween = this.add.tween(this.tons[1]).to({ y: this.tons[1]._dx.y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.tons[0].tween = this.add.tween(this.tons[0]).to({ y: this.tons[0]._dx.y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.arrow[1]).to({ rotation: -this.tons[1].angleA }, 2000, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.arrow[0]).to({ rotation: this.tons[0].angleA }, 2000, Phaser.Easing.Exponential.Out, true);
                this.painter.tween = this.add.tween(this.painter).to({ x: velo3.x, y: velo3.y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.painter.tween.onUpdateCallback(function () {
                    this.paintTheLines(this.tons[t], t);
                }, this);
                this.painter.tween.onComplete.add(function () {
                    this.paintTheLines(this.tons[t], t);
                }, this);
                return;
            }
            if (!array[0] && (this.tons[0].ton.length > 0 || this.tons[1].ton.length > 0)) {
                var equationA1 = (this.tons[0].calcForce() * 2);
                var equationA2a = this.tons[1].calcPow() - this.tons[0].calcPow();
                var equationA2b = this.painter.force - (equationA2a / this.painter.force);
                var equationA3 = Math.asin(equationA2b / equationA1);
                this.tons[0].angleA = Math.round(equationA3 * 100) / 100; // angle A from the new equib position
                var equationB1 = (this.tons[0].calcForce() / this.tons[1].calcForce()) * Math.cos(this.tons[0].angleA);
                this.tons[1].angleA = Math.round(Math.acos(equationB1) * 100) / 100; // angle B from the new equib position
                this.tons[0].convertAngle();
                this.tons[1].convertAngle();
                if (isNaN(this.tons[0].angleA) && isNaN(this.tons[1].angleA)) {
                    if (this.tons[0].mass > this.tons[1].mass) {
                        this.tons[0].angleA = 1.06;
                        this.tons[1].angleA = 0;
                    }
                    if (this.tons[1].mass > this.tons[0].mass) {
                        this.tons[1].angleA = 1.06;
                        this.tons[0].angleA = 0;
                    }
                    this.dropped = true;
                }
                if (isNaN(this.tons[0].angleA) || this.tons[0].angleA < 0) {
                    this.tons[0].angleA = 0;
                }
                if (isNaN(this.tons[1].angleA) || this.tons[1].angleA < 0) {
                    this.tons[1].angleA = 0;
                }
                //this.tons[0].angleinDeg = Math.round(Phaser.Math.radToDeg(this.tons[0].angleA) * 100) / 100;
                //this.tons[1].angleinDeg = Math.round(Phaser.Math.radToDeg(this.tons[1].angleA) * 100) / 100;
                this.sumFx = this.tons[1].calcFx() - this.tons[0].calcFx(); // formula to find Sum of X components
                this.sumFy = (this.tons[1].calcFy() + this.tons[0].calcFy()) - this.painter.force; // formula to find Sum of Y components
                var velo = this.calcAll();
                var ton0Y = this.tons[0].body.y;
                var ton1Y = this.tons[1].body.y;
                this.tons[0].dlengtha = Phaser.Math.distance(point2.x, point2.y, this.painter.x, this.painter.y);
                this.tons[0].dlengthb = Phaser.Math.distance(point2.x, point2.y, velo.x, velo.y);
                this.tons[0].dlength = this.tons[0].dlengtha - this.tons[0].dlengthb;
                this.tons[0].dlength = this.tons[0].dlength / 2;
                this.tons[1].dlengtha = Phaser.Math.distance(point1.x, point1.y, this.painter.x, this.painter.y);
                this.tons[1].dlengthb = Phaser.Math.distance(point1.x, point1.y, velo.x, velo.y);
                this.tons[1].dlength = this.tons[1].dlengtha - this.tons[1].dlengthb;
                this.tons[1].dlength = this.tons[1].dlength / 2;
                ton0Y = ton0Y + this.tons[0].dlength;
                ton1Y = ton1Y + this.tons[1].dlength;
                this.tons[1].tween = this.add.tween(this.tons[1]).to({ y: ton1Y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.tons[0].tween = this.add.tween(this.tons[0]).to({ y: ton0Y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.arrow[1]).to({ rotation: -this.tons[1].angleA }, 2000, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.arrow[0]).to({ rotation: this.tons[0].angleA }, 2000, Phaser.Easing.Exponential.Out, true);
                this.painter.tween = this.add.tween(this.painter).to({ x: velo.x, y: velo.y }, 2000, Phaser.Easing.Exponential.Out, true);
                this.painter.tween.onUpdateCallback(function () {
                    this.paintTheLines(this.tons[t], t);
                    this.calcAll();
                }, this);
                this.painter.tween.onComplete.add(function () {
                    this.paintTheLines(this.tons[t], t);
                    this.calcAll();
                }, this);
            }
        };
        // calculate the vector points, most probably going to be useless if i make it crash after a wrong answer.
        MainMenu.prototype.calcAll = function () {
            var point1 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var point0 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            var adj = point1.x - point0.x;
            var thirdAngle = Math.PI - this.tons[0].angleA - this.tons[1].angleA;
            var hypa = (adj * Math.sin(this.tons[1].angleA)) / Math.sin(thirdAngle);
            hypa = Math.round(hypa * 100) / 100;
            var hypb = (adj * Math.sin(this.tons[0].angleA)) / Math.sin(thirdAngle);
            hypb = Math.round(hypb * 100) / 100;
            var opp = hypa * Math.sin(this.tons[1].angleA);
            opp = Math.round(opp * 100) / 100;
            var returnX = hypa * Math.cos(this.tons[0].angleA);
            returnX = Math.round(returnX * 100) / 100;
            var t1 = hypa * hypa;
            var t2 = returnX * returnX;
            var t3 = t1 - t2;
            var t4 = Math.sqrt(t3);
            returnX += point0.x;
            var returnY = t4 + point0.y;
            if (returnY > (this.game.height - (this.painter.height + this.tileHeight))) {
                returnY = this.game.height - (this.painter.height + this.tileHeight);
            }
            var distancePoint = new Phaser.Point(returnX, returnY);
            return distancePoint;
        };
        // debugging purposes
        MainMenu.prototype.testClick = function (p1) {
            this.painter.x = p1.x + p1.width / 2;
            this.painter.y = p1.y + p1.height / 2 - this.painter.height / 2;
            this.tons[1].angleA = Phaser.Math.angleBetween(this.painter.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, this.painter.y);
            this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, this.painter.x, this.painter.y);
            this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100;
            this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100;
            this.tons[1].convertAngle();
            this.tons[0].convertAngle();
            var temp2 = (Math.cos(this.tons[0].angleA) / Math.cos(this.tons[1].angleA)); // Tons1 = Cos(Ton0.angle) / Cos(Ton1.Angle)
            var temp = (temp2 * (Math.sin(this.tons[1].angleA)) + Math.sin(this.tons[0].angleA));
            this.tons[0].force = Math.round((this.painter.force / temp) * 10) / 10;
            this.tons[1].force = Math.round((this.tons[0].force * temp2) * 10) / 10;
            this.tons[0].mass = Math.round((this.tons[0].force / this.gravity) * 10) / 10;
            this.tons[1].mass = Math.round((this.tons[1].force / this.gravity) * 10) / 10;
            this.sumFx = this.tons[1].calcFx() - this.tons[0].calcFx(); // formula to find Sum of X components
            this.sumFy = (this.tons[1].calcFy() + this.tons[0].calcFy()) - this.painter.force; // formula to find Sum of Y components
            this.sumR = (this.sumFx * 2) + (this.sumFy * 2);
            if (this.sumR < 0) {
                this.sumR = this.sumR * -1;
            }
            this.sumR = Math.sqrt(this.sumR);
            this.sumR = Math.round(this.sumR * 10) / 10;
            this.paintTheLines(this.tons[0], 0);
            this.calcAll();
        };
        return MainMenu;
    })(Phaser.State);
    SSMAT.MainMenu = MainMenu;
})(SSMAT || (SSMAT = {}));
var SSMAT;
(function (SSMAT) {
    var Painter = (function (_super) {
        __extends(Painter, _super);
        function Painter(game, x, y, mass, gravity) {
            _super.call(this, game, x, y, "painter");
            game.add.existing(this);
            this.mass = mass;
            this.gravity = gravity;
            this.force = Math.round((this.mass * this.gravity) * 10) / 10;
            //var pForce = this.force / 1000;
            this.text = game.add.text(0, 0, "", global_style);
            this.text.anchor.set(0, 0.5);
            this.smoothed = false;
            this.animations.add("paint");
            this.text.setShadow(1, 1, 'rgba(0,0,0,1)', 0.1);
            this.text.align = "left";
        }
        Painter.prototype.update = function () {
            //var pForce = this.force / 1000;
            this.text.text = "M: " + this.mass + "KG\n  F: " + Math.round(this.force * 10) / 10 + "N";
            this.text.x = (this.x + this.width / 2);
            this.text.y = (this.y + this.text.height / 2);
            this.text.x = Math.round(this.text.x);
            this.text.y = Math.round(this.text.y);
        };
        return Painter;
    })(Phaser.Sprite);
    SSMAT.Painter = Painter;
})(SSMAT || (SSMAT = {}));
var SSMAT;
(function (SSMAT) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            //  Set-up our preloader sprite
            this.tileHeight = 30;
            this.preloadBar = this.add.sprite(this.game.width / 2, this.game.height / 2, 'loadEmpty');
            this.preloadBarFill = this.add.sprite(this.game.width / 2, this.game.height / 2, 'loadFill');
            this.preloadBar.x -= this.preloadBar.width / 2;
            this.preloadBar.y -= this.preloadBar.height / 2;
            this.preloadBarFill.x = this.preloadBar.x;
            this.preloadBarFill.y = this.preloadBar.y;
            this.load.setPreloadSprite(this.preloadBarFill);
            for (var i = 1; i < 6; i++) {
                var pic = 'pic' + i;
                var images = 'assets/pictures/' + i + '.jpg';
                this.load.image(pic, images);
            }
            //  Load our actual games assets
            this.load.image('logo', 'assets/logo.gif');
            this.load.image('wheel', 'assets/wheel.gif');
            this.load.image('ton', 'assets/weight.gif');
            this.load.image('click', 'assets/click.gif');
            this.load.image('tile', 'assets/stone-tile.gif');
            this.load.image('black', 'assets/background-menu.gif');
            this.load.image('gradient', 'assets/gradient.gif');
            this.load.image('arrow-red', 'assets/arrow-red.gif');
            this.load.image('arrow-green', 'assets/arrow-green.gif');
            this.load.image('arrow-blue', 'assets/arrow-blue.gif');
            this.load.image('level0', 'assets/level0.gif');
            this.load.image('level1', 'assets/level1.gif');
            this.load.image('exit', 'assets/exit.gif');
            this.load.spritesheet('preloadBar', 'assets/loader.gif', 64, 64);
            this.game.load.spritesheet('painter', 'assets/painter.gif', 50, 48, 4);
            this.game.load.spritesheet('help', 'assets/help.gif', 24, 19, 2);
            this.game.load.spritesheet('button', 'assets/button.gif', 24, 19, 2);
            this.game.load.spritesheet('reset', 'assets/reset.gif', 24, 19, 2);
            this.game.load.spritesheet('vector', 'assets/vector.gif', 24, 19, 2);
            this.game.load.spritesheet('flag', 'assets/flag.gif', 40, 180, 8);
            this.game.load.spritesheet('ok-btn', 'assets/ok-btn.gif', 71, 30, 2);
            this.game.load.spritesheet('cancel-btn', 'assets/cancel-btn.gif', 71, 30, 2);
        };
        Preloader.prototype.create = function () {
            this.levels = [];
            //this.tiler = this.game.add.tileSprite(0, this.world.height - this.tileHeight, this.game.width, this.game.height, 'tile');
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 50, Phaser.Easing.Linear.None, true);
            var tween2 = this.add.tween(this.preloadBarFill).to({ alpha: 0 }, 50, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
            var t = new Phaser.Loader(this.game);
            if (t.hasLoaded) {
                this.preloadBar.alpha = 0;
                this.preloadBarFill.alpha = 0;
            }
        };
        Preloader.prototype.startMainMenu = function () {
            this.logo = this.add.sprite(Math.round(this.world.centerX), this.world.centerY - 1.5, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);
            this.logo.alpha = 0;
            this.click = this.add.sprite(this.world.centerX, this.world.centerY + this.logo.height, 'click');
            this.click.anchor.setTo(0.5, 0.5);
            this.click.alpha = 0;
            this.logo["start"] = this.add.tween(this.logo).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0);
            this.click["start"] = this.add.tween(this.click).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true, 2000, -1, true);
            this.input.onDown.addOnce(function () {
                this.chooseLevel();
                //level_choice = "LeaderBoard";
                //this.game.state.start('MainMenu', true, false)
            }, this);
        };
        Preloader.prototype.chooseLevel = function () {
            this.click.destroy();
            this.logo.destroy();
            this.levels[0] = this.add.sprite(this.world.centerX, this.world.centerY, 'level0');
            this.levels[0].anchor.setTo(0.5, 0.5);
            this.levels[0].position.setTo(this.world.centerX, this.world.centerY - this.levels[0].height);
            this.levels[0].inputEnabled = true;
            this.levels[0].input.useHandCursor = true;
            this.levels[0].alpha = 1;
            this.levels[0].events.onInputOver.add(function () {
                this.tweens.removeAll();
                this.levels[0]["tween"] = this.add.tween(this.levels[0]).to({ alpha: 0.1 }, 250, Phaser.Easing.Linear.None, true, 0, -1, true);
            }, this);
            this.levels[0].events.onInputOut.add(function () {
                this.tweens.removeAll();
                this.levels[0]["tween"] = this.add.tween(this.levels[0]).to({ alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
            }, this);
            this.levels[0].events.onInputUp.addOnce(function () {
                level_choice = "LeaderBoard";
                this.game.state.start('MainMenu', true, false);
            }, this);
            this.levels[1] = this.add.sprite(this.world.centerX, this.world.centerY, 'level1');
            this.levels[1].visible = true;
            this.levels[1].anchor.setTo(0.5, 0.5);
            this.levels[1].position.setTo(this.world.centerX, this.world.centerY + this.levels[0].height);
            this.levels[1].inputEnabled = true;
            this.levels[1].input.useHandCursor = true;
            this.levels[1].events.onInputUp.addOnce(function () {
                level_choice = "LeaderBoard2";
                //  uncomment this if advanced level is accepted
                this.game.state.start('AdvancedMenu', true, false);
            }, this);
            this.levels[1].events.onInputOver.add(function () {
                this.tweens.removeAll();
                this.add.tween(this.levels[1]).to({ alpha: 0.1 }, 250, Phaser.Easing.Linear.None, true, 0, -1, true);
            }, this);
            this.levels[1].events.onInputOut.add(function () {
                this.tweens.removeAll();
                this.add.tween(this.levels[1]).to({ alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
            }, this);
        };
        return Preloader;
    })(Phaser.State);
    SSMAT.Preloader = Preloader;
})(SSMAT || (SSMAT = {}));
var SSMAT;
(function (SSMAT) {
    var Tons = (function (_super) {
        __extends(Tons, _super);
        function Tons(game, x, y, mass, gravity, name) {
            _super.call(this, game, x, y, "ton");
            game.add.existing(this);
            this.anchor.setTo(0.5, 0);
            this.dy = y;
            this.mass = mass;
            this.dmass = mass;
            this.gravity = gravity;
            this.calcForce();
            this.angleinDeg = Math.round(Phaser.Math.radToDeg(this.angleA) * 100) / 100;
            this.angleinDeg = Math.round(Phaser.Math.radToDeg(this.angleA) * 100) / 100;
            this.ton = [];
            this.smoothed = false;
            if (name == "left" || name == "right") {
                this.text = game.add.text(0, 0, "", global_style);
                this.text.smoothed = false;
                this.text.anchor.set(0, 0.5);
                this.text.setShadow(1, 1, 'rgba(0,0,0,1)', 0.1);
                this.text.align = "center";
                this.textAngle = game.add.text(0, 0, "", global_style);
                this.textAngle.setShadow(1, 1, 'rgba(0,0,0,1)', 0.1);
                this.textAngle.smoothed = false;
                this.textAngle.align = "center";
                this.text.x = Math.round(this.text.x);
                this.text.y = Math.round(this.text.y);
                this.textAngle.y = Math.round(this.textAngle.y);
                this.textAngle.x = Math.round(this.textAngle.x);
                this.text.smoothed = false;
                this.textAngle.smoothed = false;
                if (name == "left") {
                    this.text.anchor.set(1.6, 0.5);
                }
                if (name == "right") {
                    this.text.anchor.set(-0.6, 0.5);
                }
            }
        }
        Tons.prototype.clearTon = function () {
            if (this.ton.length > 0) {
                for (var i = 0; i < this.ton.length; i++) {
                    this.ton[i].destroy();
                }
            }
            this.ton = [];
        };
        Tons.prototype.convertAngle = function () {
            this.angleinDeg = Math.round(Phaser.Math.radToDeg(this.angleA) * 100) / 100;
            this.angleA = Phaser.Math.degToRad(this.angleinDeg);
            return this.angleA;
        };
        Tons.prototype.update = function () {
            if (this.name == "left" || this.name == "right") {
                this.convertAngle();
                if (this.started) {
                    this.visible = true;
                    this.textAngle.visible = true;
                    this.text.visible = true;
                    this.started = false;
                }
                if (this.calcForce() >= 1000) {
                    this.force = this.calcForce() / 1000;
                    this.text.text = "M: " + this.mass + "KG\nF: " + Math.round(this.force * 1000) / 1000 + "kN";
                }
                if (this.calcForce() < 1000) {
                    this.text.text = "M: " + this.mass + "KG\nF: " + Math.round(this.force * 100) / 100 + "N";
                }
                if (this.name == "left") {
                    this.textAngle.text = "α: " + String(this.angleinDeg) + "\xB0";
                    this.textAngle.x = this.main.painter.x - this.main.painter.width / 2 - this.textAngle.width;
                    this.text.x = (this.x - this.width / 2);
                }
                if (this.name == "right") {
                    this.textAngle.text = "β: " + String(this.angleinDeg) + "\xB0";
                    this.textAngle.x = this.main.painter.x + this.main.painter.width / 2;
                    this.text.x = (this.x + this.width / 2);
                }
                this.textAngle.y = this.main.painter.y - this.textAngle.height;
                this.text.y = (this.y + this.height / 2);
                //round off;
                this.text.x = Math.round(this.text.x);
                this.text.y = Math.round(this.text.y);
                this.textAngle.y = Math.round(this.textAngle.y);
                this.textAngle.x = Math.round(this.textAngle.x);
            }
        };
        Tons.prototype.calcPow = function () {
            var a = Math.pow(this.calcForce(), 2);
            return a;
        };
        Tons.prototype.calcForce = function () {
            this.mass = Math.round(this.mass * 10) / 10;
            this.force = Math.round((this.mass * this.gravity) * 10) / 10;
            return this.force;
        };
        Tons.prototype.calcFx = function () {
            this.fx = this.calcForce() * Math.cos(this.angleA);
            this.fx = Math.round(this.fx);
            return this.fx;
        };
        Tons.prototype.calcFy = function () {
            this.fy = this.calcForce() * Math.sin(this.angleA);
            this.fy = Math.round(this.fy);
            return this.fy;
        };
        return Tons;
    })(Phaser.Sprite);
    SSMAT.Tons = Tons;
})(SSMAT || (SSMAT = {}));
//# sourceMappingURL=game.js.map