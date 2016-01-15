module fbd {
    export class ButtonLabel extends Phaser.Button {

        label: Phaser.Text;

        constructor(game: Phaser.Game, x: number, y: number, key: string, label: string, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {
            super(game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
            game.add.existing(this);
            this.label = game.make.text(0, 0, label, global_style);
            this.label.anchor.setTo(0.5, 0.5);
            this.label.position.setTo(this.width / 2, this.height / 2);
            this.label.y = Math.round(this.label.y);
            this.label.x = Math.round(this.label.x);

            this.addChild(this.label);
           
        }
    }
}