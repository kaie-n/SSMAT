var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SSMAT;
(function (SSMAT) {
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        function GameOver() {
            _super.apply(this, arguments);
        }
        GameOver.prototype.init = function (timer, elapsed) {
            this.score = timer;
            this.numscore = Math.round(elapsed * 100) / 100;
            this.black = this.add.sprite(0, 0, "black");
            this.black.alpha = 1;
            this.registered = false;
            document.getElementById("inputfield").style.display = "inline";
        };
        GameOver.prototype.create = function () {
            console.log("GAME OVER, Your score is: ", this.score, this.numscore);
            this.input.onDown.addOnce(this.restart, this);
        };
        GameOver.prototype.update = function () {
            var input = document.getElementById("inputfield");
            var admin = admin_no;
            if (input.style.display == "none" && this.registered == false && admin != "") {
                var score = Parse.Object.extend("LeaderBoard");
                var addscore = new score();
                addscore.currentname = Parse.User.current();
                addscore.numscore = this.numscore;
                addscore.score = this.score;
                var query = new Parse.Query(score);
                var user = new Parse.User();
                user.set("username", admin);
                user.set("password", "LearningAcademy");
                user.signUp(null, {
                    success: function (user) {
                        Parse.User.logIn(admin, "LearningAcademy", {
                            success: function (user) {
                                query.equalTo("user", Parse.User.current());
                                query.first({
                                    success: function (object) {
                                        if (object === undefined) {
                                            addscore.set("user", Parse.User.current());
                                            addscore.set("Score", addscore.numscore);
                                            addscore.set("Time", addscore.score);
                                            addscore.save();
                                        }
                                        else {
                                            object.set("Score", addscore.numscore);
                                            object.set("Time", addscore.score);
                                            object.save();
                                        }
                                    },
                                    error: function (error) {
                                        console.log("Error: ", error.code, " ", error.message);
                                    }
                                });
                            },
                            error: function (user, error) {
                                console.log("Error: " + error.code + " " + error.message);
                            }
                        });
                    },
                    error: function (user, error) {
                        console.log("Error: ", error.code, " ", error.message);
                        Parse.User.logIn(admin, "LearningAcademy", {
                            success: function (user) {
                                query.equalTo("user", Parse.User.current());
                                query.first({
                                    success: function (object) {
                                        if (object === undefined) {
                                            addscore.set("user", Parse.User.current());
                                            addscore.set("Score", addscore.numscore);
                                            addscore.set("Time", addscore.score);
                                            addscore.save();
                                        }
                                        else {
                                            object.set("Score", addscore.numscore);
                                            object.set("Time", addscore.score);
                                            object.save();
                                        }
                                    },
                                    error: function (error) {
                                        console.log("Error: ", error.code, " ", error.message);
                                    }
                                });
                            },
                            error: function (user, error) {
                                console.log("Error: " + error.code + " " + error.message);
                            }
                        });
                    }
                });
                query.find({
                    success: function (results) {
                        console.log("Successfully retrieved " + results.length + " scores.");
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            console.log(object.id + ' - ' + object.get('Score'));
                        }
                    },
                    error: function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
                this.registered = true;
            }
        };
        GameOver.prototype.restart = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return GameOver;
    })(Phaser.State);
    SSMAT.GameOver = GameOver;
})(SSMAT || (SSMAT = {}));
