module SSMAT {

    export class Game extends Phaser.Game {

        constructor() {

            super(800, 600, Phaser.CANVAS, 'content', null, false, false);
            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            //this.state.add('Level', Level, false);
            
            this.state.start('Boot');

        }

    }

} 