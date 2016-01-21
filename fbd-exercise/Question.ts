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
            this.diagram.limit = question.limit;
            divDetails.innerHTML = part.instruction; 

            //  button initializing
            this.btn = new fbd.ButtonLabel(this.game, 0, 0, 'btn', "Submit", this.submit, this, 0, 0, 1, 0);
            this.btn.x = this.game.width - (this.diagram.squareBox.width / 2) - (this.btn.width / 2); // just because I can and you can't
           
            //  testing purposes
            //this.input.onDown.add(this.submit, this);
            
        }
        update() {
            switch (_p) {
                case 0:
                    this.diagram.squareBox.resolve.visible = false;
                    break;
                case 1:
                    this.diagram.squareBox.resolve.visible = true;
                    break;
                case 2:
                    this.diagram.squareBox.resolve.visible = false;
                    this.diagram.vector[0].group.destroy(true, false);
                    this.diagram.vector[1].group.destroy(true, false);
                    this.diagram.vector[2].group.destroy(true, false);
                    break;
            }
        }
        submit() {
            if (this.btn.label.text == "Submit") {
                if (this.checkAnswers()) {
                    this.diagram.squareBox.showAnswer(0, true);
                    this.btn.label.text = "Next";
                    return;
                }
                else {
                    this.diagram.squareBox.showAnswer(1, false);
                    return;
                }
            }
            if (this.btn.label.text == "Next") {
                _p++;
                part = sheet.question[_q].part[_p];
                divDetails.innerHTML = part.instruction;
                this.btn.label.text = "Submit";
                this.diagram.squareBox.hideAnswer();
                return;
            }
        }

        checkAnswers() {
            if (_p == 0) {
                if (this.part1()) {
                    return true;
                }
                else {
                    return false;
                }
            }
            if (_p == 1) {
                if (this.part2()) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        part1() {
            //  check for answers
            //  if any of the vectors has the same angle range
            //  return true and show correct
            //  if wrong
            //  return false and show wrong check mark
            if (this.diagram.vector.length <= 0) {
                console.log("vector length lesser than or = 0");
                return false;
            }
            if (this.diagram.vector.length != question.limit) {
                console.log("vector length  not = to part.answer length");
                return false;
            }
            var allCorrect = 0;
            if (this.diagram.vector.length > 0 || this.diagram.vector.length == part.answer.length) {
                for (var i = 0; i < this.diagram.vector.length; i++) {
                    for (var j = 0; j < part.answer.length; j++) {
                        if (part.answer[j].length > 0) {
                            if (this.diagram.vector[i].angle >= part.answer[j][0] && this.diagram.vector[i].angle <= part.answer[j][1]) {
                                console.log(this.diagram.vector[i].angle, "the vector angle", "answer is  within range and correct!");
                                allCorrect++;
                                break;
                                //return true;
                                // means atleast 1 vector is the same answer
                            }
                        }
                        if (part.answer[j].constructor != Array) {
                            if (this.diagram.vector[i].angle != part.answer[j]) {
                                //console.log(this.diagram.vector[i].angle,"the vector angle", part.answer[j], "the answer", "answer is wrong");
                                continue;
                                //return false;
                            }
                            if (this.diagram.vector[i].angle == part.answer[j]) {
                                console.log(this.diagram.vector[i].angle, "the vector angle", part.answer[j], "the answer", "answer is correct!");
                                allCorrect++;
                                break;
                                //return true;
                                // means atleast 1 vector is the same answer
                            }
                        }
                    }
                }
            }
            if (allCorrect == question.limit) {
                return true;
            }
            if (allCorrect < question.limit) {
                return false;
            }
        }
        part2() {
            var allCorrect = 0;
            for (var i = 0; i < this.diagram.vector.length; i++) {
                if (this.diagram.vector[i].group.x == part.answer[0] && this.diagram.vector[i].group.y == part.answer[1]) {
                    allCorrect++;
                }
            }
            if (allCorrect == question.limit) {
                return true;
            }
            if (allCorrect < question.limit) {
                return false;
            }
        }
    }

}