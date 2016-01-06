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
        GameOver.prototype.init = function (timer, elapsed, image) {
            this.score = timer;
            this.numscore = Math.round(elapsed * 100) / 100;
            this.black = this.add.sprite(0, 0, "black");
            this.black.alpha = 1;
            this.registered = false;
            this.image = this.game.add.image((this.game.width / 2) - (image.width / 2), (this.game.height / 2) - (image.height / 2) - 100, image.key);
            this.image.width = image.width;
            this.image.height = image.height;
            this.image.position.x = image.x;
            this.image.position.y = image.y;
        };
        GameOver.prototype.create = function () {
            console.log("GAME OVER, Your score is: ", this.score, this.numscore);
        };
        GameOver.prototype.update = function () {
            var input = document.getElementById("inputfield");
            if (input.style.display == "none" && this.registered == false && admin_no != "") {
                var admin = admin_no;
                admin = admin.toUpperCase();
                admin_no = admin;
                this.preloadBar = this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloadBar');
                this.preloadBar.anchor.setTo(0.5, 0.5);
                this.preloadBar.position.setTo(this.game.width / 2, this.game.height / 2);
                this.preloadBar.animations.add('load');
                this.preloadBar.animations.play('load', 24, true);
                var score = Parse.Object.extend("LeaderBoard");
                var addscore = new score();
                addscore.currentname = Parse.User.current();
                addscore.numscore = this.numscore;
                addscore.score = this.score;
                addscore.admin = admin;
                addscore.this = this;
                addscore.showLeaderBoard = function () {
                    addscore.this.showLeaderBoard();
                };
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
                                            addscore.set("Last", addscore.score);
                                            addscore.set("admin_no", addscore.admin);
                                            addscore.save();
                                        }
                                        else {
                                            var best = object.get("Score");
                                            if (addscore.numscore <= best) {
                                                object.set("Score", addscore.numscore);
                                                object.set("Time", addscore.score);
                                                object.set("Last", addscore.score);
                                            }
                                            if (addscore.numscore > best) {
                                                object.set("Last", addscore.score);
                                            }
                                            object.save();
                                        }
                                        addscore.showLeaderBoard();
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
                                            addscore.set("Last", addscore.score);
                                            addscore.set("admin_no", addscore.admin);
                                            addscore.save();
                                        }
                                        else {
                                            var best = object.get("Score");
                                            if (addscore.numscore <= best) {
                                                object.set("Score", addscore.numscore);
                                                object.set("Time", addscore.score);
                                                object.set("Last", addscore.score);
                                            }
                                            if (addscore.numscore > best) {
                                                object.set("Last", addscore.score);
                                            }
                                            object.save();
                                        }
                                        addscore.showLeaderBoard();
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
                this.registered = true;
            }
            if (restartFromLeaderboard == true) {
                this.restart();
                restartFromLeaderboard = false;
            }
        };
        GameOver.prototype.showLeaderBoard = function () {
            var score = Parse.Object.extend("LeaderBoard");
            var query = new Parse.Query(score);
            var preloadBar = this.preloadBar;
            var temp_this = this;
            document.getElementById("leaderboard_body").innerHTML = "";
            query.ascending("Score");
            query.find({
                success: function (results) {
                    console.log("Successfully retrieved " + results.length + " scores.");
                    var rank = 1;
                    var style = "<tr bgcolor=#904820>";
                    var maxrows = 31;
                    if (results.length > maxrows) {
                        maxrows = results.length;
                    }
                    for (var i = 0; i < maxrows; i++) {
                        if (rank % 2 == 0) {
                            style = "<tr bgcolor=#181818>";
                        }
                        else {
                            style = "<tr bgcolor=#202020>";
                        }
                        if (i < results.length) {
                            var object = results[i];
                            if (object.get('admin_no') == admin_no) {
                                style = "<tr bgcolor=#285c8d id=mine>";
                            }
                            document.getElementById("leaderboard_body").innerHTML += style + "<td align=center>" + rank + "</td> " + "<td align=left>&nbsp;&nbsp;" + object.get('admin_no') + "</td>" + "<td align=center>" + object.get('Last') + "</td>" + "<td align=center>" + object.get('Time') + "</td></tr>";
                            rank++;
                        }
                        if (i > results.length) {
                            document.getElementById("leaderboard_body").innerHTML += style + "<td align=center>" + rank + "</td> " + "<td align=left>&nbsp;&nbsp;" + "</td>" + "<td align=center></td>" + "<td align=center>" + "</td></tr>";
                            rank++;
                        }
                    }
                    preloadBar.visible = false;
                    var leaderboardtable = document.getElementById("scores");
                    leaderboardtable.style.display = 'inline';
                    leaderboardtable.style.opacity = '0';
                    leaderboardtable.style.height = String(window.innerHeight) + 'px';
                    var elem = document.getElementById("mine");
                    if (elem != undefined) {
                        elem.scrollIntoView(true);
                    }
                    var black = temp_this.add.sprite(0, 0, "black");
                    black.visible = false;
                    black.alpha = 0;
                    var tweenie = temp_this.add.tween(black).to({ alpha: 1 }, 1000, Phaser.Easing.Exponential.Out, true);
                    tweenie.onUpdateCallback(function () {
                        leaderboardtable.style.opacity = String(black.alpha);
                    }, this);
                    tweenie.onComplete.addOnce(function () {
                        temp_this.image.visible = false;
                        leaderboardtable.style.opacity = String(black.alpha);
                    }, this);
                },
                error: function (error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
        };
        GameOver.prototype.restart = function () {
            document.getElementById("scores").style.display = "none";
            this.game.state.start('Preloader', true, false);
        };
        return GameOver;
    })(Phaser.State);
    SSMAT.GameOver = GameOver;
})(SSMAT || (SSMAT = {}));
