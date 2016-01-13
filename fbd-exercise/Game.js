window.onload = function () {
    var game = new fbd.Game();
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
    var Diagram = (function (_super) {
        __extends(Diagram, _super);
        function Diagram(game, x, y, key) {
            _super.call(this, game, x, y, key);
            game.add.existing(this);
            this.picture = this.game.add.sprite(0, 0, key);
            var width = 150; // example;
            var height = 100; // example;
            var bmd = this.game.add.bitmapData(width, height);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, width, height);
            bmd.ctx.fillStyle = '#ffffff';
            bmd.ctx.fill();
            bmd.ctx.strokeStyle = '#000000';
            bmd.ctx.stroke();
            this.squareBox = this.game.add.sprite(this.game.world.width, this.picture.height, bmd);
            this.squareBox.anchor.setTo(1, 1);
            this.clickRegion = new Phaser.Rectangle(184, 66, 200, 200);
            this.clickRegion.x -= this.clickRegion.halfWidth;
            this.clickRegion.y -= this.clickRegion.halfHeight;
            this.game.input.onDown.add(this.drag, this);
            this.vector = [];
            this.vector[0] = new fbd.Vector(this.game, 0, 0);
        }
        Diagram.prototype.update = function () {
            if (this.game.input.mousePointer.isDown) {
                this.drag(this.game.input);
            }
        };
        Diagram.prototype.drag = function (pointer) {
            var inside = this.clickRegion.contains(pointer.x, pointer.y); //do whatever with the result  
            if (inside) {
                this.vector[0].bmd.clear();
                this.vector[0].bmd.ctx.beginPath();
                this.vector[0].bmd.ctx.beginPath();
                this.vector[0].bmd.ctx.moveTo(184, 66);
                this.vector[0].bmd.ctx.lineTo(this.rounder(pointer.x), this.rounder(pointer.y));
                this.vector[0].bmd.ctx.lineWidth = 2;
                this.vector[0].bmd.ctx.stroke();
                this.vector[0].bmd.ctx.closePath();
                this.vector[0].bmd.render();
            }
            console.log(this.rounder(pointer.x), this.rounder(pointer.y));
        };
        Diagram.prototype.rounder = function (x) {
            return Math.ceil(x / 5) * 5;
        };
        return Diagram;
    })(Phaser.Sprite);
    fbd.Diagram = Diagram;
})(fbd || (fbd = {}));
var fbd;
(function (fbd) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 623, 300, Phaser.CANVAS, 'cannyvas', null, true, false);
            this.state.add('Boot', fbd.Boot, false);
            this.state.add('Preloader', fbd.Preloader, false);
            this.state.add('MainMenu', fbd.MainMenu, false);
            this.state.add('Question1', fbd.Question1, false);
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
            this.game.state.start('Question1', true, false);
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
            for (var i = 1; i < 2; i++) {
                var pic = 'pic' + i;
                var images = 'assets/questions/' + i + '.gif';
                this.load.image(pic, images);
            }
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
    var Question1 = (function (_super) {
        __extends(Question1, _super);
        function Question1() {
            _super.apply(this, arguments);
        }
        Question1.prototype.create = function () {
            this.diagram = new fbd.Diagram(this.game, 0, 0, "pic1");
        };
        Question1.prototype.render = function () {
        };
        return Question1;
    })(Phaser.State);
    fbd.Question1 = Question1;
})(fbd || (fbd = {}));
var fbd;
(function (fbd) {
    var Vector = (function (_super) {
        __extends(Vector, _super);
        function Vector(game, x, y) {
            this.bmd = game.add.bitmapData(game.width, game.height);
            _super.call(this, game, x, y, this.bmd);
            game.add.existing(this);
            this.bmd.ctx.strokeStyle = "black";
        }
        return Vector;
    })(Phaser.Sprite);
    fbd.Vector = Vector;
})(fbd || (fbd = {}));
//# sourceMappingURL=game.js.map