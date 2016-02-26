module fbd {

    export class LabelSub extends Phaser.Text{
        sub: Phaser.Text;
        unknown: Phaser.Text
        totalWidth: number;
        totalHeight: number;
        halfHeight: number;
        halfWidth: number;
        done: boolean;
        answer: string;
        constructor(t1, t2,game, answer) {
            super(game, 0, 0, t1, global_style);
            this.game.add.existing(this);
            this.sub = this.game.add.text(0, 0, t2, global_style);
            this.answer = answer;

            this.sub.y += this.sub.height / 4;
            this.sub.x = this.x + this.width;
            this.totalWidth = this.width + this.sub.width;
            this.totalHeight = this.height + (this.sub.height / 4)
            this.halfHeight = this.totalHeight / 2;
            this.halfWidth = this.totalWidth / 2;
            this.scale.setTo(0.8, 0.8);
            this.sub.scale.setTo(0.8, 0.8);

            this.unknown = this.game.add.text(0, 0, "?", global_style);
            this.unknown.visible = false;
            this.unknown.position.setTo(this.x + this.totalWidth, this.y);
        }
        updatePosition(x, y) {
            this.position.setTo(x, y);
            this.sub.position.setTo(this.x + this.width, this.y + this.sub.height / 4);
            this.unknown.position.setTo(this.x + this.totalWidth, this.y);
        }
    }
}