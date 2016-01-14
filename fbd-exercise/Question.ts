module fbd {

    export class Question extends Phaser.State {

        diagram: Array<fbd.Diagram>;
        sheet: JSON;
        create() {
            // getting data externally
            this.sheet = this.game.cache.getJSON('sheet');

            
            // diagram initializing
            this.diagram = [];
            this.diagram[0] = new fbd.Diagram(this.game, 0, 0, "pic1");

            (<HTMLInputElement>document.getElementById("instructions")).innerHTML = this.sheet[0].Instruction;
            this.input.onDown.add(this.test, this);
            
        }
        test() {
            var rand = this.game.rnd.integerInRange(0, 2);
            console.log(this.sheet[rand].Question, this.sheet[rand].Part);
        }
        render() {

        }
    }

}