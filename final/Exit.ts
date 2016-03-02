module SSMAT {
    export class Exit extends Phaser.Sprite {

        ok: Phaser.Button;
        cancel: Phaser.Button;
        constructor(game, x, y) {
            super(game, x, y, "exit")
            this.anchor.setTo(0.5, 0.5);
            game.add.existing(this);
            this.ok = this.game.add.button(0, 0, "ok-btn", this.exit, this, 1, 0, 1, 0);
            this.ok.anchor.setTo(0.5, 0.5);
            this.cancel = this.game.add.button(0, 0, "cancel-btn", this.cancelled, this, 1, 0, 1, 0);
            this.cancel.anchor.setTo(0.5, 0.5);

            this.ok.position.setTo(this.x  - (this.ok.width / 2) - 10, this.y + this.height);
            this.cancel.position.setTo(this.ok.x + this.ok.width + 10, this.y + this.height );

           
        }
        toggleVisibility() {
            this.cancel.visible = this.visible;
            this.ok.visible = this.visible;
        }
        exit() {
            this.game.state.start('Preloader', true, false);
        }
        cancelled() {
            this.visible = false;
            this.toggleVisibility();
        }
    }
}