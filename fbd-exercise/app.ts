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
declare var vectorCoords;
declare var canvasXnY;
window.onload = () => {
    vectorCoords = {
        "x": 0,
        "y": 0
    };
    vectorOffset = 0;
    mcq = (<HTMLInputElement>document.getElementById("form-float"));
    mcqAnswers = (<HTMLInputElement>document.getElementById("form-answers"));
    divDetails = (<HTMLInputElement>document.getElementById("instructions"));
    canvasXnY = (<HTMLInputElement>document.getElementById("cannyvas"));
    
    global_style = { font: "14px 'Segoe UI', sans-serif", fill: "#000000", wordWrap: false, wordWrapWidth: this.width, align: "left" };
    var game = new fbd.Game();

};

function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}