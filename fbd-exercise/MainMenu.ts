module fbd {

    export class MainMenu extends Phaser.State {


        create() {
            this.game.state.start('Question1', true, false)
            
        }

    }

}