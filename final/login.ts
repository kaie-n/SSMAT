
module SSMAT {

    export class login extends Phaser.State {

        score: string;
        numscore: number;
        black: Phaser.Sprite;
        registered: boolean;
        init(timer: string, elapsed: number) {
            this.black = this.add.sprite(0, 0, "black");
            this.black.alpha = 1;
            this.registered = false;
            (<HTMLInputElement>document.getElementById("inputfield")).style.display = "inline";
        }
        create() {
            console.log("GAME OVER, Your score is: ", this.score, this.numscore);
            this.input.onDown.addOnce(this.restart, this);
            var input = (<HTMLInputElement>document.getElementById("inputfield"));
            var admin_no = (<HTMLInputElement>document.getElementById("admin_no"));
            if (input.style.display == "none" && this.registered == false && admin_no.value != "") {
                console.log(admin_no.value);
                var score = Parse.Object.extend("LeaderBoard");
                var addscore = new score();
                //sign up
                var user = new Parse.User();
                user.set("username", admin_no.value);
                user.set("password", "LearningAcademy");
                user.signUp(null, {
                    success: function (user) {
                        // Hooray! Let them use the app now.
                    },
                    error: function (user, error) {
                        // Show the error message somewhere and let the user try again.
                        console.log("Error: ", error.code, " ", error.message);
                    }
                });
                //login
                Parse.User.logIn(admin_no.value, "LearningAcademy", {
                    success: function (user) {
                        // Do stuff after successful login.
                        console.log("Login!: ", user, " ");
                    },
                    error: function (user, error) {
                        // The login failed. Check error to see why.
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
                //addscore.set("user", Parse.User.current());
                //addscore.set("Score", this.numscore);
                //addscore.set("Time", this.score);
                //addscore.save();
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
        }
        update() {
           
        }
        restart() {
            this.game.state.start('MainMenu', true, false);
        }
    }
}