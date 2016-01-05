module SSMAT {

    export class Boot extends Phaser.State {

        preload() {

            this.load.spritesheet('preloadBar', 'assets/loader.png', 64, 64);

        }

        create() {
            Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);  //for Canvas, modern approach
            Phaser.Canvas.setSmoothingEnabled(this.game.context, false);  //also for Canvas, legacy approach
            //PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST; //for WebGL
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;
            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;
            this.game.state.start('Preloader', true, false);

        }

    }

}