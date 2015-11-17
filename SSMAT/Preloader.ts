module SSMAT{

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {

            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloadBar');
            this.preloadBar.animations.add('load');
            this.preloadBar.animations.play('load',24,true);
            //this.load.setPreloadSprite(this.preloadBar);

            //  Load our actual games assets
            this.load.image('titlepage', 'assets/background.jpg');
            this.load.image('logo', 'assets/logo.png');
            this.load.image('wheel', 'assets/wheel.png');
            this.load.image('ton', 'assets/weight.png');
            this.load.image('click', 'assets/click.png');
            this.load.image('tile', 'assets/tile.jpg');
            this.load.image('pic', 'assets/image.png');
            this.game.load.spritesheet('painter', 'assets/painter.png', 50, 77, 9);
            this.game.load.spritesheet('button', 'assets/button.png', 62, 44, 2);
        }

        create() {

            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);

        }

        startMainMenu() {

            this.game.state.start('MainMenu', true, false);

        }

    }

}