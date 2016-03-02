
declare var admin_no;
declare var restartFromLeaderboard: boolean;
declare var global_game: SSMAT.Game;
declare var global_style;
declare var level_choice: string; // level selector for leaderboard
declare var developer: boolean;
window.onload = () => {
    global_style = { font: "24px Verdana Bold", fill: "#FFFFFF", stroke: 'black', strokeThickness: 2, shadowStroke: true,wordWrap: false, wordWrapWidth: this.width, align: "left" };
 
    global_game = new SSMAT.Game();
    admin_no = (<HTMLInputElement>document.getElementById("admin_no")).value;
  
    restartFromLeaderboard = false;
    level_choice = "";
    developer = false; 
};

function resizeGame() {
    
    var size = { width: window.innerWidth, height: window.innerHeight };
    //console.log('resizing to ', size.width, size.height);
    global_game.width = size.width;
    global_game.height = size.height;
    global_game.canvas.width = size.width;
    global_game.canvas.height = size.height;
    global_game.scale.width = size.width;
    global_game.scale.height = size.height;
    global_game.world.width = size.width;
    global_game.world.height = size.height;
    global_game.renderer.resize(size.width, size.height);
}
