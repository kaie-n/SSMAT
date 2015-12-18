﻿module SSMAT {
    export class Tons extends Phaser.Sprite {
        mass: number;
        tween: Phaser.Tween;
        force: number;
        gravity: number;
        dy: number;
        ton: Array<SSMAT.Tons>;
        _dx: Phaser.Point;
        angleA: number;
        angleinDeg: number;
        fx: number;
        fy: number;
        text: Phaser.Text;
        textAngle: Phaser.Text;
        started: boolean;
        main: SSMAT.MainMenu
        dlength: number;
        dlengtha: number;
        dlengthb: number;
        angleRad: number;
        constructor(game: Phaser.Game, x: number, y: number, mass: number, gravity: number) {
            super(game, x, y, "ton");
            game.add.existing(this);
            this.anchor.setTo(0.5, 0);
            this.dy = y;
            this.mass = mass;
            this.gravity = gravity;
            this.calcForce();
            this.angleinDeg = Math.round(Phaser.Math.radToDeg(this.angleA) * 100) / 100;
            this.angleinDeg = Math.round(Phaser.Math.radToDeg(this.angleA) * 100) / 100;
            this.ton = [];
            this.smoothed = false;
            var style = { font: "14px Courier bold", fill: "#FFFFFF", wordWrap: false, wordWrapWidth: this.width, align: "left" };
            this.text = game.add.text(0, 0, "", style);
            this.text.smoothed = false;
            this.text.anchor.set(0, 0.5);
            this.text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 1);
            this.textAngle = game.add.text(0, 0, "", style);
            this.textAngle.setShadow(1, 1, 'rgba(0,0,0,1)', 1);
            this.textAngle.smoothed = false;
            this.textAngle.anchor.set(0, 0.5);
           
        }
        clearTon() {
            if (this.ton.length > 0) {
                for (var i = 0; i < this.ton.length; i++) {
                    this.ton[i].destroy();
                }
            }
            this.ton = [];
        }
        convertAngle() {
            this.angleinDeg = Math.round(Phaser.Math.radToDeg(this.angleA) * 100) / 100;
            this.angleA = Phaser.Math.degToRad(this.angleinDeg);
            
            return this.angleA;
        }
        update() {
            this.convertAngle();
            if (this.name == "left" || this.name == "right") {
                if (this.started) {
                    this.visible = true;
                    this.mass = Math.round(this.mass * 10) / 10
                    this.textAngle.visible = true;
                    this.text.visible = true;
                }

               
                if (this.calcForce() >= 1000) {
                    this.force = this.calcForce() / 1000;
                    this.text.text = "M: " + this.mass + "KG \nF: " + Math.round(this.force * 1000) / 1000 + "kN";
                }
                if (this.calcForce() < 1000) {
                    this.text.text = "M: " + this.mass + "KG \nF: " + Math.round(this.force * 100) / 100 + "N"
                }
                if (this.name == "left") {
                    this.textAngle.text = "α: " + String(this.angleinDeg) + "\xB0";
                    this.textAngle.x = this.main.painter.x - this.main.painter.width / 2 - this.textAngle.width;
                    this.text.x = (this.x - this.text.width) - 10;
                }
                if (this.name == "right") {
                    this.textAngle.text = "β: " + String(this.angleinDeg) + "\xB0";
                    this.textAngle.x = this.main.painter.x + this.main.painter.width / 2 ;
                    this.text.x = (this.x + this.width / 2);
                }
                this.textAngle.y = this.main.painter.y - this.textAngle.height / 2 ;
                this.text.y = (this.y + this.height / 2);
               
            }
        }
        calcPow() {
            var a = Math.pow(this.calcForce(), 2);
            return a;
        }
        calcForce() {
            this.force = Math.round((this.mass * this.gravity) * 10) / 10 ;
            return this.force;
        }
        calcFx() {
            this.fx = this.calcForce() * Math.cos(this.angleA);
            this.fx = Math.round(this.fx);
            return this.fx;
        }
        calcFy() {
            this.fy = this.calcForce() * Math.sin(this.angleA);
            this.fy = Math.round(this.fy) ;
            return this.fy;
        }

    }
}