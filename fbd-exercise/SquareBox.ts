module fbd {

    export class SquareBox extends Phaser.Sprite {
        answer: boolean;
        vector: fbd.Vector;
        multiple: Array<string>;

        constructor(game: Phaser.Game, x, y, type:number) {

            // square box initialize
            var width = 200 // example;
            var height = 150 // example;
            var bmd = game.add.bitmapData(width, height);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, width, height);
            bmd.ctx.fillStyle = '#ffffff';
            bmd.ctx.fill();
            bmd.ctx.strokeStyle = '#000000';
            bmd.ctx.stroke();

            super(game, x, y, bmd);
            game.make.sprite(x, y, bmd);
            //game.add.existing(this);
            this.anchor.setTo(1, 1)
        }

        update() {
           
        }
     
    }
}