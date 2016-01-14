module fbd {

    export class Game extends Phaser.Game {

        constructor() {

            super(623, 300, Phaser.CANVAS, 'cannyvas', null, true, false);
            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('Question', Question, false);

            this.state.start('Boot');

        }

    }

} 
