var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SSMAT;
(function (SSMAT) {
    var Arrow = (function (_super) {
        __extends(Arrow, _super);
        function Arrow(game, x, y, key) {
            _super.call(this, game, x, y, key);
            this.anchor.setTo(0, 0.5);
            game.add.existing(this);
        }
        return Arrow;
    })(Phaser.Sprite);
    SSMAT.Arrow = Arrow;
})(SSMAT || (SSMAT = {}));
