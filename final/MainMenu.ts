
module SSMAT {
    export class MainMenu extends Phaser.State {
        background: Phaser.Sprite;
        wheel: Phaser.Sprite;
        black: Phaser.Sprite;
        grad: Phaser.Sprite;
        tiler: Phaser.TileSprite;
        wheelGroup: Phaser.Group;
        graphics: Phaser.Graphics;
        button: Phaser.Button;
        help: Phaser.Button;
        resetbtn: Phaser.Button;
        image: Phaser.Image;
        timer: Phaser.Text;
        painter: SSMAT.Painter;
        tons: Array<SSMAT.Tons>;
        tons2: Array<SSMAT.Tons>;
        clockTime: number;
        score: string;
        sumFx: number;
        sumFy: number;
        sumR: number;
        sumAngle: number;
        gravity: number;
        noGridCompleted: number;
        dt: number;
        t: number;
        dropped: boolean;
        started: boolean;
        sprite: Array<Array<SSMAT.Grid>>;
        spriteGroup: Phaser.Group;
        style: any;
        tileHeight: number;
        arrow: Array<SSMAT.Arrow>;
        vector: Phaser.Button;
        gameTimer: Phaser.Timer;
        create() {

            Parse.User.logOut();
            //static settings 
            this.tileHeight = 30;// set the button height limit according to the tile
            this.clockTime = 0;
            this.noGridCompleted = 0;

            this.style = { font: "20px Courier", fill: "#FFFFFF", wordWrap: false, wordWrapWidth: 0, align: "center" };
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.score = "";
            this.gravity = 9.81;
            this.dt = 0.0833333333333333;
            this.t = 0;
            this.dropped = false;
            this.started = false;
            this.arrow = [];

            // background

            // ground tiles
            this.tiler = this.game.add.tileSprite(0, this.world.height - this.tileHeight, this.game.width, this.game.height, 'tile');
            this.tiler.alpha = 1;
            this.game.physics.arcade.enable(this.tiler);
            this.tiler.body.immovable = true;
            this.tiler.body.allowGravity = false;

            this.grad = this.game.add.sprite(0, 0, "gradient");
            // the image painting itself;
            // Math.floor(Math.random() * (max - min + 1)) + min;
            var randomImage = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
            var stringUrl = 'pic' + randomImage
            this.image = this.game.add.image(0, 0, stringUrl);
            this.image.width = 450;
            this.image.height = 253;
            var randomMin = (this.game.height / 2) - (this.image.height / 2) - 100;
            var randomMax = (this.game.height) - this.image.height - 200;
            this.image.position.x = (this.game.width / 2) - (this.image.width / 2);
            this.image.position.y = Math.floor(Math.random() * (randomMax - randomMin + 1)) + randomMin;
            this.grad.y = this.image.position.y - 14;
            this.grad.x = this.image.position.x - 14;
            this.image.visible = false;
            // use the bitmap data as the texture for the sprite
            // generate the grid lines
            var distributeWidth = this.image.position.x;
            var distributeHeight = this.image.position.y;
            this.sprite = [];
            this.spriteGroup = this.game.add.group();
            for (var i = 0; i < 2; i++) {
                this.sprite[i] = [];
                distributeWidth = this.image.position.x;
                for (var j = 0; j < 3; j++) {
                    this.sprite[i][j] = new Grid(this.game, distributeWidth, distributeHeight);

                    distributeWidth += this.sprite[i][j].width - 1;
                    this.sprite[i][j].inputEnabled = true;
                    this.sprite[i][j].main = this;
                    this.spriteGroup.addChild(this.sprite[i][j]);
                    this.sprite[i][j].events.onInputDown.add(this.testClick, this)
                }
                distributeHeight += 126.5;
            }
            // this is to initialize the main painter
            this.painter = new Painter(this.game, this.world.centerX, this.game.height, 90, this.gravity);
            //this.painter.y -= this.painter.height + this.tileHeight + 50
            this.painter.y = 509.1707368654838;

            this.painter.anchor.setTo(0.5, 0);
            this.game.physics.arcade.enable(this.painter);
            this.stage.smoothed = false;
            this.game.stage.smoothed = false;

            // adding the wheels for the pulley
            this.wheelGroup = this.game.add.group();
            this.wheel = this.add.sprite(0, 0, 'wheel', 0);
            this.wheelGroup.addChild(this.wheel);
            this.wheel = this.add.sprite(0, 0, 'wheel', 0);
            this.wheelGroup.addChild(this.wheel);

            this.wheelGroup.getChildAt(0).x = this.grad.x - this.wheel.width;
            this.wheelGroup.getChildAt(1).x = this.grad.x + this.grad.width;

            // adding the tons for the pulley (0 for left, 1 for right)
            // tons2 is the weights that we are going to add from the button

            this.graphics = this.add.graphics(0, 0);
            this.tons = [];
            this.tons2 = [];
            this.tons[0] = new Tons(this.game, this.wheelGroup.getChildAt(0).x, this.wheelGroup.getChildAt(0).y + this.wheel.height, 10, this.gravity, "left");
            this.tons[1] = new Tons(this.game, this.wheelGroup.getChildAt(1).x + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height, 10, this.gravity, "right");
            this.tons[0].main = this;
            this.tons[1].main = this;
            this.tons[0].name = "left";
            this.tons[1].name = "right";
            this.game.physics.arcade.enable([this.tons[0], this.tons[1]])
            this.tons[0].body.allowGravity = false;
            this.tons[1].body.allowGravity = false;

            // the pulley "strings"
            this.graphics.lineStyle(1, 0x111111);

            this.graphics.moveTo(Math.round(this.tons[0].x), Math.round(this.tons[0].y));
            this.graphics.lineTo(Math.round(this.tons[0].x), Math.round(this.wheelGroup.getChildAt(0).y + this.wheel.height / 2));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round((this.tons[0].x) + this.wheel.width), Math.round(this.wheelGroup.getChildAt(0).y + this.wheel.height / 2));
            this.graphics.lineTo(Math.round(this.painter.x), Math.round(this.painter.y));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.lineTo(Math.round(this.painter.x), Math.round(this.painter.y));
            this.graphics.lineTo(Math.round((this.tons[1].x) - this.wheel.width), Math.round(this.wheelGroup.getChildAt(1).y + this.wheel.height / 2));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round(this.tons[1].x), Math.round(this.wheelGroup.getChildAt(1).y + this.wheel.height / 2));
            this.graphics.lineTo(Math.round(this.tons[1].x), Math.round(this.tons[1].y));
            // tweening the main intro screen
           
