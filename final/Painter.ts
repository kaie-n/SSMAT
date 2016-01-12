module SSMAT {
    export class Painter extends Phaser.Sprite  {
        mass: number;
        tween: Phaser.Tween;
        force: number;
        gravity: number;
        text: Phaser.Text;
        started: boolean;
        arrow: Phaser.Sprite;
        constructor(game: Phaser.Game, x: number, y: number, mass: number, gravity: number) {
            super(game, x, y,"painter");
            game.add.existing(this);
            this.mass = mass;
            this.gravity = gravity;
            this.force = Math.round((this.mass * this.gravity) * 10) / 10 ;
            //var pForce = this.force / 1000;
            this.text = game.add.text(0, 0, "", global_style);
            this.text.anchor.set(0, 0.5);
            this.smoothed = false;
            this.animations.add("paint");
            this.text.setShadow(1, 1, 'rgba(0,0,0,1)', 1);
            this.text.stroke = '#000000';
            this.text.strokeThickness = 0;
            this.text.align = "left";
        }
        update() {
                //var pForce = this.force / 1000;
                this.text.text = "M: " + this.mass + "KG\n  F: " + Math.round(this.force * 10) / 10 + "N";
                this.text.x = (this.x + this.width / 2);
                this.text.y = (this.y + this.text.height / 2);
                this.text.x = Math.round(this.text.x);
                this.text.y = Math.round(this.text.y);
        }
    }
}