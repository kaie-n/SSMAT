
declare var admin_no;
declare var restartFromLeaderboard: boolean;
declare var global_game: SSMAT.Game;
declare var global_style;
declare var level_choice: string; // level selector for leaderboard
window.onload = () => {
    global_style = { font: "24px Verdana Bold", fill: "#FFFFFF", stroke: 'black', strokeThickness: 2, shadowStroke: true,wordWrap: false, wordWrapWidth: this.width, align: "left" };
 
    global_game = new SSMAT.Game();
    admin_no = (<HTMLInputElement>document.getElementById("admin_no")).value;
  
    restartFromLeaderboard = false;
    level_choice = "";
    
};


//function adjust() {
//    var divgame = document.getElementById("content");
//    divgame.style.width = window.innerWidth + "px";
//    divgame.style.height = window.innerHeight + "px";
//    if (global_game != undefined) {
//    }
//}

//window.addEventListener('resize', function () {
//    adjust();
//});