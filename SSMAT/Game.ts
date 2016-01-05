module SSMAT {

    export class Game extends Phaser.Game {

        constructor() {
            //console.log(window.innerHeight, document.body.offsetHeight, "Window Height");
            super(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'content', null, true, false);
            
            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('GameOver', GameOver, false);
            
            this.state.start('Boot');

        }

    }

} 