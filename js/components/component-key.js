Vue.component('component-keyboard-key', {
    template: `<a href="#" 
                    @click.stop.prevent="addLetter(letter, idx)"
                    :class="{ isLetterUsed: isLetterUsed }">
                    {{ letter }} {{ resetLetterClass }}
                </a>`,
    props: ['letter', 'idx'],
    computed: {

    },
    methods: {

        addLetter: function(letter, idx){

            if (app.media.supports.audio && app.vue.data.user.settings.soundskeyboard) {
                //new Audio('mp3/tock.mp3').play();
                createjs.Sound.play("tock");
            }

            var currentWord = this.$root.puzzle.current.word;

            this.isLetterUsed = !this.isLetterUsed;

            if(this.isLetterUsed){
                currentWord.push(letter);
                console.log("adding letter")
            } else {
                
                // Remove item.
                var letterIndex = currentWord.indexOf(letter);
                currentWord.splice(letterIndex, 1);
                console.log("removing letter")
            }
            //console.log(this.$root.puzzle.current.word);
        }

    },
    data() {
        return {
            isLetterUsed: false
        }
      },
    created: function() {

    },
    computed: {
        resetLetterClass() {
            if(this.$root.puzzle.current.word.length === 0){
                this.isLetterUsed = false;
            }

            // Undo letter
            if(this.$root.puzzle.current.word.includes(this.letter)){
                //console.log("the letter is in the array");
            } else {
                //console.log("the letter is NOT in the array");
                this.isLetterUsed = false;
            }
        }
    },
});