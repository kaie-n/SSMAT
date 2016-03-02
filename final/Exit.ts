module SSMAT {
    export class Exit extends Phaser.Sprite {

        ok: Phaser.Button;
        cancel: Phaser.Button;
        constructor(game, x, y) {
            super(game, x, y, "exit")
            this.position.setTo(this.x - (this.width / 2), this.y - (this.height / 2))
            this.position.setTo(Math.ceil(this.x), Math.ceil(this.y))
            game.add.existing(this);
            this.ok = this.game.add.button(0, 0, "ok-btn", this.exit, this, 1, 0, 1, 0);
            this.cancel = this.game.add.button(0, 0, "cancel-btn", this.cancelled, this, 1, 0, 1, 0);
            var totalWidth = this.ok.width + this.cancel.width + 10;
            this.ok.position.setTo(this.x + 5, this.y + this.height - this.ok.height - 5);
            this.cancel.position.setTo((this.x + this.width) - this.cancel.width - 5, this.y + this.height - this.cancel.height - 5);

           
        }
        toggleVisibility() {
            this.cancel.visible = this.visible;
            this.ok.visible = this.visible;
        }
        resize() {
            this.position.setTo(this.game.world.centerX, this.game.world.centerY);
            this.position.setTo(this.x - (this.width / 2), this.y - (this.height / 2))
            this.position.setTo(Math.ceil(this.x), Math.ceil(this.y))
            this.ok.position.setTo(this.x + 5, this.y + this.height - this.ok.height - 5);
            this.cancel.position.setTo((this.x + this.width) - this.cancel.width - 5, this.y + this.height - this.cancel.height - 5);
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