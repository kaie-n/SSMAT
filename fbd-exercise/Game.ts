﻿module fbd {

    export class Game extends Phaser.Game {

        constructor() {

            super(623, 260, Phaser.CANVAS, 'cannyvas', null, true, true);
            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('Question', Question, false);
            this.state.add('Finish', Finish, false);
            this.state.start('Boot');

        }

    }

} 
