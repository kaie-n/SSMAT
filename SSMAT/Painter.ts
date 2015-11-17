module SSMAT {
    export class Painter extends Phaser.Sprite  {
        mass: number;
        tween: Phaser.Tween;
        force: number;
        gravity: number;
        text: Phaser.Text;
        started: boolean;
        constructor(game: Phaser.Game, x: number, y: number, mass: number, gravity: number) {
            super(game, x, y,"painter");
            game.add.existing(this);
            this.mass = mass;
            this.gravity = gravity;
            this.force = this.mass * this.gravity;
            var style = { font: "14px Courier", fill: "#FFFFFF", wordWrap: false, wordWrapWidth: this.width, align: "left" };
            var pForce = this.force / 1000;
            this.text = game.add.text(0, 0, "M: " + this.mass + "kg\nF: " + Math.round(pForce * 100) / 100 + "kN", style);
            this.text.anchor.set(0, 0.5);
            this.text.visible = false;
        }
        update() {
            if (this.started) {
                var pForce = this.force / 1000;
                this.text.visible = true;
                this.text.text = "M: " + this.mass + "kg \nF: " + Math.round(pForce * 100) / 100 + "kN";
                this.text.x = (this.x + this.width / 2);
                this.text.y = (this.y + this.height / 2);
               
            }
        }
    }
}