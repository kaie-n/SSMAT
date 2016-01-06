var _this = this;
window.onload = function () {
    global_style = { font: "14px Courier Bold", fill: "#FFFFFF", wordWrap: false, wordWrapWidth: _this.width, align: "left" };
    global_game = new SSMAT.Game();
    admin_no = document.getElementById("admin_no").value;
    restartFromLeaderboard = false;
};
