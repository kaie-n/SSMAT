module SSMAT {
    export class Arrow extends Phaser.Sprite {
        main:any;
        components: Array<Phaser.Sprite>;
        group: Phaser.Group;
        constructor(game: Phaser.Game, x: number, y: number, key: string, scale: number = 1, components: boolean = true) {
            super(game, x, y, key);
            this.anchor.setTo(0, 0.5);
            game.add.existing(this);
            this.scale.x = scale;
            this.components = [];
            if (components) {
                this.components[0] = game.add.sprite(0, 0, key);
                this.components[0].rotation = -1.5708
                this.components[0].anchor.copyFrom(this.anchor);
                this.components[1] = game.add.sprite(0, 0, key);
                this.components[1].scale.x = scale;
                this.components[1].anchor.copyFrom(this.anchor);
                
            }
        }

        update() {
            if (this.components.length > 0) {
                this.components[0].position.copyFrom(this.position);
                this.components[1].position.copyFrom(this.position);
            }
        }
    }
}