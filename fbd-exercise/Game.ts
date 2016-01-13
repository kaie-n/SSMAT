module fbd {

    export class Game extends Phaser.Game {

        constructor() {

            super(450, 140, Phaser.AUTO, 'cannyvas', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('Question1', Question1, false);

            this.state.start('Boot');

        }

    }

} 
