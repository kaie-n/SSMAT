module SSMAT {
    export class Instruction extends Phaser.Sprite {

        arrow: Array<Phaser.Button>;
        xbutton: Phaser.Button;
        constructor(game: Phaser.Game, x: number, y: number) { 
            super(game, x, y, "instruction", 0)
            game.add.existing(this);
            this.position.setTo(this.x - (this.width / 2), this.y - (this.height / 2));
            this.arrow = [];
            this.arrow[0] = game.add.button(0, 0, "arrow", this.previous, this, 1,1,1,1);
            this.arrow[1] = game.add.button(0, 0, "arrow", this.next, this, 2, 2, 2, 2);
            this.arrow[0].position.setTo(this.x, (this.y + this.height) - this.arrow[0].height);
            this.arrow[1].position.setTo((this.x + this.width) - this.arrow[1].width, (this.y + this.height) - this.arrow[1].height); 
            this.animations.add("next");
            this.xbutton = game.add.button(0, 0, "close", this.close, this, 0, 0, 0, 0);
            this.xbutton.position.setTo((this.x + this.width) - this.xbutton.width - 5,this.y + 5);
        }
        close() {
            this.visible = false;
            this.arrow[0].visible = false;
            this.arrow[1].visible = false;
            this.xbutton.visible = false
        }
        open() {
            this.bringToTop();
            this.arrow[0].bringToTop();
            this.arrow[1].bringToTop();
            this.xbutton.bringToTop();
            this.visible = true;
            this.arrow[0].visible = true;
            this.arrow[1].visible = true;
            this.xbutton.visible = true;
        }
        previous() {

                this.animations.getAnimation("next").previous();
        
        }
        next() {
            //console.log(this.animations.getAnimation("next").currentFrame, this.animations.getAnimation("next").frameTotal ," FRAMES")
                this.animations.getAnimation("next").next();
        }
    }
}