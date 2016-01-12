
module SSMAT {

    export class GameOver extends Phaser.State {

        score: string;
        numscore: number;
        black: Phaser.Sprite;
        registered: boolean;
        text: Phaser.Text;
        preloadBar: Phaser.Sprite;
        image: Phaser.Image;
        init(timer: string, elapsed: number, image:Phaser.Image) {
            this.score = timer;
            this.numscore = Math.round(elapsed * 100) / 100;
            this.black = this.add.sprite(0, 0, "black");
            this.black.alpha = 1;
            this.registered = false;
            //this.image = image;
            this.image = this.game.add.image((this.game.width / 2) - (image.width / 2), (this.game.height / 2) - (image.height / 2) - 100, image.key);
            this.image.width = image.width;
            this.image.height = image.height;
            this.image.position.x = image.x;
            this.image.position.y = image.y;
            
            //(<HTMLInputElement>document.getElementById("inputfield")).style.display = "inline";
        }
        create() {
            console.log("GAME OVER, Your score is: ", this.score, this.numscore);

        }
        update() {
            var input = (<HTMLInputElement>document.getElementById("inputfield"));
            
            if (input.style.display == "none" && this.registered == false && admin_no != "") {
                var admin: string = admin_no;
                admin = admin.toUpperCase();
                admin_no = admin;
                this.preloadBar = this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloadBar');
                this.preloadBar.anchor.setTo(0.5, 0.5);
                this.preloadBar.position.setTo(this.game.width / 2, this.game.height / 2);
                this.preloadBar.animations.add('load');
                this.preloadBar.animations.play('load', 24, true);
                var score = Parse.Object.extend(level_choice);
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

                //sign up
                var user = new Parse.User();
                user.set("username", admin);
                user.set("password", "LearningAcademy");
                user.signUp(null, {
                    success: function (user) {
                        // Hooray! Let them use the app now.
                        Parse.User.logIn(admin, "LearningAcademy", {
                            success: function (user) {
                                // Do stuff after successful login.
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
                                            if(addscore.numscore <= best) {
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
                                // The login failed. Check error to see why.
                                console.log("Error: " + error.code + " " + error.message);
                            }
                        });
                    },
                    error: function (user, error) {
                        // If admin number is not inside database, create them anyway
                        console.log("Error: ", error.code, " ", error.message);
                        Parse.User.logIn(admin, "LearningAcademy", {
                            success: function (user) {
                                // Do stuff after successful login.
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
                                // The login failed. Check error to see why.
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
        }

        showLeaderBoard() {
            var score = Parse.Object.extend(level_choice);
            var query = new Parse.Query(score);
            var preloadBar = this.preloadBar;
            var temp_this = this;
            (<HTMLInputElement>document.getElementById("leaderboard_body")).innerHTML = "";
            query.ascending("Score");
            query.find({
                success: function (results) {
                    console.log("Successfully retrieved " + results.length + " scores.");
                    // Do something with the returned Parse.Object values
                    var rank = 1;
                    var style = "<tr bgcolor=#904820>";
                    var maxrows = 31;
                    if (results.length > maxrows)
                    {
                        maxrows = results.length;
                    }
                        for (var i = 0; i < maxrows; i++) {

                        if (rank % 2 == 0) {
                            style = "<tr bgcolor=#181818>"
                        }
                        else {
                            style = "<tr bgcolor=#202020>"
                        }
                        if (i < results.length) {
                            var object = results[i];

                            if (object.get('admin_no') == admin_no) {
                                style = "<tr bgcolor=#285c8d id=mine>"
                            }
                            (<HTMLInputElement>document.getElementById("leaderboard_body")).innerHTML += style + "<td align=center>" + rank + "</td> " + "<td align=left>&nbsp;&nbsp;" + object.get('admin_no') + "</td>" + "<td align=center>" + object.get('Last') + "</td>" + "<td align=center>" + object.get('Time') + "</td></tr>";
                            rank++;
                        }
                        if (i > results.length) {
                            (<HTMLInputElement>document.getElementById("leaderboard_body")).innerHTML += style + "<td align=center>" + rank + "</td> " + "<td align=left>&nbsp;&nbsp;" + "</td>" + "<td align=center></td>" + "<td align=center>" + "</td></tr>";
                            rank++;
                        }

                    }
                    preloadBar.visible = false;
                    var leaderboardtable = (<HTMLInputElement>document.getElementById("scores"));
                    leaderboardtable.style.display = 'inline'
                    leaderboardtable.style.opacity = '0';
                    leaderboardtable.style.height = String(window.innerHeight) + 'px';
                    //(<HTMLInputElement>document.getElementById("scores")).style.display = "inline";
                    var elem = (<HTMLInputElement>document.getElementById("mine"));
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
        }

        restart() {

            //var temp = this.input.onDown.addOnce(this.restart, this);
            (<HTMLInputElement>document.getElementById("scores")).style.display = "none";
            this.game.state.start('Preloader', true, false);
        }
    }
}