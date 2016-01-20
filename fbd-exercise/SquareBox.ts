module fbd {

    export class SquareBox extends Phaser.Sprite {
        vector: fbd.Vector;
        result: Phaser.Text;
        //  booleans
        answer: boolean;
        //  arrays
        textString: Array<any>;
        multiple: Array<string>;
        //  sprite
        circle: Phaser.Sprite;
        resolve: Phaser.Sprite;
        constructor(game: Phaser.Game, x, y, type: number) {

            // square box initialize
            var width = 200 // example;
            var height = 150 // example;
            var bmd = game.make.bitmapData(width, height);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, width, height);
            bmd.ctx.fillStyle = '#ffffff';
            bmd.ctx.fill();
            bmd.ctx.strokeStyle = '#000000';
            bmd.ctx.stroke();

            super(game, x, y, bmd);
            //game.add.sprite(x, y, bmd);
            this.anchor.setTo(1, 1)

            // resolve text initialize
            this.resolve = game.make.sprite(-this.width, -this.height, "resolve");
            this.addChild(this.resolve);
            // circle initialize
            var circle = game.add.bitmapData(10, 10);
            circle.circle(5, 5, 5, '#000000');
            this.circle = game.make.sprite(-this.width / 2, (-this.height / 2) + 5, circle);
            this.circle.anchor.setTo(0.5, 0.5);
            this.circle.alpha = 0;
            this.addChild(this.circle);

            // result text initialize
            this.result = game.make.text(0, 0, "✖", { fill: '#00FF00', font: '48px Arial' });
            this.addChild(this.result);
            this.result.anchor.setTo(0.5, 0.5);
            this.result.position.setTo(-this.width / 2, -this.height / 2);
            this.result.y = Math.round(this.result.y);
            this.result.x = Math.round(this.result.x);
            
            //  textString[0] is correct, textString[1] is wrong;
            this.textString = [
                { 'text': "✔", 'fill': '#00FF00' },
                { 'text': "✖", 'fill': '#FF0000' }
            ];
            this.result.visible = false;
        }
        update() {
        }
        showAnswer(i, bool) {
            if (bool) {
                divDetails.innerHTML = part.correct
            }
            switch (_p) {
                case 0:
                    this.result.scale.setTo(1, 1);
                    this.result.position.setTo(-this.width / 2, -this.height / 2);
                    this.result.y = Math.round(this.result.y);
                    this.result.x = Math.round(this.result.x);
                    break;
                case 1:
                    this.result.scale.setTo(0.8, 0.8);
                    this.result.position.setTo(-this.result.width / 2, -this.height + this.result.height / 2);
                    this.result.y = Math.round(this.result.y);
                    this.result.x = Math.round(this.result.x);
                    break;
                case 2:
                    this.result.scale.setTo(0.8, 0.8);
                    this.result.position.setTo(-this.width / 2, -this.height / 2);
                    this.result.y = Math.round(this.result.y);
                    this.result.x = Math.round(this.result.x);
                    break;
            }
            this.result.visible = true;
            this.result.text = this.textString[i].text;
            this.result.fill = this.textString[i].fill;
        }
        hideAnswer() {
            this.result.visible = false;
        }


    }
}