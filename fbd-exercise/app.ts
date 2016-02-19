declare var _q: number;
declare var _p: number;
declare var global_style;
declare var question;
declare var part;
declare var divDetails: HTMLInputElement;
declare var mcq: HTMLInputElement;
declare var mcqAnswers: HTMLInputElement;
declare var sheet;
declare var vectorOffset: number;
declare var inputBox;
window.onload = () => {

    vectorOffset = 0;
    mcq = (<HTMLInputElement>document.getElementById("form-float"));
    mcqAnswers = (<HTMLInputElement>document.getElementById("form-answers"));
    divDetails = (<HTMLInputElement>document.getElementById("instructions"));
    global_style = { font: "14px 'Segoe UI', sans-serif", fill: "#000000", wordWrap: false, wordWrapWidth: this.width, align: "left" };
    var game = new fbd.Game();

};