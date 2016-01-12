var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SSMAT;
(function (SSMAT) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.spritesheet('preloadBar', 'assets/loader.gif', 64, 64);
        };
        Boot.prototype.create = function () {
            Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
            Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    SSMAT.Boot = Boot;
})(SSMAT || (SSMAT = {}));
