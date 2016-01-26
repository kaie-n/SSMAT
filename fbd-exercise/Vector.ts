module fbd {

    export class Vector extends Phaser.Sprite {
        bmd: Phaser.BitmapData;
        bmdSprite: Phaser.Sprite;
        arrow: Phaser.Sprite;
        startingPoint: Phaser.Point;
        clickRegion: Phaser.Rectangle;
        group: Phaser.Group;
        groupStick: Phaser.BitmapData
        relative: Phaser.Point;
        unknown: Phaser.Text;
        angleRelative: Phaser.Text;
        target: boolean;
        inside: boolean;
        clone: boolean;
        constructor(game: Phaser.Game, x, y, regionX, regionY) {
            this.bmd = game.make.bitmapData(game.width, game.height);
            this.bmdSprite = game.make.sprite(0, 0, this.bmd);
            this.bmdSprite.addChild(this);
            super(game, x, y, "arrow-head");
            game.add.existing(this);
            //game.add.sprite(x, y, "arrow-head");

            //this.addChild(game.make.sprite(0, 0, this.bmd));
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
                    this.drag();
                }

            }, this);
            this.events.onInputUp.add(function () {

            }, this);
            this.target = true;
            this.inside = this.clickRegion.contains(this.x, this.y)
            this.groupStick = game.add.bitmapData(game.width, game.height);
            this.groupStick.addToWorld();
            this.clone = false;


            // create Text angle 
            this.angleRelative = game.make.text(0, 0, "", global_style);
            this.unknown = game.make.text(0, 0, "?", global_style);
            this.addChild(this.unknown);
            this.unknown.visible = false;
            this.unknown.scale.setTo(1.5, 1.5);
            //this.addChild(this.angleRelative);

            this.group = game.add.group();
            this.group.add(this.bmdSprite);
            this.group.add(this);
            this.group.add(this.angleRelative);
            this.relative = new Phaser.Point(0, 0);

        }
        cloneBmd() {
            
            this.groupStick.draw(this.bmdSprite);
            this.groupStick.draw(this);
        }
        drawCurve() {
            var graphics = this.game.make.graphics(this.startingPoint.x, this.startingPoint.y);
            this.group.add(graphics);
            //  Our first arc will be a line only
            graphics.lineStyle(1, 0x000000);

            // graphics.arc(0, 0, 135, game.math.degToRad(0), game.math.degToRad(90), false);
            // this is from 0 to -90;
            if (this.angle <= 0 && this.angle >= -90) {
                graphics.arc(0, 0, 20, 0, this.rotation, true);
                return;
            }
            if (this.angle >= -180 && this.angle < -90) {
                graphics.arc(0, 0, 20, this.rotation, -3.14, true);
                return;
            }
            if (this.angle >= 0 && this.angle <= 90) {
                graphics.arc(0, 0, 20, 0, this.rotation, false);
                return;
            }
            if (this.angle < 180 && this.angle > 90) {
                graphics.arc(0, 0, 20, this.rotation, -3.14, false);
                return;
            }
        }

        getRelativeAngle() {
            this.unknown.visible = true;
            this.unknown.angle -= this.angle;
            this.unknown.x += this.width;
            if (this.angle == 0 || this.angle == -180) {
                this.angleRelative.text = "";
            }
            // right top side
            if ((this.angle < 0 && this.angle >= -90)) {
                this.angleRelative.text = String(Math.abs(this.angle));
                this.angleRelative.anchor.setTo(-2, 0.75);
            }
            // left top side
            if ((this.angle > -180 && this.angle < -90)) {
                var temp: number = 180 - Math.abs(this.angle);
                temp = this.rounder(temp);
                this.angleRelative.text = String(temp);
                this.angleRelative.anchor.setTo(3, 0.75);
            }
            // positive range
            // bottom right
            if (this.angle > 0 && this.angle <= 90) {
                this.angleRelative.text = String(Math.abs(this.angle));
                this.angleRelative.anchor.setTo(-3, -0.75);
            }
            // bottom left
            if (this.angle < 180 && this.angle > 90) {
                var temp: number = 180 - Math.abs(this.angle);
                temp = this.rounder(temp);
                this.angleRelative.text = String(temp);
                this.angleRelative.anchor.setTo(3, -0.75);
            }
            var angle = (<NodeListOf<HTMLInputElement>>document.getElementsByClassName("angle"));
            for (var i = 0; i < angle.length; i++) {
                angle[i].innerHTML = this.angleRelative.text;
            }
            this.angleRelative.position.setTo(this.startingPoint.x, this.startingPoint.y);
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

        }
        getAngle(x1, y1, x2, y2) {
            var rad = Phaser.Math.angleBetween(x1, y1, x2, y2);
            var deg = Phaser.Math.radToDeg(rad);
            var round = this.rounder(deg);
            return round;
            //return Phaser.Math.angleBetween(x1, y1, x2, y2)
        }

        drag() {

            this.inside = this.clickRegion.contains(this.x, this.y)


            if (this.x > 0) {
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
                   
                }
                //console.log("RELATIVE LENGTHS", this.rounder(this.x) - this.startingPoint.x, this.rounder(this.y) - this.startingPoint.y);
                this.relative.setTo(this.rounder(this.x) - this.startingPoint.x, this.rounder(this.y) - this.startingPoint.y);
            }
        }

        rounder(x, pow = 5) {
            return Math.ceil(x / pow) * pow;
        }

    }
}