var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            var style = { font: "14px Courier", fill: "#FFFFFF", wordWrap: false, wordWrapWidth: this.width, align: "left" };
            this.text = game.add.text(0, 0, "", style);
            this.text.anchor.set(0, 0.5);
            this.text.visible = false;
            this.smoothed = false;
            this.animations.add("paint");
            this.text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 1);
        }
        Painter.prototype.update = function () {
            if (this.started) {
                this.text.visible = true;
                this.text.text = "M: " + this.mass + "KG \nF: " + Math.round(this.force * 10) / 10 + "N";
                this.text.x = (this.x + this.width / 2);
                this.text.y = (this.y + this.text.height / 2);
            }
        };
        return Painter;
    })(Phaser.Sprite);
    SSMAT.Painter = Painter;
})(SSMAT || (SSMAT = {}));
