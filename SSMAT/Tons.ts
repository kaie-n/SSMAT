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
        angleinDeg: number;
        fx: number;
        fy: number;
        text: Phaser.Text;
        textAngle: Phaser.Text;
        started: boolean;
        main: SSMAT.MainMenu
        dlength: number;
        dlengtha: number;
        dlengthb: number;
        angleRad: number;
        arrow: Phaser.Sprite;
        components: Array<Phaser.Sprite>;
        dmass: number;
        percent: number;
        constructor(game: Phaser.Game, x: number, y: number, mass: number, gravity: number, name: string) {
            super(game, x, y, "ton");
            game.add.existing(this);

            this.anchor.setTo(0.5, 0);
            this.dy = y;
            this.mass = mass;
            this.dmass = mass;
            this.gravity = gravity;
            this.calcForce();
            this.angleinDeg = Math.round(Phaser.Math.radToDeg(this.angleA) * 100) / 100;
            this.angleinDeg = Math.round(Phaser.Math.radToDeg(this.angleA) * 100) / 100;
            this.ton = [];
            this.smoothed = false;
            if (name == "left" || name == "right") {
                this.text = game.add.text(0, 0, "", global_style);
                this.text.smoothed = false;
                this.text.anchor.set(0, 0.5);
                this.text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 1);
                this.text.align = "center";
                this.textAngle = game.add.text(0, 0, "", global_style);
                this.textAngle.setShadow(1, 1, 'rgba(0,0,0,1)', 1);
                this.textAngle.smoothed = false;
                this.textAngle.align = "center";
                this.text.x = Math.round(this.text.x);
                this.text.y = Math.round(this.text.y);
                this.textAngle.y = Math.round(this.textAngle.y);
                this.textAngle.x = Math.round(this.textAngle.x);

                this.text.smoothed = false;
                this.textAngle.smoothed = false;
            }
            ////this.textAngle.anchor.set(0, 0.5);
            //this.text.stroke = '#000000';
            //this.text.strokeThickness = 1;
            //this.textAngle.stroke = '#000000';
            //this.textAngle.strokeThickness = 1;
            if (name == "left") {
                //this.components = []

                //this.components[0] = game.add.sprite(0, 0, "arrow-green"); // x component
                //this.components[1] = game.add.sprite(0, 0, "arrow-green"); // y component
                //var cropRectangle = new Phaser.Rectangle(0, 0, this.components[1].width, this.components[1].height / 2);
                //this.components[1].crop(cropRectangle, true);
                //this.components[1].rotation = -1.5708
                //this.components[0].anchor.setTo(0, 0.5);
                //this.components[1].anchor.setTo(0, 0.5);
                this.arrow = game.add.sprite(0, 0, "arrow-green");
                this.text.anchor.set(1.6, 0.5);
            }
            if (name == "right") {
                //this.components = []
                //this.components[0] = game.add.sprite(0, 0, "arrow-blue"); // x component
                //this.components[1] = game.add.sprite(0, 0, "arrow-blue"); // y component
                //var cropRectangle = new Phaser.Rectangle(0, this.components[1].height / 2, this.components[1].width, this.components[1].height / 2);
                //this.components[1].crop(cropRectangle, true);
                ////this.components[0].alpha = 0.1;
                //this.components[1].rotation = -1.5708
                //this.components[0].anchor.setTo(0, 0.5);
                //this.components[1].anchor.setTo(0, 0.5);
                this.arrow = game.add.sprite(0, 0, "arrow-blue");
                this.text.anchor.set(-0.6, 0.5);
            }
            if (name != "add") {

                this.arrow.visible = true;
                this.arrow.anchor.setTo(0, 0.5);
            }
        }
        clearTon() {
            if (this.ton.length > 0) {
                for (var i = 0; i < this.ton.length; i++) {
                    this.ton[i].destroy();
                }
            }
            this.ton = [];
        }
        setRotate() {

            if (this.name == "left") {
                this.arrow.scale.x = -1;
                //this.components[0].scale.x = -1;
                this.arrow.rotation = this.angleA
            }
            if (this.name == "right") {
                this.arrow.rotation = -this.angleA
            }
        }

        convertAngle() {
            this.angleinDeg = Math.round(Phaser.Math.radToDeg(this.angleA) * 100) / 100;
            this.angleA = Phaser.Math.degToRad(this.angleinDeg);

            return this.angleA;
        }
        maintainComponents() {
            // x components
            this.components[0].position.copyFrom(this.main.painter.position);
            // y components
            this.components[1].position.copyFrom(this.main.painter.position);
            this.components[1].width = this.arrow.getBounds().height - 10;
            if (this.name == "left") {
                this.components[0].width = -this.arrow.getBounds().width + 20;
                this.components[1].x -= this.arrow.height / 4
            }
            if (this.name == "right") {
                this.components[0].width = this.arrow.getBounds().width - 20;
                this.components[1].x += this.arrow.height / 4
            }

            console.log(this.components[0].width, "THIS comp 0  WIDTH");
            console.log(this.arrow.getBounds(), "GETBOUNDS arrow");
        }
        update() {
            this.convertAngle();
            if (this.name == "left" || this.name == "right") {
                //this.maintainComponents()
                this.arrow.x = this.main.painter.x;
                this.arrow.y = this.main.painter.y;
                if (this.started) {
                    this.arrow.visible = true;
                    this.visible = true;

                    this.textAngle.visible = true;
                    this.text.visible = true;

                    this.started = false;
                }


                if (this.calcForce() >= 1000) {
                    this.force = this.calcForce() / 1000;
                    this.text.text = "M: " + this.mass + "KG\nF: " + Math.round(this.force * 1000) / 1000 + "kN";
                }
                if (this.calcForce() < 1000) {
                    this.text.text = "M: " + this.mass + "KG\nF: " + Math.round(this.force * 100) / 100 + "N"
                }
                if (this.name == "left") {
                    this.textAngle.text = "α: " + String(this.angleinDeg) + "\xB0";
                    this.textAngle.x = this.main.painter.x - this.main.painter.width / 2 - this.textAngle.width;
                    this.text.x = (this.x - this.width / 2);
                    
                }
                if (this.name == "right") {
                    this.textAngle.text = "β: " + String(this.angleinDeg) + "\xB0";
                    this.textAngle.x = this.main.painter.x + this.main.painter.width / 2;
                    this.text.x = (this.x + this.width / 2);
                }
                this.textAngle.y = this.main.painter.y - this.textAngle.height;
                this.text.y = (this.y + this.height / 2);
                //round off;
                this.text.x = Math.round(this.text.x);
                this.text.y = Math.round(this.text.y);
                this.textAngle.y = Math.round(this.textAngle.y);
                this.textAngle.x = Math.round(this.textAngle.x);

            }
        }
        calcPow() {
            var a = Math.pow(this.calcForce(), 2);
            return a;
        }
        calcForce() {
            this.mass = Math.round(this.mass * 10) / 10
            this.force = Math.round((this.mass * this.gravity) * 10) / 10;

            return this.force;
        }
        calcFx() {
            this.fx = this.calcForce() * Math.cos(this.angleA);
            this.fx = Math.round(this.fx);
            return this.fx;
        }
        calcFy() {
            this.fy = this.calcForce() * Math.sin(this.angleA);
            this.fy = Math.round(this.fy);
            return this.fy;
        }

    }
}