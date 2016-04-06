module fbd {

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;
        preloadBarFill: Phaser.Sprite;
        preload() {

            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(this.game.width / 2, this.game.height / 2, 'loadEmpty');
            this.preloadBarFill = this.add.sprite(this.game.width / 2, this.game.height / 2, 'loadFill');
            this.preloadBar.x -= this.preloadBar.width / 2;
            this.preloadBar.y -= this.preloadBar.height / 2;
            this.preloadBarFill.x = this.preloadBar.x;
            this.preloadBarFill.y = this.preloadBar.y;
            this.load.setPreloadSprite(this.preloadBarFill);
            
            //  Load our actual games assets
            //  Question diagrams
            for (var i = 1; i < 5; i++) {
                var pic = 'pic' + i;
                var images = 'assets/questions/' + i + '.png';
                this.load.image(pic, images);
            }
            //  Buttons
            this.game.load.spritesheet('btn', 'assets/btn.gif', 120, 33, 2);
            this.game.load.image('resolve', 'assets/resolve.gif');
            this.game.load.image('arrow-head', 'assets/arrow-head.gif');
            this.game.load.json('sheet', 'sheet.json');
        }

        create() {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 50, Phaser.Easing.Linear.None, true);
            var tween2 = this.add.tween(this.preloadBarFill).to({ alpha: 0 }, 50, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
            var load: Phaser.Loader = new Phaser.Loader(this.game);
            if (load.hasLoaded) {
                this.preloadBar.alpha = 0;
                this.preloadBarFill.alpha = 0;
            }
        }

        startMainMenu() {
            this.game.state.start('MainMenu', true, false)
        }

    }
}