            this.button = new SSMAT.ButtonLabel(this.game, this.game.world.width - 82 - 100, this.game.world.height - this.tileHeight, 'button', "ADD WEIGHT", this.addWeight, this, 0, 0, 1, 0);
            this.button.y -= this.button.height
            this.button.anchor.setTo(0.5, 0);

            this.help = new SSMAT.ButtonLabel(this.game, this.button.x + this.button.width + 1, this.button.y, 'help', "TIPS", this.tips, this, 0, 0, 1, 0);
            this.help.anchor.setTo(0.5, 0);

            this.resetbtn = new SSMAT.ButtonLabel(this.game, this.help.x + this.button.width + 1, this.button.y, 'reset', "RESET!", this.reset, this, 0, 0, 1, 0);
            this.resetbtn.anchor.setTo(0.5, 0);

            this.vector = new SSMAT.ButtonLabel(this.game, this.resetbtn.x + this.button.width + 1, this.button.y, 'vector', "HIDE DETAILS!", this.hide, this, 0, 0, 1, 0);
            this.vector.anchor.setTo(0.5, 0);
            // calculations to make the system in an equilibrium

            this.tons[1].angleA = Phaser.Math.angleBetween(this.painter.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, this.painter.y)
            this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, this.painter.x, this.painter.y)
            this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100
            this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100
            this.tons[0].convertAngle();
            this.tons[1].convertAngle();
            var temp2 = Math.round((Math.cos(this.tons[0].angleA) / Math.cos(this.tons[1].angleA)) * 1000) / 1000 // Tons1 = Cos(Ton0.angle) / Cos(Ton1.Angle)
            var temp = Math.round((temp2 * (Math.sin(this.tons[1].angleA)) + Math.sin(this.tons[0].angleA)) * 1000) / 1000
            this.tons[0].force = Math.round((this.painter.force / temp) * 10) / 10
            this.tons[1].force = Math.round((this.tons[0].force * temp2) * 10) / 10
            this.tons[0].mass = Math.round((this.tons[0].force / this.gravity) * 10) / 10
            this.tons[1].mass = Math.round((this.tons[1].force / this.gravity) * 10) / 10
            this.tons[0]._dx = this.tons[0].position.clone();
            this.tons[1]._dx = this.tons[1].position.clone();
            // setting the correct answers for each grid dynamically
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 3; j++) {
                    var tempPoint = new Phaser.Point(this.sprite[i][j].x + this.sprite[i][j].width / 2, this.sprite[i][j].y + (this.sprite[i][j].height / 2) - (this.painter.height / 2));

                    this.sprite[i][j].angleB = Phaser.Math.angleBetween(tempPoint.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, tempPoint.y)
                    this.sprite[i][j].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, tempPoint.x, tempPoint.y)
                    this.sprite[i][j].angleB = Math.round(this.sprite[i][j].angleB * 100) / 100;
                    this.sprite[i][j].angleA = Math.round(this.sprite[i][j].angleA * 100) / 100;

                    this.sprite[i][j].angleA = Math.round(Phaser.Math.radToDeg(this.sprite[i][j].angleA) * 100) / 100
                    this.sprite[i][j].angleB = Math.round(Phaser.Math.radToDeg(this.sprite[i][j].angleB) * 100) / 100
                    this.sprite[i][j].setAnswers();
                    console.log(this.sprite[i][j].answerA, this.sprite[i][j].answerB);
                }
            }

            // Timer for scoring purposes
            this.timer = this.game.add.text(this.world.centerX, 20, "TIME\n00:00:00", global_style);
            this.timer.align = "center";

            this.timer.setShadow(1, 1, 'rgba(0,0,0,1)', 1);
            this.timer.anchor.setTo(0.5, 0);
            this.timer.x = Math.round(this.timer.x);
            this.timer.y = Math.round(this.timer.y);
            this.world.alpha = 0;
            var worldTween = this.add.tween(this.world).to({ alpha: 1 }, 1000, Phaser.Easing.Exponential.InOut, true);
            worldTween.onComplete.addOnce(function () {
                this.image.visible = true;
                this.painter.started = true;
                this.tons[0].started = true;
                this.tons[1].started = true;

                this.started = true;
                this.startGame();
            }, this);
            this.tiler.alpha = 1;
            this.tons[0].dmass = this.tons[0].mass;
            this.tons[1].dmass = this.tons[1].mass;
            this.createArrows();
            var ESCAPE = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
            this.gameTimer = this.game.time.create(false);
            
            ESCAPE.onDown.add(function () {
                this.gameTimer.pause();
                var r = confirm("Exit the game?");
                if (r) {
                    this.game.state.start('Preloader', true, false);
                }
                else {
                    this.gameTimer.resume()
                }
            }, this);
        }
        hide() {
            for (var i = 0; i < this.arrow.length; i++) {
                this.arrow[i].visible = !this.arrow[i].visible;
                if (i < 2) {
                    this.arrow[i].components[0].visible = this.arrow[i].visible;
                    this.arrow[i].components[1].visible = this.arrow[i].visible;
                }
            }
        }
        createArrows() {
            var point1 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            var point2 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var arrow0Point = new Phaser.Point((point1.x + this.painter.x) / 2, (point1.y + this.painter.y) / 2);
            var arrow1Point = new Phaser.Point((point2.x + this.painter.x) / 2, (point2.y + this.painter.y) / 2);
            this.arrow[0] = new SSMAT.Arrow(this.game, arrow0Point.x, arrow0Point.y, "arrow-green", -1, true);
            this.arrow[0].rotation = this.tons[0].angleA;
            //
            this.arrow[1] = new SSMAT.Arrow(this.game, arrow1Point.x, arrow1Point.y, "arrow-blue", 1, true);
            this.arrow[1].rotation = -this.tons[1].angleA;
            //
            this.arrow[2] = new SSMAT.Arrow(this.game, this.painter.x, this.painter.y + this.painter.height, "arrow-red", 1, false);

            this.arrow[2].rotation = 1.57079633;
            this.arrow[2].main = this;

            this.hide();
        }
        resetArrows() {
            var point1 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            var point2 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var arrow0Point = new Phaser.Point((point1.x + this.painter.x) / 2, (point1.y + this.painter.y) / 2);
            var arrow1Point = new Phaser.Point((point2.x + this.painter.x) / 2, (point2.y + this.painter.y) / 2);

            this.arrow[0].position.copyFrom(arrow0Point);
            this.arrow[0].rotation = this.tons[0].angleA;
            //
            this.arrow[1].position.copyFrom(arrow1Point);
            this.arrow[1].rotation = -this.tons[1].angleA;
            //
            this.arrow[2].position.copyFrom(this.painter.position);
            this.arrow[2].y += this.painter.height;
        }
        moveArrows() {
            var point1 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            var point2 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var arrow0Point = new Phaser.Point((point1.x + this.painter.x) / 2, (point1.y + this.painter.y) / 2);
            var arrow1Point = new Phaser.Point((point2.x + this.painter.x) / 2, (point2.y + this.painter.y) / 2);

            this.arrow[0].position.copyFrom(arrow0Point);
            //this.arrow[0].rotation = this.tons[0].angleA;
            //
            this.arrow[1].position.copyFrom(arrow1Point);
            //this.arrow[1].rotation = -this.tons[1].angleA;
            //
            this.arrow[2].position.copyFrom(this.painter.position);
            this.arrow[2].y += this.painter.height;
        }


        checkFinished() {
            if (this.noGridCompleted == 6) {
                this.started = false;
                // moving up the fading background's z-index
                this.black = this.add.sprite(0, 0, "black");
                this.black.alpha = 0;

                // adding the global score;
                (<HTMLInputElement>document.getElementById("scoretime")).innerHTML = "Your time: " + this.score;

                // moving up the final image 
                var test = this.image.key;
                var yPos = this.image.position.clone();
                this.image.destroy(true);
                this.image = this.game.add.image(yPos.x, yPos.y, test);
                this.image.width = 450;
                this.image.height = 253;
                var newPos = (this.game.height / 2) - (this.image.height / 2) - 100;
                this.add.tween(this.image).to({ y: 0, x: 0, width: this.game.width, height: this.game.height }, 1000, Phaser.Easing.Exponential.Out, true);
                var inputadmin_no = (<HTMLInputElement>document.getElementById("inputfield"));

                inputadmin_no.style.opacity = '0';
                (<HTMLInputElement>document.getElementById("inputfield")).style.display = "inline";
                this.add.tween(this.timer).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.Out, true);
                var tween = this.add.tween(this.black).to({ alpha: 1 }, 1000, Phaser.Easing.Exponential.Out, true);
                tween.onUpdateCallback(function () {

                    inputadmin_no.style.opacity = String(this.black.alpha);

                }, this);
                tween.onComplete.addOnce(function () {
                    inputadmin_no.style.opacity = String(this.black.alpha);
                    this.game.state.start('GameOver', true, false, this.score, this.clockTime, this.image)
                }, this);
            }
        }

        startGame() {
           
            this.gameTimer.start();
            //this.game.time.reset();
        }
        update() {
            //this.game.physics.arcade.collide(this.tiler, [this.tons[0], this.tons[1], this.painter]);
            if (this.started) {
                this.updateTimer();
            }
        }
        updateTimer() {
            var hours = Math.floor(this.gameTimer.seconds / 3600) % 24;
            var minutes = Math.floor(this.gameTimer.seconds / 60) % 60;
            var seconds = Math.floor(this.gameTimer.seconds) % 60;
            this.clockTime = Math.round(this.gameTimer.seconds * 100) / 100;
            //var hours = Math.floor(this.game.time.totalElapsedSeconds() / 3600) % 24;
            //var minutes = Math.floor(this.game.time.totalElapsedSeconds() / 60) % 60;
            //var seconds = Math.floor(this.game.time.totalElapsedSeconds()) % 60;
            //this.clockTime = Math.round(this.game.time.totalElapsedSeconds() * 100) / 100;
            var seconds1 = String(seconds);
            var minutes1 = String(minutes);
            var hours1 = String(hours);
            //If any of the digits becomes a single digit number, pad it with a zero
            if (seconds < 10) {
                seconds1 = '0' + seconds;
            }
            if (minutes < 10) {
                minutes1 = '0' + minutes;
            }
            if (hours < 10) {
                hours1 = '0' + hours;
            }
            this.score = hours1 + ":" + minutes1 + ":" + seconds1;
            this.timer.text = "TIME\n" + hours1 + ":" + minutes1 + ":" + seconds1 // timer height is 40;
        }
        paintTheLines(p1, t) {
            this.moveArrows();
            var ktemp: number = 0;
            this.graphics.clear();
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round(this.tons[0].x), Math.round(this.tons[0].y));
            this.graphics.lineTo(Math.round(this.tons[0].x), Math.round(this.wheelGroup.getChildAt(0).y + this.wheel.height / 2));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round((this.tons[0].x) + this.wheel.width), Math.round(this.wheelGroup.getChildAt(0).y + this.wheel.height / 2));
            this.graphics.lineTo(Math.round(this.painter.x), Math.round(this.painter.y));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.lineTo(Math.round(this.painter.x), Math.round(this.painter.y));
            this.graphics.lineTo(Math.round((this.tons[1].x) - this.wheel.width), Math.round(this.wheelGroup.getChildAt(1).y + this.wheel.height / 2));
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(Math.round(this.tons[1].x), Math.round(this.wheelGroup.getChildAt(1).y + this.wheel.height / 2));
            this.graphics.lineTo(Math.round(this.tons[1].x), Math.round(this.tons[1].y));
            if (t == 0) {
                ktemp = 1;
            }
            if (t == 1) {
                ktemp = 0;
            }
            for (var i = 0; i < this.tons[ktemp].ton.length; i++) {

                this.tons[ktemp].ton[i].x = this.tons[ktemp].x;
                //this.tons[ktemp].ton[i].inputEnabled = false;
                if (i == 0) {
                    this.tons[ktemp].ton[i].y = this.tons[ktemp].y + this.tons[ktemp].height;
                }
                else {
                    this.tons[ktemp].ton[i].y = this.tons[ktemp].y + (this.tons[ktemp].height * (i + 1));
                }

            }
            for (i = 0; i < p1.ton.length; i++) {

                p1.ton[i].x = p1.x;
                p1.ton[i].inputEnabled = false;
                if (i == 0) {
                    p1.ton[i].y = p1.y + p1.height;
                }
                else {
                    p1.ton[i].y = p1.y + (p1.height * (i + 1));
                }

            }
            if (p1.ton.length != 0) {
                p1.ton[p1.ton.length - 1].inputEnabled = true;
                p1.ton[p1.ton.length - 1].events.onDragStop.add(this.removeWeight, this);
                p1.ton[p1.ton.length - 1].nT = t;
            }
        }
        // Red button fucntion
        addWeight() {
            var mass = prompt("Please enter the weight/mass:", "0");

            if (Number(mass) > 0 || Number(mass) < 0) { // Never canceled
                var l = this.tons2.length;
                if (l < 5 && l >= 0) {

                    this.tons2[l] = new Tons(this.game, this.button.x - this.button.width - 10, this.game.world.height - this.tileHeight - this.tons[0].height, Number(mass), this.gravity, "add");
                    this.game.physics.arcade.enable(this.tons2[l]);
                    this.tons2[l].body.allowGravity = false;
                    this.tons2[l].inputEnabled = true;
                    this.tons2[l].visible = true;
                    this.tons2[l].input.enableDrag();
                    this.tons2[l].events.onDragStop.add(this.stopDrag, this);
                    this.tons2[l]._dx = this.tons2[0].position.clone()
                    this.tons2[l].anchor.setTo(0.5, 0);
                    if (l != 0) {
                        this.tons2[l].x = this.tons2[l - 1].x - this.tons2[l - 1].width;
                        this.tons2[l - 1].inputEnabled = false;
                        this.tons2[l - 1].events.onDragStop.remove(this.stopDrag, this);
                        this.tons2[l - 1].input.disableDrag();
                    }
                }
            }

        }
        testClick(p1) {
            this.painter.x = p1.x + p1.width / 2;
            this.painter.y = p1.y + p1.height / 2 - this.painter.height / 2;
            this.tons[1].angleA = Phaser.Math.angleBetween(this.painter.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, this.painter.y)
            this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, this.painter.x, this.painter.y)

            this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100;
            this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100;

            this.tons[1].convertAngle();
            this.tons[0].convertAngle();
            var temp2 = (Math.cos(this.tons[0].angleA) / Math.cos(this.tons[1].angleA)) // Tons1 = Cos(Ton0.angle) / Cos(Ton1.Angle)
            var temp = (temp2 * (Math.sin(this.tons[1].angleA)) + Math.sin(this.tons[0].angleA))
            this.tons[0].force = Math.round((this.painter.force / temp) * 10) / 10
            this.tons[1].force = Math.round((this.tons[0].force * temp2) * 10) / 10
            this.tons[0].mass = Math.round((this.tons[0].force / this.gravity) * 10) / 10
            this.tons[1].mass = Math.round((this.tons[1].force / this.gravity) * 10) / 10
            this.sumFx = this.tons[1].calcFx() - this.tons[0].calcFx(); // formula to find Sum of X components
            this.sumFy = (this.tons[1].calcFy() + this.tons[0].calcFy()) - this.painter.force  // formula to find Sum of Y components
            
            this.sumR = (this.sumFx * 2) + (this.sumFy * 2);
            if (this.sumR < 0) {
                this.sumR = this.sumR * -1
            }
            this.sumR = Math.sqrt(this.sumR);
            this.sumR = Math.round(this.sumR * 10) / 10;
            this.paintTheLines(this.tons[0], 0);
            this.calcAll();
        }

        // Yellow button function
        tips() {
            var s = [];
            s[0] = "Did you know that you can input negative values to the Tons?";
            s[1] = "If you are stuck, press the green button to reset the pulleys!";
            s[2] = "Hover over to the grey board for the respective angles on each grid!";
            s[3] = "Remember your old friend, TOA CAH SOH?"
            s[4] = "The pulley system is in equilibrium, so every time you add a weight at either side, it will move to the new equilibrium position!";
            s[5] = "Static equilibrium means the sum of the net forces must equal to 0, ring any bell?"
            var no = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
            alert(s[no]);

        }
        // Green button function
        reset() {

            this.painter.x = this.world.centerX;
            this.painter.y = 509.1707368654838

            this.tons[0].y = this.tons[0]._dx.y
            this.tons[1].y = this.tons[1]._dx.y
            this.tons[1].angleA = Phaser.Math.angleBetween(this.painter.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, this.painter.y)
            this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, this.painter.x, this.painter.y)
            this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100
            this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100
            this.tons[1].convertAngle();
            this.tons[0].convertAngle();
            var temp2 = Math.round((Math.cos(this.tons[0].angleA) / Math.cos(this.tons[1].angleA)) * 1000) / 1000 // Tons1 = Cos(Ton0.angle) / Cos(Ton1.Angle)
            var temp = Math.round((temp2 * (Math.sin(this.tons[1].angleA)) + Math.sin(this.tons[0].angleA)) * 1000) / 1000
            this.tons[0].force = Math.round((this.painter.force / temp) * 10) / 10
            this.tons[1].force = Math.round((this.tons[0].force * temp2) * 10) / 10
            this.tons[0].mass = Math.round((this.tons[0].force / this.gravity) * 10) / 10
            this.tons[1].mass = Math.round((this.tons[1].force / this.gravity) * 10) / 10
            this.calcAll()
            this.graphics.clear();
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(this.tons[0].x, this.tons[0].y);
            this.graphics.lineTo(this.tons[0].x, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);
            this.graphics.lineTo(this.painter.x, this.painter.y);
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(this.painter.x, this.painter.y);
            this.graphics.lineTo((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            this.graphics.lineStyle(1, 0x111111);
            this.graphics.moveTo(this.tons[1].x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            this.graphics.lineTo(this.tons[1].x, this.tons[1].y);
            this.tons[0].clearTon();
            this.tons[1].clearTon();
            this.resetArrows()
        }
        removeWeight(p1) {
            var i = 0;
            if (p1.nT == 0) {
                i = 1;
            }
            if (p1.nT == 1) {
                i = 0;
            }
            if (this.game.physics.arcade.overlap(p1, this.tons[i])) {
                p1.position.x = this.tons[i].x;
                p1.position.y = this.tons[i].y + this.tons[i].height;
                this.tons[p1.nT].mass -= p1.mass;
                this.tons[p1.nT].calcForce();
                this.tons[p1.nT].ton.pop();
                if (this.tons[p1.nT].ton.length != 0) {
                    this.tons[p1.nT].ton[this.tons[p1.nT].ton.length - 1].inputEnabled = true;
                    this.tons[p1.nT].ton[this.tons[p1.nT].ton.length - 1].events.onDragStop.add(this.removeWeight, this);
                }
                //this.tons[i].dmass = this.tons[i].mass
                this.tons[i].mass += p1.mass;
                this.tons[i].ton.push(p1);

                p1.events.onDragStop.remove(this.stopDrag, this);
                //p1.destroy();
                this.movePainter(i, true, p1);
                //the pop() method removes the last element of an array
                return
            }
            if (!this.game.physics.arcade.overlap(p1, this.tons[p1.nT])) {
                if (this.tons[p1.nT].ton.length != 0) {
                    this.tons[p1.nT].ton[this.tons[p1.nT].ton.length - 1].inputEnabled = true;
                    this.tons[p1.nT].ton[this.tons[p1.nT].ton.length - 1].events.onDragStop.add(this.removeWeight, this);
                }
                //this.tons[p1.nT].dmass = this.tons[p1.nT].mass
                this.tons[p1.nT].mass -= p1.mass;
                this.tons[p1.nT].calcForce();
                this.movePainter(p1.nT, false, p1);
                this.tons[p1.nT].ton.pop();
                p1.destroy();
                return;
            }
        }
        stopDrag(p1) {
            for (var i = 0; i < 2; i++) {
                if (!this.game.physics.arcade.overlap(p1, this.tons[i])) {
                    p1.position.copyFrom(p1._dx);
                }
                if (this.game.physics.arcade.overlap(p1, this.tons[i])) {
                    p1.position.x = this.tons[i].x;
                    p1.position.y = this.tons[i].y + this.tons[i].height;
                    this.tons[i].mass += p1.mass;

                    p1.percent = ((p1.mass + this.tons[i].dmass) - this.tons[i].dmass) / this.tons[i].dmass;
                    this.tons[i].ton.push(p1);

                    p1.events.onDragStop.remove(this.stopDrag, this);
                    //p1.destroy();
                    this.movePainter(i, true, p1);

                    this.tons2.pop(); //the pop() method removes the last element of an array
                    if (this.tons2.length != 0) {
                        this.tons2[this.tons2.length - 1].inputEnabled = true;
                        this.tons2[this.tons2.length - 1].input.enableDrag();
                        this.tons2[this.tons2.length - 1].events.onDragStop.add(this.stopDrag, this);
                    }
                    break;
                }
            }
        }

        movePainter(t, dir, p1) {

            var point1 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var point2 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);

            var equationA1 = (this.tons[0].calcForce() * 2)
            var equationA2a = this.tons[1].calcPow() - this.tons[0].calcPow();
            var equationA2b = this.painter.force - (equationA2a / this.painter.force)
            var equationA3 = Math.asin(equationA2b / equationA1);

            this.tons[0].angleA = Math.round(equationA3 * 100) / 100; // angle A from the new equib position
            var equationB1 = (this.tons[0].calcForce() / this.tons[1].calcForce()) * Math.cos(this.tons[0].angleA);

            this.tons[1].angleA = Math.round(Math.acos(equationB1) * 100) / 100; // angle B from the new equib position

            this.tons[0].convertAngle();
            this.tons[1].convertAngle();
            if (isNaN(this.tons[0].angleA) && isNaN(this.tons[1].angleA)) {
                if (this.tons[0].mass > this.tons[1].mass) {
                    this.tons[0].angleA = 1.06;
                    this.tons[1].angleA = 0;
                }
                if (this.tons[1].mass > this.tons[0].mass) {
                    this.tons[1].angleA = 1.06;
                    this.tons[0].angleA = 0;
                }
                this.dropped = true;
            }
            if (isNaN(this.tons[0].angleA) || this.tons[0].angleA < 0) {
                this.tons[0].angleA = 0;
            }
            if (isNaN(this.tons[1].angleA) || this.tons[1].angleA < 0) {
                this.tons[1].angleA = 0;
            }
            //this.tons[0].angleinDeg = Math.round(Phaser.Math.radToDeg(this.tons[0].angleA) * 100) / 100;
            //this.tons[1].angleinDeg = Math.round(Phaser.Math.radToDeg(this.tons[1].angleA) * 100) / 100;
            this.sumFx = this.tons[1].calcFx() - this.tons[0].calcFx(); // formula to find Sum of X components
            this.sumFy = (this.tons[1].calcFy() + this.tons[0].calcFy()) - this.painter.force  // formula to find Sum of Y components
            
            var velo = this.calcAll();
            var ton0Y = this.tons[0].body.y;
            var ton1Y = this.tons[1].body.y;


            this.tons[0].dlengtha = Phaser.Math.distance(point2.x, point2.y, this.painter.x, this.painter.y)
            this.tons[0].dlengthb = Phaser.Math.distance(point2.x, point2.y, velo.x, velo.y)
            this.tons[0].dlength = this.tons[0].dlengtha - this.tons[0].dlengthb;

            this.tons[0].dlength = this.tons[0].dlength / 2;
            this.tons[1].dlengtha = Phaser.Math.distance(point1.x, point1.y, this.painter.x, this.painter.y)
            this.tons[1].dlengthb = Phaser.Math.distance(point1.x, point1.y, velo.x, velo.y)
            this.tons[1].dlength = this.tons[1].dlengtha - this.tons[1].dlengthb;

            this.tons[1].dlength = this.tons[1].dlength / 2;

            ton0Y = ton0Y + this.tons[0].dlength
            ton1Y = ton1Y + this.tons[1].dlength
            this.tons[1].tween = this.add.tween(this.tons[1]).to({ y: ton1Y }, 2000, Phaser.Easing.Exponential.Out, true);
            this.tons[0].tween = this.add.tween(this.tons[0]).to({ y: ton0Y }, 2000, Phaser.Easing.Exponential.Out, true);
            this.add.tween(this.arrow[1]).to({ rotation: -this.tons[1].angleA }, 2000, Phaser.Easing.Exponential.Out, true);
            this.add.tween(this.arrow[0]).to({ rotation: this.tons[0].angleA }, 2000, Phaser.Easing.Exponential.Out, true);
            this.painter.tween = this.add.tween(this.painter).to({ x: velo.x, y: velo.y }, 2000, Phaser.Easing.Exponential.Out, true);

            this.painter.tween.onUpdateCallback(function () {
                this.paintTheLines(this.tons[t], t);
                this.calcAll()

            }, this);
            this.painter.tween.onComplete.add(function () {
                this.paintTheLines(this.tons[t], t);
                this.calcAll();
            }, this);
        }
        calcAll() {
            var point1 = new Phaser.Point((this.tons[1].x) - this.wheel.width, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2);
            var point0 = new Phaser.Point((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2);

            var adj = point1.x - point0.x;

            var thirdAngle = Math.PI - this.tons[0].angleA - this.tons[1].angleA;
            var hypa = (adj * Math.sin(this.tons[1].angleA)) / Math.sin(thirdAngle);
            hypa = Math.round(hypa * 100) / 100;
            var hypb = (adj * Math.sin(this.tons[0].angleA)) / Math.sin(thirdAngle);
            hypb = Math.round(hypb * 100) / 100;

            var opp = hypa * Math.sin(this.tons[1].angleA);
            opp = Math.round(opp * 100) / 100;
            var returnX = hypa * Math.cos(this.tons[0].angleA);
            returnX = Math.round(returnX * 100) / 100;
            var t1 = hypa * hypa;
            var t2 = returnX * returnX
            var t3 = t1 - t2
            var t4 = Math.sqrt(t3);
            returnX += point0.x;

            var returnY = t4 + point0.y;
            if (returnY > 512) {
                returnY = 512;
            }
            var distancePoint = new Phaser.Point(returnX, returnY)
            return distancePoint;
        }
    }

}

