module fbd {

    export class Diagram extends Phaser.Sprite {
        picture: Phaser.Sprite;
        clickRegion: Phaser.Rectangle;
        squareBox: fbd.SquareBox;
        vector: Array<fbd.Vector>;
        circle: Phaser.Sprite;
        game: Phaser.Game
        limit: number;
        constructor(game: Phaser.Game, x, y, key) {
            super(game, x, y, key);
            this.game = game;
            this.game.add.existing(this);
            // diagram
            this.picture = this.game.make.sprite(0, 0, key);
            this.addChild(this.picture);
            this.squareBox = new SquareBox(game, this.game.world.width, this.picture.height, 1);

            this.vector = [];

            var circle = game.add.bitmapData(10, 10);
            circle.circle(5, 5, 5, '#000000');
            this.circle = game.make.sprite(185, 66, circle);
            this.circle.anchor.setTo(0.5, 0.5);
            this.circle.inputEnabled = true;
            this.circle.events.onInputDown.add(this.addVector, this);
            this.addChild(this.circle);
            this.addChild(this.squareBox);
            this.limit = 4;
            //this.game.input.onDown.add(this.addVector, this);
            
        }
        destroyAll() {
            this.destroy();
            for (var i = 0; i < this.vector.length; i++) {
                this.vector[i].group.destroy();
                this.vector[i].destroy();
            }
        }
        
        addVector() {
            if (this.vector.length < this.limit) {
                var i = this.vector.length
                if (i == 0) {
                    this.vector[i] = new fbd.Vector(this.game, this.game.input.x, this.game.input.y, 185, 66);
                    console.log(this.vector.length)

                }
                else {
                    this.vector[i] = new fbd.Vector(this.game, this.game.input.x, this.game.input.y, 185, 66);
                    console.log(this.vector.length)
                }
                
            }
        }
    }

}
