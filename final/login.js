var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SSMAT;
(function (SSMAT) {
    var login = (function (_super) {
        __extends(login, _super);
        function login() {
            _super.apply(this, arguments);
        }
        login.prototype.init = function (timer, elapsed) {
            this.black = this.add.sprite(0, 0, "black");
            this.black.alpha = 1;
            this.registered = false;
            document.getElementById("inputfield").style.display = "inline";
        };
        login.prototype.create = function () {
            console.log("GAME OVER, Your score is: ", this.score, this.numscore);
            this.input.onDown.addOnce(this.restart, this);
            var input = document.getElementById("inputfield");
            var admin_no = document.getElementById("admin_no");
            if (input.style.display == "none" && this.registered == false && admin_no.value != "") {
                console.log(admin_no.value);
                var score = Parse.Object.extend("LeaderBoard");
                var addscore = new score();
                var user = new Parse.User();
                user.set("username", admin_no.value);
                user.set("password", "LearningAcademy");
                user.signUp(null, {
                    success: function (user) {
                    },
                    error: function (user, error) {
                        console.log("Error: ", error.code, " ", error.message);
                    }
                });
                Parse.User.logIn(admin_no.value, "LearningAcademy", {
                    success: function (user) {
                        console.log("Login!: ", user, " ");
                    },
                    error: function (user, error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
                addscore.currentname = Parse.User.current();
                addscore.numscore = this.numscore;
                addscore.score = this.score;
                var query = new Parse.Query(score);
                query.equalTo("user", Parse.User.current());
                query.first({
                    success: function (object) {
                        console.log("Successfully retrieved ", object, "DName");
                        console.log(addscore.numscore);
                        console.log(addscore.score);
                        if (object === undefined) {
                            console.log("undefined!");
                            addscore.set("user", Parse.User.current());
                            addscore.set("Score", addscore.numscore);
                            addscore.set("Time", addscore.score);
                            addscore.save();
                        }
                        else {
                            console.log("defined!");
                            object.set("Score", addscore.numscore);
                            object.set("Time", addscore.score);
                            object.save();
                        }
                    },
                    error: function (error) {
                        console.log("Error: ", error.code, " ", error.message);
                    }
                });
                console.log(this.numscore, this.score);
                this.registered = true;
            }
        };
        login.prototype.update = function () {
        };
        login.prototype.restart = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return login;
    })(Phaser.State);
    SSMAT.login = login;
})(SSMAT || (SSMAT = {}));
