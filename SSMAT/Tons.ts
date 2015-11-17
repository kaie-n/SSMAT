module SSMAT {
    export class Tons extends Phaser.Sprite {
        mass: number;
        tween: Phaser.Tween;
        force: number;
        gravity: number;
        dy: number;
        ton: Array<SSMAT.Tons>;
        _dx: Phaser.Point;
        angleA: number;
        fx: number;
        fy: number;
        text: Phaser.Text;
        started: boolean;
        constructor(game: Phaser.Game, x: number, y: number, mass: number, gravity: number) {
            super(game, x, y, "ton");
            game.add.existing(this);
            this.anchor.setTo(0.5, 0);
            this.dy = 51;
            this.mass = mass;
            this.gravity = gravity;
            this.calcForce();
            this.ton = [];
            
                var style = { font: "14px Courier", fill: "#FFFFFF", wordWrap: false, wordWrapWidth: this.width, align: "left" };
                this.text = game.add.text(0, 0, "", style);
                this.text.anchor.set(0, 0.5);
                this.text.visible = false;
           
        }
        update() {
            if (this.name == "left" || this.name == "right") {
                if (this.started) {
                    this.text.visible = true;
                }
                if (this.calcForce() >= 1000) {
                    this.force = this.calcForce() / 1000;

                    this.text.text = "M: " + this.mass + "kg \nF: " + Math.round(this.force * 100) / 100 + "kN";

                }
                if (this.calcForce() < 1000) {
                    this.text.text = "M: " + this.mass + "kg \nF: " + Math.round(this.force * 100) / 100 + "N"
                }
                if (this.name == "left") {

                    this.text.x = (this.x - this.text.width - 14);
                }
                if (this.name == "right") {
                    this.text.x = (this.x + this.width / 2);
                }
                this.text.y = (this.y + this.height / 2);
            }
        }
        calcForce() {
            this.force = this.mass * this.gravity;
            return this.force;
        }
        calcFx() {
            this.fx = this.calcForce() * Math.cos(this.angleA * (180 / Math.PI));
            return this.fx;
        }
        calcFy() {
            this.fy = this.calcForce() * Math.sin(this.angleA * (180 / Math.PI));
            return this.fy;
        }

    }
}