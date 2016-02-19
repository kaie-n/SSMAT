module fbd {

    export class Diagram extends Phaser.Sprite {
        picture: Phaser.Sprite;
        clickRegion: Phaser.Rectangle; // region
        squareBox: fbd.SquareBox; // squarebox
        vector: Array<fbd.Vector>; // the force vectors
        circle: Phaser.Sprite; // circle sprite
        game: Phaser.Game // game reference
        limit: number; // number of force vectors limit
        co: Phaser.Point; // coordinates of circle dot
        constructor(game: Phaser.Game, x, y, key, startX, startY) {
            var bmd = game.make.bitmapData(game.width, game.height);
            inputBox = { input: [] };
            inputBox["id"] = 0;
            super(game, x, y, bmd);
            this.game = game;
        
            this.picture = game.make.sprite(0, 0, key);
            this.addChild(this.picture);
            this.picture.y += 30;
            startY += 30;
            // diagram
            // square box
            this.squareBox = new SquareBox(game, this.game.world.width, 0, 1);

            this.vector = [];

            var circle = game.add.bitmapData(10, 10);
            circle.circle(5, 5, 5, '#000000');

            this.circle = game.make.sprite(startX, startY, circle);
            this.circle.anchor.setTo(0.5, 0.5);
            this.circle.inputEnabled = true;
            this.circle.events.onInputDown.add(this.addVector, this);
            this.circle.y -= 30;
            this.picture.addChild(this.circle);
            this.addChild(this.squareBox);
            this.co = new Phaser.Point(startX, startY);
            this.game.add.existing(this);
        }
        destroyAll() {
            this.destroy();
            for (var i = 0; i < this.vector.length; i++) {
                this.vector[i].group.destroy();
                this.vector[i].destroy();
                this.vector[i].groupStick.clear();
            }
            this.vector = [];
        }

        createInputBoxes(i) {
            var id = "force" + i;

            inputBox.input.push({
                name: id,
                dragged: false,
                inputValues: ["", "", ""]
            })

            var body: HTMLElement = (<HTMLElement>document.getElementById("body"));
            body.innerHTML += "<div id='" + id + "' class='form-control box' style='display: none;' onkeyup='makeSub(event,this)' onkeypress='enterInput(event, this); return (this.innerText.length < 2)' onclick='getId(this.id)' contentEditable='true'></div>"
        }
        
        addVector() {
            if (this.vector.length < this.limit) {
                var i = this.vector.length
                if (i == 0) {
                    this.vector[i] = new fbd.Vector(this.game, this.game.input.x, this.game.input.y, this.co.x, this.co.y, i);
                    this.createInputBoxes(i);
                }
                else {
                    this.vector[i] = new fbd.Vector(this.game, this.game.input.x, this.game.input.y, this.co.x, this.co.y, i);
                    this.createInputBoxes(i);
                }
                // initialize input boxes

            }
        }
    }

}
