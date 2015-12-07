module SSMAT {
    export class Grid extends Phaser.Sprite {

        text: Phaser.Text;
        main: SSMAT.MainMenu;
        angleA: number;
        angleB: number;
        constructor(game: Phaser.Game, x: number, y: number) {
            // create a new bitmap data object
            // var bmd = this.game.add.bitmapData(150, 126.5);
            var bmd = new Phaser.Graphics(game, 0, 0);
            bmd.beginFill(0x904820);
            bmd.lineStyle(1, 0x682401, 1);
            bmd.drawRect(0, 0, 150, 127);
            bmd.endFill();
            bmd.boundsPadding = 0
            var texture = bmd.generateTexture();
            super(game, x, y, texture);
            game.add.existing(this);
          
            var style = { font: "14px Courier", fill: "#FFFFFF", wordWrap: false, wordWrapWidth: this.width, align: "center" };
            this.text = game.add.text(0, 0, "", style);
            this.text.anchor.set(0.5);
            this.text.visible = true;
            this.smoothed = false;
            this.text.x = Math.floor(this.x + this.width / 2);
            this.text.y = Math.floor(this.y + this.height / 2);
            this.text.alpha = 0;
            this.events.onInputOver.add(function () {
                var tween = this.main.add.tween(this.text).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            }, this);
            this.events.onInputOut.add(function () {
                var tween = this.main.add.tween(this.text).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            }, this);
        }
        update() {
            if (this.main.started) {
                this.text.text = "α: " + String(this.angleA) + " β: " + String(this.angleB)
            } 

            if (this.main.tons[0].angleinDeg == this.angleA && this.main.tons[1].angleinDeg == this.angleB && this.alpha == 1) {
                var tween = this.main.add.tween(this).to({ alpha: 0 }, 4000, Phaser.Easing.Linear.None, true, 2000);
                tween.onComplete.add(function () {
                    this.main.painter.animations.stop(null, true);
                }, this);
                tween.onStart.addOnce(function () {
                    this.main.painter.animations.play("paint", 8, true);
                }, this);
            }
        }
    }
}