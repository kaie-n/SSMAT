module fbd {

    export class Finish extends Phaser.State {

        create() {

            divDetails.innerHTML = "You have completed this exercise!"
            this.clear();
           
        }
        clear() {
            mcq.style.display = "none";
        }
    }

}