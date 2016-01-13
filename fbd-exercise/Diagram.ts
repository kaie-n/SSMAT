module fbd {

    export class Diagram extends Phaser.Sprite {
        picture: Phaser.Sprite;
        clickRegion: Phaser.Rectangle;
        squareBox: Phaser.Sprite;
        vector: Array<fbd.Vector>
        constructor(game: Phaser.Game, x, y, key) {
            super(game, x, y, key);
            game.add.existing(this);
            this.picture = this.game.add.sprite(0, 0, key);
            
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
            this.clickRegion = new Phaser.Rectangle(184, 66, 200, 200);
            this.clickRegion.x -= this.clickRegion.halfWidth;
            this.clickRegion.y -= this.clickRegion.halfHeight;
            this.game.input.onDown.add(this.drag, this);

            this.vector = [];

            this.vector[0] = new fbd.Vector(this.game, 0,0);

            
        }
        update() {
            if (this.game.input.mousePointer.isDown) {
                this.drag(this.game.input);
                 
            }
        }
        drag(pointer) {
            var inside = this.clickRegion.contains(pointer.x, pointer.y)    //do whatever with the result  
            if (inside) {
                this.vector[0].bmd.clear();
                this.vector[0].bmd.ctx.beginPath();
                this.vector[0].bmd.ctx.beginPath();
                this.vector[0].bmd.ctx.moveTo(184, 66);
                this.vector[0].bmd.ctx.lineTo(this.rounder(pointer.x), this.rounder(pointer.y));
                this.vector[0].bmd.ctx.lineWidth = 2;
                this.vector[0].bmd.ctx.stroke();
                this.vector[0].bmd.ctx.closePath();

                this.vector[0].bmd.render();
            }
            console.log(this.rounder(pointer.x), this.rounder(pointer.y));
        }

        rounder(x) {
            return Math.ceil(x / 5) * 5;
        }
    }

}
