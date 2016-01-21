module SSMAT {
    export class Grid extends Phaser.Sprite {

        text: Phaser.Text;
        main: any;
        angleA: number;
        angleB: number;
        answerA: number;
        answerB: number;
        angleinRad: Array<number>;
        hitted: boolean;
        constructor(game: Phaser.Game, x: number, y: number) {
            // create a new bitmap data object
            // var bmd = this.game.add.bitmapData(150, 126.5);
            var bmd = new Phaser.Graphics(game, 0, 0);
            bmd.beginFill(0x333333);
            bmd.lineStyle(1, 0x222222, 1);
            bmd.drawRect(0, 0, 150, 127);
            bmd.endFill();
            bmd.boundsPadding = 0
            var texture = bmd.generateTexture();
            super(game, x, y, texture);
            game.add.existing(this);
            this.hitted = false;
            var style = { font: "14px Courier", fill: "#FFFFFF", wordWrap: false, wordWrapWidth: this.width, align: "center" };
            this.text = game.add.text(0, 0, "", style);
            this.text.anchor.set(0.5);
            this.text.visible = true;
            this.smoothed = false;
            this.text.x = Math.floor(this.x + this.width / 2);
            this.text.y = Math.floor(this.y + this.height / 2);
            this.text.alpha = 0;
            this.events.onInputOver.add(function () {
                if (this.alpha == 1) {
                    var tween = this.main.add.tween(this.text).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
                }
            }, this);
            this.events.onInputOut.add(function () {
                if (this.alpha == 1) {
                    var tween = this.main.add.tween(this.text).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                }
            }, this);
            this.angleinRad = [];
        }


        setAnswers(type) {
            this.angleinRad[0] = Phaser.Math.degToRad(this.angleA); // Angle alpha
            this.angleinRad[1] = Phaser.Math.degToRad(this.angleB); // Angle beta
            var force0 = 0;
            var force1 = 0;
            if (type == 1) {
                var temp2 = (Math.cos(this.angleinRad[0]) / Math.cos(this.angleinRad[1])) // Tons1 = Cos(Ton0.angle) / Cos(Ton1.Angle)
                var temp = (temp2 * (Math.sin(this.angleinRad[1])) + Math.sin(this.angleinRad[0]))
                force0 = Math.round((this.main.painter.force / temp) * 10) / 10
                force1 = Math.round((force0 * temp2) * 10) / 10
            }
            if (type == 2) {
                // equation (1) to find force of Beta
                var w = Math.round((this.main.wind / Math.cos(this.angleinRad[0])) * 1000) / 1000; // (1)
                var f2 = Math.round((Math.cos(this.angleinRad[1]) / Math.cos(this.angleinRad[0])) * 1000) / 1000  // (2)
                var f2force1 = this.main.painter.force - (w * Math.sin(this.angleinRad[1]))
                var f2force2 = (f2 * Math.sin(this.angleinRad[0])) + Math.sin(this.angleinRad[1]);
                force1 = (f2force1 / f2force2);

                //  console.log(w, "wind", f2, "F2", f2force1, "f2force1", f2force2, "f2force2", (f2force1 / f2force2), "f2force1 / f2force2");
                // equation (2) to find force of alpha
                force0 = Math.round(((f2 * force1) + w) * 10) / 10
            }
            this.answerA = Math.round((force0 / this.main.gravity) * 10) / 10
            this.answerB = Math.round((force1 / this.main.gravity) * 10) / 10
        }
        update() {
            if (this.main.started) {
                this.text.text = "α: " + String(this.angleA) + " β: " + String(this.angleB)
            }

            if (this.hitted == false && this.main.tons[0].angleinDeg == this.angleA && this.main.tons[1].angleinDeg == this.angleB && this.alpha == 1 && this.main.tons[0].mass == this.answerA && this.main.tons[1].mass == this.answerB) {
                this.hitted = true;
                this.main.add.tween(this.text).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                this.events.onInputOver.removeAll();
                this.events.onInputOut.removeAll();
                var tween = this.main.add.tween(this).to({ alpha: 0 }, 4000, Phaser.Easing.Linear.None, true, 2000);
                tween.onComplete.addOnce(function () {
                    this.main.noGridCompleted++;
                    this.main.painter.animations.stop(null, true);

                    this.main.checkFinished();
                }, this);
                tween.onStart.addOnce(function () {
                    this.main.painter.animations.play("paint", 4, true);
                }, this);
            }

        }
    }
}