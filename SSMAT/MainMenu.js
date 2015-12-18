var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SSMAT;
(function (SSMAT) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            Parse.User.logOut();
            this.style = { font: "14px Courier", fill: "#FFFFFF", wordWrap: false, wordWrapWidth: 0, align: "center" };
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.score = "";
            this.pulleyMass = 100;
            this.gravity = 9.81;
            this.dt = 0.0833333333333333;
            this.t = 0;
            this.equil = false;
            this.started = false;
            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;
            this.tiler = this.game.add.tileSprite(0, this.world.height - 11, 800, 600, 'tile');
            this.tiler.alpha = 0;
            this.game.physics.arcade.enable(this.tiler);
            this.tiler.body.immovable = true;
            this.tiler.body.allowGravity = false;
            this.image = this.game.add.image(0, 0, 'pic');
            this.image.position.x = (this.game.width / 2) - (this.image.width / 2);
            this.image.position.y = (this.game.height / 2) - (this.image.height / 2) - 100;
            this.image.alpha = 0;
            this.image.visible = false;
            var distributeWidth = this.image.position.x;
            var distributeHeight = this.image.position.y;
            this.sprite = [];
            this.spriteGroup = this.game.add.group();
            for (var i = 0; i < 2; i++) {
                this.sprite[i] = [];
                distributeWidth = this.image.position.x;
                for (var j = 0; j < 3; j++) {
                    this.sprite[i][j] = new SSMAT.Grid(this.game, distributeWidth, distributeHeight);
                    this.sprite[i][j].alpha = 1;
                    distributeWidth += this.sprite[i][j].width - 1;
                    this.sprite[i][j].inputEnabled = true;
                    this.sprite[i][j].main = this;
                    this.spriteGroup.addChild(this.sprite[i][j]);
                }
                distributeHeight += 126.5;
            }
            this.spriteGroup.alpha = 0;
            this.painter = new SSMAT.Painter(this.game, this.world.centerX, this.game.height, 90, this.gravity);
            this.painter.y -= this.painter.height + 11;
            this.painter.anchor.setTo(0.5, 0);
            this.painter.alpha = 0;
            this.game.physics.arcade.enable(this.painter);
            this.wheelGroup = this.game.add.group();
            this.wheel = this.add.sprite(0, 0, 'wheel', 0);
            this.wheelGroup.addChild(this.wheel);
            this.wheel = this.add.sprite(0, 0, 'wheel', 0);
            this.wheelGroup.addChild(this.wheel);
            this.wheelGroup.getChildAt(0).x = 109;
            this.wheelGroup.getChildAt(1).x = 655;
            this.wheelGroup.alpha = 0;
            this.tons = [];
            this.tons2 = [];
            this.tons[0] = new SSMAT.Tons(this.game, this.wheelGroup.getChildAt(0).x, this.wheelGroup.getChildAt(0).y + this.wheel.height, 10, this.gravity);
            this.tons[1] = new SSMAT.Tons(this.game, this.wheelGroup.getChildAt(1).x + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height, 10, this.gravity);
            this.tons[0].main = this;
            this.tons[1].main = this;
            this.tons[0].name = "left";
            this.tons[1].name = "right";
            this.game.physics.arcade.enable([this.tons[0], this.tons[1]]);
            this.tons[0].body.allowGravity = false;
            this.tons[1].body.allowGravity = false;
            this.graphics = this.add.graphics(0, 0);
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
            this.black = this.add.sprite(0, 0, "black");
            this.black.alpha = 1;
            this.logo = this.add.sprite(this.world.centerX, this.world.centerY, 'logo');
            this.logo.alpha = 0;
            this.logo.anchor.setTo(0.5, 0.5);
            this.click = this.add.sprite(this.world.centerX, this.world.centerY, 'click');
            this.click.alpha = 0;
            this.click.anchor.setTo(0.5, 0.5);
            this.add.tween(this.black).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            this.logo["start"] = this.add.tween(this.logo).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0);
            this.click["start"] = this.add.tween(this.click).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true, 2000, -1, true);
            this.input.onDown.addOnce(this.fadeOut, this);
            this.button = new SSMAT.ButtonLabel(this.game, this.game.world.width - 82, this.game.world.height - 11, 'button', "Add Weight", this.addWeight, this, 0, 0, 1, 0);
            this.button.y -= this.button.height;
            this.button.anchor.setTo(0.5, 0);
            this.button.visible = false;
            this.button.alpha = 0;
            this.help = new SSMAT.ButtonLabel(this.game, this.button.x + this.button.width + 1, this.button.y, 'help', "Tips", this.tips, this, 0, 0, 1, 0);
            this.help.anchor.setTo(0.5, 0);
            this.help.visible = false;
            this.help.alpha = 0;
            this.resetbtn = new SSMAT.ButtonLabel(this.game, this.help.x + this.button.width + 1, this.button.y, 'reset', "Reset!", this.reset, this, 0, 0, 1, 0);
            this.resetbtn.anchor.setTo(0.5, 0);
            this.resetbtn.alpha = 0;
            this.resetbtn.visible = false;
            this.tons[1].angleA = Phaser.Math.angleBetween(this.painter.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, this.painter.y);
            this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, this.painter.x, this.painter.y);
            this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100;
            this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100;
            var temp2 = Math.round((Math.cos(this.tons[0].angleA) / Math.cos(this.tons[1].angleA)) * 1000) / 1000;
            var temp = Math.round((temp2 * (Math.sin(this.tons[1].angleA)) + Math.sin(this.tons[0].angleA)) * 1000) / 1000;
            this.tons[0].force = Math.round((this.painter.force / temp) * 10) / 10;
            this.tons[1].force = Math.round((this.tons[0].force * temp2) * 10) / 10;
            this.tons[0].mass = Math.round((this.tons[0].force / this.gravity) * 10) / 10;
            this.tons[1].mass = Math.round((this.tons[1].force / this.gravity) * 10) / 10;
            this.tons[0]._dx = this.tons[0].position.clone();
            this.tons[1]._dx = this.tons[1].position.clone();
            this.graphics.visible = false;
        };
        MainMenu.prototype.fadeOut = function () {
            this.tweens.remove(this.click["start"]);
            this.tweens.remove(this.logo["start"]);
            var tween = this.add.tween(this.logo).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.click).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
            tween.onStart.add(function () {
                this.wheelGroup.alpha = 1;
                this.painter.alpha = 1;
                this.tiler.alpha = 1;
                this.black.alpha = 1;
                this.spriteGroup.alpha = 1;
                this.background.alpha = 1;
                this.painter.started = true;
                this.tons[0].started = true;
                this.tons[1].started = true;
                this.button.visible = true;
                this.help.visible = true;
                this.resetbtn.visible = true;
                this.image.visible = true;
                this.graphics.visible = true;
            }, this);
            this.add.tween(this.black).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.button).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.help).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.resetbtn).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            this.timer = this.game.add.text(this.world.centerX, 20, "TIME\n00:00:00", this.style);
            this.timer.alpha = 0;
            this.timer.setShadow(1, 1, 'rgba(0,0,0,0.5)', 1);
            this.timer.anchor.setTo(0.5, 0);
            this.add.tween(this.timer).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
        };
        MainMenu.prototype.startGame = function () {
            this.background.alpha = 1;
            this.image.alpha = 1;
            this.game.time.reset();
            this.started = true;
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 3; j++) {
                    var tempPoint = new Phaser.Point(this.sprite[i][j].x + this.sprite[i][j].width / 2, this.sprite[i][j].y + (this.sprite[i][j].height / 2) - (this.painter.height / 2));
                    this.sprite[i][j].angleB = Phaser.Math.angleBetween(tempPoint.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, tempPoint.y);
                    this.sprite[i][j].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, tempPoint.x, tempPoint.y);
                    this.sprite[i][j].angleB = Math.round(this.sprite[i][j].angleB * 100) / 100;
                    this.sprite[i][j].angleA = Math.round(this.sprite[i][j].angleA * 100) / 100;
                    this.sprite[i][j].angleA = Math.round(Phaser.Math.radToDeg(this.sprite[i][j].angleA) * 100) / 100;
                    this.sprite[i][j].angleB = Math.round(Phaser.Math.radToDeg(this.sprite[i][j].angleB) * 100) / 100;
                    this.sprite[i][j].setAnswers();
                }
            }
        };
        MainMenu.prototype.update = function () {
            this.game.physics.arcade.collide(this.tiler, [this.tons[0], this.tons[1], this.painter]);
            if (this.started) {
                this.updateTimer();
            }
        };
        MainMenu.prototype.updateTimer = function () {
            var hours = Math.floor(this.game.time.totalElapsedSeconds() / 3600) % 24;
            var minutes = Math.floor(this.game.time.totalElapsedSeconds() / 60) % 60;
            var seconds = Math.floor(this.game.time.totalElapsedSeconds()) % 60;
            var seconds1 = String(seconds);
            var minutes1 = String(minutes);
            var hours1 = String(hours);
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
            this.timer.text = "TIME\n" + hours1 + ":" + minutes1 + ":" + seconds1;
        };
        MainMenu.prototype.paintTheLines = function (p1, t) {
            var ktemp = 0;
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
        MainMenu.prototype.addWeight = function () {
            var mass = prompt("Please enter the weight/mass:", "0");
            if (Number(mass) > 0 || Number(mass) < 0) {
                var l = this.tons2.length;
                if (l < 5 && l >= 0) {
                    this.tons2[l] = new SSMAT.Tons(this.game, this.button.x - this.button.width - 10, this.game.world.height - 11 - this.tons[0].height, Number(mass), this.gravity);
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
        MainMenu.prototype.tips = function () {
            this.game.state.start('GameOver', true, false, this.score, this.game.time.totalElapsedSeconds());
        };
        MainMenu.prototype.reset = function () {
            this.painter.x = this.world.centerX;
            this.painter.y = this.game.height - this.painter.height - 11;
            this.tons[0].y = this.tons[0]._dx.y;
            this.tons[1].y = this.tons[1]._dx.y;
            this.tons[1].angleA = Phaser.Math.angleBetween(this.painter.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, this.painter.y);
            this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, this.painter.x, this.painter.y);
            this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100;
            this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100;
            this.tons[1].convertAngle();
            this.tons[0].convertAngle();
            var temp2 = Math.round((Math.cos(this.tons[0].angleA) / Math.cos(this.tons[1].angleA)) * 1000) / 1000;
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
        };
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
                this.tons[i].mass += p1.mass;
                this.tons[i].ton.push(p1);
                p1.events.onDragStop.remove(this.stopDrag, this);
                this.movePainter(i, true, p1.mass);
                return;
            }
            if (!this.game.physics.arcade.overlap(p1, this.tons[p1.nT])) {
                if (this.tons[p1.nT].ton.length != 0) {
                    this.tons[p1.nT].ton[this.tons[p1.nT].ton.length - 1].inputEnabled = true;
                    this.tons[p1.nT].ton[this.tons[p1.nT].ton.length - 1].events.onDragStop.add(this.removeWeight, this);
                }
                this.tons[p1.nT].mass -= p1.mass;
                this.tons[p1.nT].calcForce();
                this.movePainter(p1.nT, false, p1.mass);
                this.tons[p1.nT].ton.pop();
                p1.destroy();
                return;
            }
        };
        MainMenu.prototype.stopDrag = function (p1) {
            for (var i = 0; i < 2; i++) {
                if (!this.game.physics.arcade.overlap(p1, this.tons[i])) {
                    p1.position.copyFrom(p1._dx);
                }
                if (this.game.physics.arcade.overlap(p1, this.tons[i])) {
                    p1.position.x = this.tons[i].x;
                    p1.position.y = this.tons[i].y + this.tons[i].height;
                    this.tons[i].mass += p1.mass;
                    this.tons[i].ton.push(p1);
                    p1.events.onDragStop.remove(this.stopDrag, this);
                    this.movePainter(i, true, p1.mass);
                    this.tons2.pop();
                    if (this.tons2.length != 0) {
                        this.tons2[this.tons2.length - 1].inputEnabled = true;
                        this.tons2[this.tons2.length - 1].input.enableDrag();
                        this.tons2[this.tons2.length - 1].events.onDragStop.add(this.stopDrag, this);
                    }
                    break;
                }
            }
        };
        MainMenu.prototype.movePainter = function (t, dir, mass) {
            var point1 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var point2 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            var equationA1 = (this.tons[0].calcForce() * 2);
            var equationA2a = this.tons[1].calcPow() - this.tons[0].calcPow();
            var equationA2b = this.painter.force - (equationA2a / this.painter.force);
            var equationA3 = Math.asin(equationA2b / equationA1);
            this.tons[0].angleA = Math.round(equationA3 * 100) / 100;
            var equationB1 = (this.tons[0].calcForce() / this.tons[1].calcForce()) * Math.cos(this.tons[0].angleA);
            this.tons[1].angleA = Math.round(Math.acos(equationB1) * 100) / 100;
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
            }
            if (isNaN(this.tons[0].angleA) || this.tons[0].angleA < 0) {
                this.tons[0].angleA = 0;
            }
            if (isNaN(this.tons[1].angleA) || this.tons[1].angleA < 0) {
                this.tons[1].angleA = 0;
            }
            this.sumFx = this.tons[1].calcFx() - this.tons[0].calcFx();
            this.sumFy = (this.tons[1].calcFy() + this.tons[0].calcFy()) - this.painter.force;
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
            this.painter.tween = this.add.tween(this.painter).to({ x: velo.x, y: velo.y }, 2000, Phaser.Easing.Exponential.Out, true);
            this.tons[1].tween = this.add.tween(this.tons[1]).to({ y: ton1Y }, 2000, Phaser.Easing.Exponential.Out, true);
            this.tons[0].tween = this.add.tween(this.tons[0]).to({ y: ton0Y }, 2000, Phaser.Easing.Exponential.Out, true);
            this.painter.tween.onUpdateCallback(function () {
                this.paintTheLines(this.tons[t], t);
                this.calcAll();
            }, this);
            this.painter.tween.onComplete.add(function () {
                this.paintTheLines(this.tons[t], t);
                this.calcAll();
            }, this);
        };
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
            if (returnY > 512) {
                returnY = 512;
            }
            var distancePoint = new Phaser.Point(returnX, returnY);
            return distancePoint;
        };
        return MainMenu;
    })(Phaser.State);
    SSMAT.MainMenu = MainMenu;
})(SSMAT || (SSMAT = {}));
