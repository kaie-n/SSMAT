var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
                this.text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 1);
                this.text.align = "center";
                this.textAngle = game.add.text(0, 0, "", global_style);
                this.textAngle.setShadow(1, 1, 'rgba(0,0,0,1)', 1);
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
