module fbd {

    export class Question extends Phaser.State {

        diagram: fbd.Diagram
        btn: fbd.ButtonLabel;
        create() {
            //  getting data externally
            sheet = this.game.cache.getJSON('sheet');
            question = sheet.question[_q]; //  short-named variable for referencing of which question and part
            part = sheet.question[_q].part[_p];

            //  diagram initializing
            this.diagram = new fbd.Diagram(this.game, 0, 0, question.pic, question.co[0], question.co[1]);
            divDetails.innerHTML = part.instruction; 

            //  button initializing
            this.btn = new fbd.ButtonLabel(this.game, 0, 0, 'btn', "Submit", this.submit, this, 0, 0, 1, 0);
            this.btn.x = this.game.width - (this.diagram.squareBox.width / 2) - (this.btn.width / 2); // just because I can and you can't
           
            //  testing purposes
            //this.input.onDown.add(this.submit, this);
            
        }
        submit() {
            if (this.checkAnswers()) {
                this.diagram.squareBox.showAnswer(0, true);
            }
            else {
                this.diagram.squareBox.showAnswer(1, false);
            }
        }

        checkAnswers() {
            //  check for answers
            //  if any of the vectors has the same angle range
            //  return true and show correct
            //  if wrong
            //  return false and show wrong check mark
            if (this.diagram.vector.length <= 0) {
                console.log("vector length lesser than or = 0");
                return false;
            }
            if (this.diagram.vector.length != part.answer.length) {
                console.log("vector length  not = to part.answer length");
                return false;
            }
            var allCorrect = false;
            if (this.diagram.vector.length > 0 || this.diagram.vector.length == part.answer.length) {
                for (var i = 0; i < this.diagram.vector.length; i++) {
                    for (var j = 0; j < part.answer.length; j++) {
                        if (this.diagram.vector[i].angle != part.answer[j]) {
                            console.log(this.diagram.vector[i].angle,"the vector angle", part.answer[j], "the answer");
                            continue;
                            //return false;
                        }
                        if (this.diagram.vector[i].angle == part.answer[j]) {
                            console.log(this.diagram.vector[i].angle, "the vector angle", part.answer[j], "the answer");
                            break;
                            //return true;
                            // means atleast 1 vector is the same answer
                        }
                    }
                }
            }
            return true;
        }

        render() {

        }
    }

}