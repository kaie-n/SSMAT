module fbd {

    export class MainMenu extends Phaser.State {


        create() {
            this.game.state.start('Question', true, false)

            _q = 0;
            _p = 0;
            
        }

    }

}