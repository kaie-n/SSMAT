module fbd {

    export class Vector extends Phaser.Sprite {
        bmd: Phaser.BitmapData;
        bmdSprite: Phaser.Sprite;
        arrow: Phaser.Sprite;
        components: Phaser.Sprite;
        componentLabels: Array<LabelSub>;
        startingPoint: Phaser.Point;
        clickRegion: Phaser.Rectangle;
        group: Phaser.Group;
        groupStick: Phaser.BitmapData
        relative: Phaser.Point;
        unknown: Phaser.Text;
        angleRelative: Phaser.Text;
        label: Phaser.Text;
        labelSub: Phaser.Text;
        labelGrouped: string;
        findPart3: number;
        target: boolean;
        inside: boolean;
        clone: boolean;
        id: number;
        inputBox: number;
        constructor(game: Phaser.Game, x, y, regionX, regionY, id) {
            // initialize the vectors and respective booleans yeah
            this.target = true;
            this.clone = false;
            this.id = id;
            this.bmd = game.make.bitmapData(game.width, game.height);
            this.bmdSprite = game.make.sprite(0, 0, this.bmd);
            this.bmdSprite.addChild(this);
            super(game, x, y, "arrow-head");
            game.add.existing(this);

            this.bmd.ctx.strokeStyle = "black";
            this.startingPoint = new Phaser.Point(x, y);

            // click region initialize
            this.clickRegion = new Phaser.Rectangle(regionX, regionY, 100, 100);
            this.clickRegion.centerOn(regionX, regionY);
            this.startingPoint = new Phaser.Point(regionX, regionY);

            // arrow head initialize
            this.anchor.setTo(0.5, 0.5)
            this.inputEnabled = true;
            this.events.onInputDown.add(function () {
                this.target = true;
                if (_p == 0) {
                    //setting to current click
                   
                    this.drag();
                }
            }, this);
            this.events.onInputUp.add(function () {
            }, this);

            this.inside = this.clickRegion.contains(this.x, this.y)
            this.groupStick = game.add.bitmapData(game.width, game.height);
            this.groupStick.addToWorld();


            // create force labels
            this.label = game.make.text(0, 0, "", global_style);
            this.label.text = "";
            this.label.inputEnabled = true;
            this.label.events.onInputDown.add(function () {
                if (_p == 0) {
                    document.getElementById(inputBox.input[this.id].name).style.display = "";
                    inputBox.input[this.id].dragged = false;
                    //setting to current click
                    inputBox.name = this.id;
                    this.inputBox = this.id;
                    inputBox.id = this.id;
                }
            }, this);

            // create force labels
            this.labelSub = game.make.text(0, 0, "", global_style);
            this.labelSub.text = "";
            this.labelSub.inputEnabled = true;
            this.labelSub.events.onInputDown.add(function () {
                if (_p == 0) {
                    (<HTMLInputElement>document.getElementById(inputBox.input[this.id].name)).style.display = "";
                    (<HTMLInputElement>document.getElementById(inputBox.input[this.id].name)).focus();
                    inputBox.input[this.id].dragged = false;
                    //setting to current click
                    inputBox.name = this.id;
                    this.inputBox = this.id;
                    inputBox.id = this.id;
                }
            }, this);

            // create Text angle 
            this.angleRelative = game.make.text(0, 0, "", global_style);

            // initialize components and its labels
            this.componentLabels = [];
            
            // Group them up baby
            this.group = game.add.group();
            this.group.add(this.bmdSprite);
            this.group.add(this);
            this.group.add(this.angleRelative);
            this.group.add(this.label);
            this.group.add(this.labelSub);
            this.relative = new Phaser.Point(0, 0);
        }
        // cloning the vector arrows
        cloneBmd() {
            this.groupStick.draw(this.bmdSprite);
            this.groupStick.draw(this);
        }
        drawCurve() {
            var graphics = this.game.make.graphics(this.startingPoint.x, this.startingPoint.y);
            this.group.add(graphics);
            //  Our first arc will be a line only
            graphics.lineStyle(1, 0x000000);

            // this is from 0 to -90;
            if (this.angle <= 0 && this.angle >= -90) {
                graphics.arc(0, 0, 10, 0, this.rotation, true);
                return;
            }
            if (this.angle >= -180 && this.angle < -90) {
                graphics.arc(0, 0, 10, this.rotation, -3.14, true);
                return;
            }
            if (this.angle >= 0 && this.angle <= 90) {
                graphics.arc(0, 0, 10, 0, this.rotation, false);
                return;
            }
            if (this.angle < 180 && this.angle > 90) {
                graphics.arc(0, 0, 10, this.rotation, -3.14, false);
                return;
            }
        }
        makeComponents(colour) {
            var bmd = this.game.make.bitmapData(this.game.width, this.game.height);
            bmd.ctx.beginPath();
            bmd.ctx.lineWidth = 1;
            bmd.ctx.strokeStyle = colour;
            bmd.ctx.setLineDash([5, 3]);
            bmd.ctx.moveTo(this.startingPoint.x, this.startingPoint.y);
            bmd.ctx.lineTo(this.x, this.startingPoint.y);
            bmd.ctx.lineTo(this.x, this.y);
            bmd.ctx.stroke();
            bmd.ctx.closePath();
            this.components = this.game.add.sprite(0, 0, bmd);
            this.group.add(this.components);
            // labeling
            this.componentLabels[0] = new LabelSub(this.label.text, "Y", this.game, "sin");
            this.componentLabels[1] = new LabelSub(this.label.text, "X", this.game, "cos");

            // if left side
            if ((this.angle < 180 && this.angle > 90) || (this.angle > -180 && this.angle < -90)) {
                this.componentLabels[0].updatePosition(this.label.world.x, this.label.world.y + (Math.abs(this.relative.y) / 2) + this.componentLabels[0].halfHeight);
                this.componentLabels[1].updatePosition(this.label.world.x + (Math.abs(this.relative.x) / 2) + this.componentLabels[1].halfWidth, this.componentLabels[1].totalHeight + this.label.world.y + Math.abs(this.relative.y));

            }
            else {
                this.componentLabels[0].updatePosition(this.label.world.x, this.label.world.y + (Math.abs(this.relative.y) / 2) + this.componentLabels[0].halfHeight);
                this.componentLabels[1].updatePosition(this.label.world.x - (Math.abs(this.relative.x) / 2) - this.componentLabels[1].halfWidth, this.componentLabels[1].totalHeight + this.label.world.y + Math.abs(this.relative.y));
            }
            var rnd = this.game.rnd.integerInRange(0, 1);
            this.componentLabels[rnd].unknown.visible = true;
            this.setHTMLtexts("x-or-y", this.componentLabels[rnd].sub.text);
            inputBox.answer = this.componentLabels[rnd].answer;
        }
        getRelativeAngle() {
            var offsetX = 0;
            var offsetY = 0;
            this.angleRelative.scale.setTo(0.6, 0.6);
            this.makeComponents("red");
            if (this.angle == 0 || this.angle == -180) {
                this.angleRelative.text = "";
            }
            // right top side
            if ((this.angle < 0 && this.angle >= -90)) {
                this.angleRelative.text = String(Math.abs(this.angle));
                //this.angleRelative.anchor.setTo(-2, 0.75);
                offsetX = 12;
                offsetY = -(this.angleRelative.height) + 4;

            }
            // left top side
            if ((this.angle > -180 && this.angle < -90)) {
                var temp: number = 180 - Math.abs(this.angle);
                temp = this.rounder(temp);
                this.angleRelative.text = String(temp);
                //this.angleRelative.anchor.setTo(3, 0.75);
                offsetX = -12 - this.angleRelative.width;
                offsetY = -(this.angleRelative.height) + 4;

            }
            // positive range
            // bottom right
            if (this.angle > 0 && this.angle <= 90) {
                this.angleRelative.text = String(Math.abs(this.angle));
                //this.angleRelative.anchor.setTo(-3, -0.75);
                offsetX = 12;
                offsetY = 0;

            }
            // bottom left
            if (this.angle < 180 && this.angle > 90) {
                var temp: number = 180 - Math.abs(this.angle);
                temp = this.rounder(temp);
                this.angleRelative.text = String(temp);
                offsetX = -12 - this.angleRelative.width;
                offsetY = 0;
                //this.angleRelative.anchor.setTo(3, -0.75);

            }
 
            this.setHTMLtexts("angle", this.angleRelative.text);
            this.setHTMLtexts("force-label", this.label.text);
            this.setHTMLtexts("force-label-sub", this.labelSub.text);

            var array = [];
            // text for the answers
            var answer = (<NodeListOf<HTMLInputElement>>document.getElementsByClassName("answer"));
            // radio button as well
            var answerInput = (<NodeListOf<HTMLInputElement>>document.getElementsByName("answer"));
            for (var i = 0; i < answer.length; i++) {
                // assigning the previous answer to an array
                array[i] = answer[i].innerText;
            }
            // shuffle the array accordingly
            shuffle(array);
            // set back the text yo
            this.setHTMLtexts("answer", array);
            for (var i = 0; i < answer.length; i++) {
                answerInput[i].value = answer[i].innerText;
            }
            // set position for the angle number text
            this.angleRelative.position.setTo(this.startingPoint.x + offsetX, this.startingPoint.y + offsetY);
        }
        // set html text dynamically lah, easier mah rather than setting it one by one :(
        setHTMLtexts(c, t) {
            var temp = (<NodeListOf<HTMLInputElement>>document.getElementsByClassName(c));
            for (var i = 0; i < temp.length; i++) {
                if (t.constructor !== Array) {
                    temp[i].innerText = t;
                    if (i == 0) {
                        var selectedAnswer = (<NodeListOf<HTMLInputElement>>document.getElementsByName("answer"));
                        selectedAnswer[i].checked = true;
                    }

                } else {
                    temp[i].innerText = t[i];
                }
            }
            
        }
        // check if inputs are at the left side so can push it to the left
        checkLeft() {
            if ((this.angle < 180 && this.angle > 90) || (this.angle > -180 && this.angle < -90)) {
                vectorOffset = 110;
            }
            else {
                vectorOffset = -10;
            }
        }

        checkInputForce() {
            if (this.id == inputBox.id) {
                this.labelGrouped = String(inputBox.input[inputBox.id].inputValues[2]);
                this.label.text = String(inputBox.input[inputBox.id].inputValues[0]);
                if (String(inputBox.input[inputBox.id].inputValues[0]) != "" && String(inputBox.input[inputBox.id].inputValues[0]) != undefined) {
                    this.labelSub.text = String(inputBox.input[inputBox.id].inputValues[1]);
                }
                if ((this.angle > -180 && this.angle < 0)) {
                    this.label.y = this.y - this.label.height;
                    this.labelSub.y = this.label.y + 5;
                }
                if ((this.angle < 180 && this.angle > 0)) {
                    this.label.y = this.y + this.label.height / 2;
                    this.labelSub.y = this.label.y + 5;
                }
            }
            // if left side
            if ((this.angle < 180 && this.angle > 90) || (this.angle > -180 && this.angle < -90)) {
                this.label.x = this.x - this.label.width - 10 - this.labelSub.width;
                this.labelSub.x = this.label.x + this.labelSub.width;
            }
            else {
                this.label.x = this.x + 10;
                this.labelSub.x = this.label.x + this.labelSub.width - 2;
            }
            if ((this.angle < 180 && this.angle > 0)) {
                this.label.x = this.x - this.label.width / 2;
                this.labelSub.x = this.label.x + 5;
            }
        }

        update() {
            if (_p == 1 && !this.clone) {
                this.clone = true;
                this.cloneBmd()
            }
            if (this.game.input.mousePointer.isDown && this.target && _p == 0) {
                this.drag();
            }
            if (!this.game.input.mousePointer.isDown) {
                this.target = false;
            }
            if (this.game.input.mousePointer.isDown && this.target && _p == 1) {
                this.group.x = this.rounder(this.game.input.x - this.startingPoint.x - this.relative.x);
                this.group.y = this.rounder(this.game.input.y - this.startingPoint.y - this.relative.y);
            }
            this.checkInputForce();
        }
        getAngle(x1, y1, x2, y2) {
            var rad = Phaser.Math.angleBetween(x1, y1, x2, y2);
            var deg = Phaser.Math.radToDeg(rad);
            var round = this.rounder(deg);
            return round;
        }

        drag() {
            this.inside = this.clickRegion.contains(this.x, this.y)
            if (this.x > 0) {
                //setting to current click
                inputBox.name = this.id;
                this.inputBox = this.id;
                inputBox.id = this.id;
                //if user click on the region god damn it
                if (!this.inside) {
                    this.inside = this.clickRegion.contains(this.game.input.x, this.game.input.y)
                }
                if (this.inside) {

                    this.x = this.rounder(this.game.input.x);
                    this.y = this.rounder(this.game.input.y);
                    if (this.y == 5 || this.y <= 0) {
                        this.y = 10;
                    }
                    this.position.setTo(this.rounder(this.x), this.rounder(this.y))
                    this.bmd.clear();
                    this.bmd.ctx.beginPath();
                    this.bmd.ctx.moveTo(this.startingPoint.x, this.startingPoint.y);
                    this.bmd.ctx.lineTo(this.rounder(this.x), this.rounder(this.y));
                    this.bmd.ctx.lineWidth = 2;
                    this.bmd.ctx.stroke();
                    this.bmd.ctx.closePath();
                    this.bmd.render();
                    this.angle = this.getAngle(this.startingPoint.x, this.startingPoint.y, this.rounder(this.x), this.rounder(this.y))
                    document.getElementById(inputBox.input[inputBox.id].name).style.display = "none";
                    inputBox.input[inputBox.id].dragged = false;
                }
                this.checkLeft();
                //console.log("RELATIVE LENGTHS", this.rounder(this.x) - this.startingPoint.x, this.rounder(this.y) - this.startingPoint.y);

                this.relative.setTo(this.rounder(this.x) - this.startingPoint.x, this.rounder(this.y) - this.startingPoint.y);
            }
        }

        rounder(x, pow = 5) {
            return Math.ceil(x / pow) * pow;
        }

    }
}