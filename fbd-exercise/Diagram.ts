module fbd {

    export class Diagram extends Phaser.Sprite {
        picture: Phaser.Sprite;
        clickRegion: Phaser.Rectangle;
        squareBox: Phaser.Sprite;
        vector: Array<fbd.Vector>
        limit: number;
        circle: Phaser.Sprite;
        constructor(game: Phaser.Game, x, y, key) {
            super(game, x, y, key);
            game.add.existing(this);
            // diagram
            this.picture = this.game.add.sprite(0, 0, key);

            // square box initialize
            var width = 150 // example;
            var height = 100 // example;
            var bmd = this.game.add.bitmapData(width, height);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, width, height);
            bmd.ctx.fillStyle = '#ffffff';
            bmd.ctx.fill();
            bmd.ctx.strokeStyle = '#000000';
            bmd.ctx.stroke();
            this.squareBox = this.game.add.sprite(this.game.world.width, this.picture.height, bmd);
            this.squareBox.anchor.setTo(1, 1)

            this.vector = [];

            var circle = game.add.bitmapData(10, 10);
            circle.circle(5, 5, 5, '#000000');
            this.circle = game.add.sprite(185, 66, circle);
            this.circle.anchor.setTo(0.5, 0.5);
            this.circle.inputEnabled = true;
            this.circle.events.onInputDown.add(this.addVector, this);
            this.limit = 3;
            //this.game.input.onDown.add(this.addVector, this);
            
        }
        addVector() {
            if (this.vector.length < this.limit) {
                if (this.vector.length == 0) {
                    this.vector[0] = new fbd.Vector(this.game, this.game.input.x, this.game.input.y, 185, 66);
                    console.log(this.vector.length)
                }
                else {
                    var i = this.vector.length
                    this.vector[i] = new fbd.Vector(this.game, this.game.input.x, this.game.input.y, 185, 66);
                    console.log(this.vector.length)

                }
            }
        }
    }

}
