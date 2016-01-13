module fbd {

    export class Question1 extends Phaser.State {

        diagram: fbd.Diagram;

        create() {
            this.diagram = new fbd.Diagram(this.game, 0, 0, "pic1");
        }
        render() {

        }
    }

}