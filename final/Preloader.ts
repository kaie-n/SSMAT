module SSMAT{

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;
        preloadBarFill: Phaser.Sprite;
        logo: Phaser.Sprite;
        click: Phaser.Sprite;
        tiler: Phaser.TileSprite;
        levels: Array<Phaser.Sprite>;
        tileHeight: number;
        preload() {

            //  Set-up our preloader sprite
            this.tileHeight = 30;
            this.preloadBar = this.add.sprite(this.game.width / 2, this.game.height / 2, 'loadEmpty');
            this.preloadBarFill = this.add.sprite(this.game.width / 2, this.game.height / 2, 'loadFill');
            this.preloadBar.x -= this.preloadBar.width / 2;
            this.preloadBar.y -= this.preloadBar.height / 2;
            this.preloadBarFill.x = this.preloadBar.x;
            this.preloadBarFill.y = this.preloadBar.y;
            this.load.setPreloadSprite(this.preloadBarFill);

            for (var i = 1; i < 6; i++) {
                var pic = 'pic' + i; 
                var images = 'assets/pictures/' + i + '.jpg';
                this.load.image(pic, images);
            }
            //  Load our actual games assets
            this.load.image('logo', 'assets/logo.gif');
            this.load.image('wheel', 'assets/wheel.gif');
            this.load.image('ton', 'assets/weight.gif');
            this.load.image('click', 'assets/click.gif');
            this.load.image('tile', 'assets/stone-tile.gif');
            this.load.image('black', 'assets/background-menu.gif');
            this.load.image('gradient', 'assets/gradient.gif');
            this.load.image('arrow-red', 'assets/arrow-red.gif');
            this.load.image('arrow-green', 'assets/arrow-green.gif');
            this.load.image('arrow-blue', 'assets/arrow-blue.gif');
            this.load.image('level0', 'assets/level0.gif');
            this.load.image('level1', 'assets/level1.gif');
            this.load.image('exit', 'assets/exit.gif');
            this.load.spritesheet('preloadBar', 'assets/loader.gif', 64, 64);
            this.game.load.spritesheet('painter', 'assets/painter.gif', 50, 48, 4);
            this.game.load.spritesheet('help', 'assets/help.gif', 24, 19, 2);
            this.game.load.spritesheet('button', 'assets/button.gif', 24, 19, 2);
            this.game.load.spritesheet('reset', 'assets/reset.gif', 24, 19, 2);
            this.game.load.spritesheet('vector', 'assets/vector.gif', 24, 19, 2);
            this.game.load.spritesheet('flag', 'assets/flag.gif', 40, 180, 8);
            this.game.load.spritesheet('ok-btn', 'assets/ok-btn.gif', 71, 30, 2);
            this.game.load.spritesheet('cancel-btn', 'assets/cancel-btn.gif', 71, 30, 2);
        }

        create() {
            this.levels = [];
            this.tiler = this.game.add.tileSprite(0, this.world.height - this.tileHeight, this.game.width, this.game.height, 'tile');
            
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 50, Phaser.Easing.Linear.None, true);
            var tween2 = this.add.tween(this.preloadBarFill).to({ alpha: 0 }, 50, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
            var t: Phaser.Loader = new Phaser.Loader(this.game);
            if (t.hasLoaded) {
                this.preloadBar.alpha = 0;
                this.preloadBarFill.alpha = 0;
            }
        }

        startMainMenu() {

            this.logo = this.add.sprite(Math.round(this.world.centerX), this.world.centerY - 1.5, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);
            this.logo.alpha = 0;
            this.click = this.add.sprite(this.world.centerX, this.world.centerY + this.logo.height, 'click');
            this.click.anchor.setTo(0.5, 0.5);
            this.click.alpha = 0;
            this.logo["start"] = this.add.tween(this.logo).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0);
            this.click["start"] = this.add.tween(this.click).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true, 2000, -1, true);
            

            this.input.onDown.addOnce(function () {
                //this.chooseLevel()
                this.game.state.start('MainMenu', true, false)
            }, this);
        }

        chooseLevel() {
            this.click.destroy();
            this.logo.destroy();

            this.levels[0] = this.add.sprite(this.world.centerX, this.world.centerY, 'level0');
            this.levels[0].anchor.setTo(0.5, 0.5);
            this.levels[0].position.setTo(this.world.centerX, this.world.centerY - this.levels[0].height);
            this.levels[0].inputEnabled = true;
            this.levels[0].input.useHandCursor = true;
            this.levels[0].events.onInputOver.add(function () {
            
                this.add.tween(this.levels[0]).to({ alpha: 0.5 }, 250, Phaser.Easing.Linear.None, true, -1, true);
            
            }, this);
            this.levels[0].events.onInputOut.add(function () {
               
                this.add.tween(this.levels[0]).to({ alpha: 1 }, 250, Phaser.Easing.Linear.None, true);
              
            }, this);
            this.levels[0].events.onInputUp.addOnce(function () {
                level_choice = "LeaderBoard";
                this.game.state.start('MainMenu', true, false)
            }, this);
            this.levels[1] = this.add.sprite(this.world.centerX, this.world.centerY, 'level1');
            this.levels[1].visible = false;
            this.levels[1].anchor.setTo(0.5, 0.5);
            this.levels[1].position.setTo(this.world.centerX, this.world.centerY + this.levels[0].height);
            this.levels[1].inputEnabled = true;
            this.levels[1].input.useHandCursor = true;
            this.levels[1].events.onInputUp.addOnce(function () {
                level_choice = "LeaderBoard2";
                //  uncomment this if advanced level is accepted
                //this.game.state.start('AdvancedMenu', true, false)
            }, this);
            this.levels[1].events.onInputOver.add(function () {
              
               this.add.tween(this.levels[1]).to({ alpha: 0.5 }, 250, Phaser.Easing.Linear.None, true, -1, true);
               
            }, this);
            this.levels[1].events.onInputOut.add(function () {
                
                this.add.tween(this.levels[1]).to({ alpha: 1 }, 250, Phaser.Easing.Linear.None, true);
               
            }, this);
        }

    }

}