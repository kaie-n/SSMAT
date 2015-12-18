var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SSMAT;
(function (SSMAT) {
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid(game, x, y) {
            var bmd = new Phaser.Graphics(game, 0, 0);
            bmd.beginFill(0x904820);
            bmd.lineStyle(1, 0x682401, 1);
            bmd.drawRect(0, 0, 150, 127);
            bmd.endFill();
            bmd.boundsPadding = 0;
            var texture = bmd.generateTexture();
            _super.call(this, game, x, y, texture);
            game.add.existing(this);
            var style = { font: "14px Courier", fill: "#FFFFFF", wordWrap: false, wordWrapWidth: this.width, align: "center" };
            this.text = game.add.text(0, 0, "", style);
            this.text.anchor.set(0.5);
            this.text.visible = true;
            this.smoothed = false;
            this.text.x = Math.floor(this.x + this.width / 2);
            this.text.y = Math.floor(this.y + this.height / 2);
            this.text.alpha = 0;
            this.events.onInputOver.add(function () {
                var tween = this.main.add.tween(this.text).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            }, this);
            this.events.onInputOut.add(function () {
                var tween = this.main.add.tween(this.text).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            }, this);
            this.angleinRad = [];
        }
        Grid.prototype.setAnswers = function () {
            this.angleinRad[0] = Phaser.Math.degToRad(this.angleA);
            this.angleinRad[1] = Phaser.Math.degToRad(this.angleB);
            var temp2 = (Math.cos(this.angleinRad[0]) / Math.cos(this.angleinRad[1]));
            var temp = (temp2 * (Math.sin(this.angleinRad[1])) + Math.sin(this.angleinRad[0]));
            var force0 = Math.round((this.main.painter.force / temp) * 10) / 10;
            var force1 = Math.round((force0 * temp2) * 10) / 10;
            this.answerA = Math.round((force0 / this.main.gravity) * 10) / 10;
            this.answerB = Math.round((force1 / this.main.gravity) * 10) / 10;
        };
        Grid.prototype.update = function () {
            if (this.main.started) {
                this.text.text = "α: " + String(this.angleA) + " β: " + String(this.angleB);
            }
            if (this.main.tons[0].angleinDeg == this.angleA && this.main.tons[1].angleinDeg == this.angleB && this.alpha == 1 && this.main.tons[0].mass == this.answerA && this.main.tons[1].mass == this.answerB) {
                var tween = this.main.add.tween(this).to({ alpha: 0 }, 4000, Phaser.Easing.Linear.None, true, 2000);
                tween.onComplete.add(function () {
                    this.main.painter.animations.stop(null, true);
                }, this);
                tween.onStart.addOnce(function () {
                    this.main.painter.animations.play("paint", 8, true);
                }, this);
            }
        };
        return Grid;
    })(Phaser.Sprite);
    SSMAT.Grid = Grid;
})(SSMAT || (SSMAT = {}));
