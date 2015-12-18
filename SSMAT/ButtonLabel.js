var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SSMAT;
(function (SSMAT) {
    var ButtonLabel = (function (_super) {
        __extends(ButtonLabel, _super);
        function ButtonLabel(game, x, y, key, label, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {
            _super.call(this, game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
            game.add.existing(this);
            var style = { font: "14px Courier", fill: "#FFFFFF", wordWrap: false, wordWrapWidth: this.width, align: "left" };
            this.label = game.add.text(0, 0, label, style);
            this.label.y = this.game.world.height - 11 - this.height;
            this.label.x = this.x;
            this.label.anchor.set(0.5, 0.5);
            this.label.y = this.label.y - this.label.height / 2;
            this.label.visible = false;
            this.label.setShadow(1, 1, 'rgba(0,0,0,0.5)', 1);
            this.events.onInputOver.add(function () { this.label.visible = true; }, this);
            this.events.onInputOut.add(function () { this.label.visible = false; }, this);
            this.events.onInputDown.add(function () { this.label.visible = false; }, this);
        }
        return ButtonLabel;
    })(Phaser.Button);
    SSMAT.ButtonLabel = ButtonLabel;
})(SSMAT || (SSMAT = {}));
