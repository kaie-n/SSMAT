module SSMAT{

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;
        logo: Phaser.Sprite;
        click: Phaser.Sprite;
        tiler: Phaser.TileSprite;
        tileHeight: number;
        preload() {

            //  Set-up our preloader sprite
            this.tileHeight = 30;
            this.preloadBar = this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloadBar');
            this.preloadBar.anchor.setTo(0.5, 0.5);
            this.preloadBar.position.setTo(this.game.width / 2, this.game.height / 2);

            this.preloadBar.animations.add('load');
            this.preloadBar.animations.play('load', 24, true);
            this.load.setPreloadSprite(this.preloadBar);

            for (var i = 1; i < 6; i++) {
                var pic = 'pic' + i; 
                var images = 'assets/pictures/' + i + '.jpg';
                this.load.image(pic, images);
            }
            //  Load our actual games assets
            this.load.image('titlepage', 'assets/background.png');
            this.load.image('logo', 'assets/logo.png');
            this.load.image('wheel', 'assets/wheel.png');
            this.load.image('ton', 'assets/weight.png');
            this.load.image('click', 'assets/click.png');
            this.load.image('tile', 'assets/stone-tile.jpg');
            this.load.image('pic', 'assets/image.png');
            this.load.image('black', 'assets/background-menu.png');
            this.load.image('gradient', 'assets/gradient.gif');
            this.load.image('arrow-red', 'assets/arrow.png');
            this.load.image('arrow-green', 'assets/arrow-green.png');
            this.load.image('arrow-blue', 'assets/arrow-blue.png');
            this.game.load.spritesheet('painter', 'assets/painter.png', 50, 48, 4);
            this.game.load.spritesheet('help', 'assets/help.png', 24, 19, 2);
            this.game.load.spritesheet('button', 'assets/button.png', 24, 19, 2);
            this.game.load.spritesheet('reset', 'assets/reset.png', 24, 19, 2);
        }

        create() {
            this.tiler = this.game.add.tileSprite(0, this.world.height - this.tileHeight, this.game.width, this.game.height, 'tile');
            var tween = this.add.tween(this.preloadBar).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        }

        startMainMenu() {
            this.preloadBar.destroy();
            this.logo = this.add.sprite(this.world.centerX, this.world.centerY, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);
            this.logo.alpha = 0;
            this.click = this.add.sprite(this.world.centerX, this.world.centerY, 'click');
            this.click.anchor.setTo(0.5, 0.5);
            this.click.alpha = 0;
            this.logo["start"] = this.add.tween(this.logo).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0);
            this.click["start"] = this.add.tween(this.click).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true, 2000, -1, true);
            this.input.onDown.addOnce(function () {
                this.game.state.start('MainMenu', true, false)
            }, this);

        }

    }

}