module SSMAT {
    export class Arrow extends Phaser.Sprite {
        main: SSMAT.MainMenu;
        constructor(game: Phaser.Game, x: number, y: number, key: string) {
            super(game, x, y, key);
            this.anchor.setTo(0, 0.5);
            game.add.existing(this);
        }

    }
}