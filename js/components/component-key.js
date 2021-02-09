Vue.component('component-keyboard-key', {
    template: `<a href="#" 
                    @click.prevent="addLetter(letter, idx)"
                    :class="{ isLetterUsed: isLetterUsed }">
                    {{ letter }} {{ resetLetterClass }}
                </a>`,
    props: ['letter', 'idx'],
    computed: {

    },
    methods: {

        addLetter: function(letter, idx){

            var currentWord = this.$root.puzzle.current.word;

            this.isLetterUsed = !this.isLetterUsed;

            if(this.isLetterUsed){
                currentWord.push(letter);
            } else {
                
                // Remove item.
                var letterIndex = currentWord.indexOf(letter);
                currentWord.splice(letterIndex, 1);

                //this.$root.puzzle.current.word.splice(this.$root.puzzle.current.word.findIndex(x => x.id === letter.id), 1);
            }

            console.log(this.$root.puzzle.current.word);

            if (app.media.supports.audio && app.vue.data.user.settings.soundskeyboard) {
                new Audio('mp3/tock.mp3').play();
            }

            this.$emit('clicked', 'someValue');

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
        }
    },
});