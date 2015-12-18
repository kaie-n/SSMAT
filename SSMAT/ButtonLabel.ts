﻿module SSMAT {
    export class ButtonLabel extends Phaser.Button {

        label: Phaser.Text;
        main: SSMAT.MainMenu;
        constructor(game: Phaser.Game, x: number, y: number, key: string, label: string, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {
            super(game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
            game.add.existing(this);
            var style = { font: "14px Courier bold", fill: "#FFFFFF", wordWrap: false, wordWrapWidth: this.width, align: "left" };
            this.label = game.add.text(0, 0, label, style);
            this.label.y = this.game.world.height - 30 - this.height;
            this.label.x = this.x;
            this.label.anchor.set(0.5, 0.5);
            this.label.y = this.label.y - this.label.height /2 ;
            this.label.visible = false;
            this.label.setShadow(1, 1, 'rgba(0,0,0,1)', 1);
            this.events.onInputOver.add(function () { this.label.visible = true }, this);
            this.events.onInputOut.add(function () { this.label.visible = false }, this);
            this.events.onInputDown.add(function () { this.label.visible = false }, this);
        }
    }
}