module fbd {

    export class SquareBox extends Phaser.Sprite {
        vector: fbd.Vector;
        result: Phaser.Text;

        //  booleans
        answer: boolean;

        //  arrays
        textString: Array<any>;
        multiple: Array<string>;

        constructor(game: Phaser.Game, x, y, type: number) {

            // square box initialize
            var width = 200 // example;
            var height = 150 // example;
            var bmd = game.add.bitmapData(width, height);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, width, height);
            bmd.ctx.fillStyle = '#ffffff';
            bmd.ctx.fill();
            bmd.ctx.strokeStyle = '#000000';
            bmd.ctx.stroke();

            game.make.sprite(x, y, bmd);
            super(game, x, y, bmd);
            this.anchor.setTo(1, 1)
            this.result = game.make.text(0, 0, '', { fill: '#00FF00', font: '48px FontAwesome' });

            this.addChild(this.result);
            this.result.anchor.setTo(0.5, 0.5);
            this.result.position.setTo(-this.width / 2, -this.height / 2);
            this.result.y = Math.round(this.result.y);
            this.result.x = Math.round(this.result.x);

            //  textString[0] is correct, textString[1] is wrong;
            this.textString = [
                { 'text': '\uf00c ', 'fill': '#00FF00' },
                { 'text': '\uf00d ', 'fill': '#FF0000' }
            ];
            this.result.text = this.textString[1].text;
            this.result.fill = this.textString[1].fill;
        }

        update() {

        }

    }
}