/* For debugging purposes 

        testClick(p1) {
            this.painter.x = p1.x + p1.width / 2;
            this.painter.y = p1.y + p1.height / 2 - this.painter.height / 2;
            this.tons[1].angleA = Phaser.Math.angleBetween(this.painter.x, this.wheelGroup.getChildAt(1).y + this.wheel.height / 2, (this.tons[1].x) - this.wheel.width, this.painter.y)
            this.tons[0].angleA = Phaser.Math.angleBetween((this.tons[0].x) + this.wheel.width, this.wheelGroup.getChildAt(0).y + this.wheel.height / 2, this.painter.x, this.painter.y)
            
            this.tons[1].angleA = Math.round(this.tons[1].angleA * 100) / 100;
            this.tons[0].angleA = Math.round(this.tons[0].angleA * 100) / 100;
            
            this.tons[1].convertAngle();
            this.tons[0].convertAngle();
            var temp2 = (Math.cos(this.tons[0].angleA) / Math.cos(this.tons[1].angleA)) // Tons1 = Cos(Ton0.angle) / Cos(Ton1.Angle)
            var temp = (temp2 * (Math.sin(this.tons[1].angleA)) + Math.sin(this.tons[0].angleA))
            this.tons[0].force = Math.round((this.painter.force / temp) * 10) / 10
            this.tons[1].force = Math.round((this.tons[0].force * temp2) * 10) / 10
            this.tons[0].mass = Math.round((this.tons[0].force / this.gravity) * 10) / 10
            this.tons[1].mass = Math.round((this.tons[1].force / this.gravity) * 10) / 10
            this.sumFx = this.tons[1].calcFx() - this.tons[0].calcFx(); // formula to find Sum of X components
            this.sumFy = (this.tons[1].calcFy() + this.tons[0].calcFy()) - this.painter.force  // formula to find Sum of Y components
            
            this.sumR = (this.sumFx * 2) + (this.sumFy * 2);
            if (this.sumR < 0) {
                this.sumR = this.sumR * -1
            }
            this.sumR = Math.sqrt(this.sumR);
            this.sumR = Math.round(this.sumR * 10) / 10;
            this.paintTheLines(this.tons[0], 0);
            this.calcAll();
        }
*/
