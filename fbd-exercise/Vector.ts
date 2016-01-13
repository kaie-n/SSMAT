module fbd {

    export class Vector extends Phaser.Sprite {
        bmd: Phaser.BitmapData;

        constructor(game: Phaser.Game, x, y) {

            this.bmd = game.add.bitmapData(game.width, game.height);
            super(game, x, y, this.bmd);
            game.add.existing(this);
            this.bmd.ctx.strokeStyle = "black";
        }
    }
}