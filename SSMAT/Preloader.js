var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SSMAT;
(function (SSMAT) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloadBar');
            this.preloadBar.animations.add('load');
            this.preloadBar.animations.play('load', 24, true);
            this.load.image('titlepage', 'assets/background.jpg');
            this.load.image('logo', 'assets/logo.png');
            this.load.image('wheel', 'assets/wheel.png');
            this.load.image('ton', 'assets/weight.png');
            this.load.image('click', 'assets/click.png');
            this.load.image('tile', 'assets/tile.jpg');
            this.load.image('pic', 'assets/image.png');
            this.load.image('black', 'assets/background-menu.jpg');
            this.game.load.spritesheet('painter', 'assets/painter.png', 50, 77, 9);
            this.game.load.spritesheet('help', 'assets/help.png', 24, 19, 2);
            this.game.load.spritesheet('button', 'assets/button.png', 24, 19, 2);
            this.game.load.spritesheet('reset', 'assets/reset.png', 24, 19, 2);
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };
        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return Preloader;
    })(Phaser.State);
    SSMAT.Preloader = Preloader;
})(SSMAT || (SSMAT = {}));
