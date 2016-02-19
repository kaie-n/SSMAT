module fbd {

    export class Question extends Phaser.State {

        diagram: fbd.Diagram
        btn: fbd.ButtonLabel;
        mcq: HTMLInputElement;
        create() {
            //  getting data externally
            sheet = this.game.cache.getJSON('sheet');
            this.initialize();
        }
        initialize() {
            question = sheet.question[_q]; //  short-named variable for referencing of which question and part
            part = sheet.question[_q].part[_p];

            //  diagram initializing
            this.diagram = new fbd.Diagram(this.game, 0, 0, question.pic, question.co[0], question.co[1]);
            this.diagram.limit = question.limit;
            divDetails.innerHTML = part.instruction; 

            //  button initializing
            this.btn = new fbd.ButtonLabel(this.game, 0, 0, 'btn', "Submit", this.submit, this, 0, 0, 1, 0);
            this.btn.x = this.game.width - (this.diagram.squareBox.width / 2) - (this.btn.width / 2); // just because I can and you can't
            this.btn.y = this.game.height - this.btn.height;
            this.switchParts();

            // reinitialize mcq
            var check = (<NodeListOf<HTMLInputElement>>document.getElementsByClassName("check"));
            for (var i = 0; i < check.length; i++) {
                check[i].innerHTML = ""
            }
            var body: HTMLElement = (<HTMLElement>document.getElementById("body"));
            body.innerHTML = "";
        }
        switchParts() {
            switch (_p) {
                case 0:
                    if (this.diagram.squareBox.resolve.visible) {
                        this.diagram.squareBox.resolve.visible = false;
                        mcq.style.display = "none"
                    }
                    break;
                case 1:
                    if (!this.diagram.squareBox.resolve.visible) {
                        this.diagram.squareBox.resolve.visible = true;
                        mcq.style.display = "none"
                    }
                    break;
                case 2:
                    if (this.diagram.squareBox.resolve.visible) {


                        this.diagram.vector[0].getRelativeAngle();
                        this.diagram.vector[0].drawCurve();
                        mcq.style.display = "inline";
                    }
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
                if (_q == (sheet.question.length - 1) && _p > 2) {
                    this.game.state.start('Finish', true, false);
                    return;
                }
                if (_p > 2) {
                    _q++;
                    _p = 0;
                    this.diagram.destroyAll();
                    this.initialize();
                }
                part = sheet.question[_q].part[_p];
                divDetails.innerHTML = part.instruction;
                this.btn.label.text = "Submit";
                this.diagram.squareBox.hideAnswer();
                this.switchParts();

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
            if (_p == 2) {
                if (this.part3()) {
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
                return false;
            }
            if (this.diagram.vector.length != question.limit) {
                return false;
            }
            var allCorrect = 0;

            if (this.diagram.vector.length > 0 || this.diagram.vector.length == part.answer.length) {
                for (var i = 0; i < this.diagram.vector.length; i++) {
                    for (var j = 0; j < part.answer.length; j++) {
                        if (part.answer[j].angle.length > 0) {
                            if (this.diagram.vector[i].angle >= part.answer[j].angle[0] && this.diagram.vector[i].angle <= part.answer[j].angle[1] && this.diagram.vector[i].labelGrouped == part.answer[j].forceLabels) {
                                allCorrect++;
                                console.log(part.answer[j], "PART 1 angle range");
                                break;
                            }
                        }
                        if (part.answer[j].angle.constructor != Array) {
                            if (this.diagram.vector[i].angle == part.answer[j].angle && this.diagram.vector[i].labelGrouped == part.answer[j].forceLabels) {
                                allCorrect++;
                                console.log(part.answer[j], "PART 2 Normal angle range");
                                break;
                            }
                        }
                        //if (part.answer[j].length > 0) {
                        //    // check whether angle is in range or not.
                        //    if (this.diagram.vector[i].angle >= part.answer[j][0] && this.diagram.vector[i].angle <= part.answer[j][1]) {
                        //        allCorrect++;
                        //        break;
                        //        //return true;
                        //        // means atleast 1 vector is the same answer
                        //    }
                        //}
                        //if (part.answer[j].constructor != Array) {
                        //    if (this.diagram.vector[i].angle == part.answer[j]) {
                        //        allCorrect++;
                        //        break;
                        //        //return true;
                        //        // means atleast 1 vector is the same answer
                        //    }
                        //}
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
                console.log(this.diagram.vector[i].group.x, this.diagram.vector[i].group.y)
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
        part3() {
            var selectedAnswer = (<NodeListOf<HTMLInputElement>>document.getElementsByName("answer"));
            var check = (<NodeListOf<HTMLInputElement>>document.getElementsByClassName("check"));
            var bool = false;
            for (var i = 0; i < selectedAnswer.length; i++) {
                if (part.answer == selectedAnswer[i].value) {
                    bool = true;
                    check[i].style.color = "#00FF00";
                    check[i].innerHTML = "✔"
                }
                else {
                    check[i].style.color = "#FF0000";
                    check[i].innerHTML = "✖"
                }
            }
            return bool;
        }
    }

}