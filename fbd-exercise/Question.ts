module fbd {

    export class Question extends Phaser.State {

        diagram: fbd.Diagram
        sheet: any;
        btn: fbd.ButtonLabel;
        create() {
            //  getting data externally
            this.sheet = this.game.cache.getJSON('sheet');

            
            //  diagram initializing
            this.diagram = new fbd.Diagram(this.game, 0, 0, "pic1");
            (<HTMLInputElement>document.getElementById("instructions")).innerHTML = this.sheet.question[_q].part[_p].instruction; 

            //  button initializing
            this.btn = new fbd.ButtonLabel(this.game,0, 0, 'btn', "Submit", this.submit, this, 0, 0, 1, 0);
            this.btn.x = this.game.width - (this.diagram.squareBox.width / 2) - (this.btn.width / 2); // just because I can and you can't
           
            //  testing purposes
            this.input.onDown.add(this.test, this);
            
        }
        submit() {
            this.checkAnswers();
        }
        checkAnswers() {
            var bool: boolean = true;
            //  check for answers
            //  if any of the vectors has the same angle range
            //  return true and show correct
            //  if wrong
            //  return false and show wrong check mark


            return bool;
        }

        test() {
        }
        render() {

        }
    }

}