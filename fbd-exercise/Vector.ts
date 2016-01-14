﻿module fbd {

    export class Vector extends Phaser.Sprite {
        bmd: Phaser.BitmapData;
        bmdSprite: Phaser.Sprite;
        startingPoint: Phaser.Point;
        clickRegion: Phaser.Rectangle;
        arrow: Phaser.Sprite;
        target: boolean;
        inside: boolean;
        constructor(game: Phaser.Game, x, y, regionX, regionY) {


            this.bmd = game.add.bitmapData(game.width, game.height);
            this.bmdSprite = game.add.sprite(0, 0, this.bmd);
            super(game, x, y, "arrow-head");
            game.add.existing(this);
            
            this.bmd.ctx.strokeStyle = "black";
            this.startingPoint = new Phaser.Point(x, y);

            // click region initialize
            this.clickRegion = new Phaser.Rectangle(regionX, regionY, 200, 200);
            this.clickRegion.centerOn(regionX, regionY);
            this.startingPoint = new Phaser.Point(regionX, regionY);

            // arrow head initialize
            this.anchor.setTo(0, 0.5)
            this.inputEnabled = true;
            this.events.onInputDown.add(function () {
                this.drag();
                this.target = true;
            }, this);
            //this.arrow = game.add.sprite(this.game.input.x, this.game.input.y, "arrow-head");
            //this.arrow.anchor.setTo(0, 0.5);
            //this.arrow.inputEnabled = true;
            //this.arrow.input.enableDrag();
            //this.arrow.events.onDragUpdate.add(this.drag, this);
            this.target = true;
            this.inside = this.clickRegion.contains(this.x, this.y)
        }

        update() {
            if (this.game.input.mousePointer.isDown && this.target) {

                this.drag();
            }
            if (!this.game.input.mousePointer.isDown) {
                this.target = false;
            }
        }
        getAngle(x1, y1, x2, y2) {
            return Phaser.Math.angleBetween(x1, y1, x2, y2)
        }

        drag() {

            this.inside = this.clickRegion.contains(this.x, this.y)  
            //if user click on the region god damn it
            if (!this.inside) {
                this.inside = this.clickRegion.contains(this.game.input.x, this.game.input.y)  
            }
            console.log(this.inside);
            if (this.inside) {
                this.x = this.game.input.x;
                this.y = this.game.input.y;
                this.position.setTo(this.rounder(this.x), this.rounder(this.y))
                this.bmd.clear();
                this.bmd.ctx.beginPath();
                this.bmd.ctx.beginPath();
                this.bmd.ctx.moveTo(this.startingPoint.x, this.startingPoint.y);
                this.bmd.ctx.lineTo(this.rounder(this.x), this.rounder(this.y));
                this.bmd.ctx.lineWidth = 2;
                this.bmd.ctx.stroke();
                this.bmd.ctx.closePath();
                this.bmd.render();
                this.rotation = this.getAngle(this.startingPoint.x, this.startingPoint.y, this.rounder(this.x), this.rounder(this.y))
                //console.log(this.getAngle(this.startingPoint.x, this.startingPoint.y, this.rounder(pointer.x), this.rounder(pointer.y)));
                //console.log(this.rounder(this.x), this.rounder(this.y));
            }
        }

        rounder(x) {
            return Math.ceil(x / 5) * 5;
        }
    }
}