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

            this.isLetterUsed = !this.isLetterUsed;

            if(this.isLetterUsed){
                this.$root.puzzle.current.word.push(letter);
            } else {

                // Remove item.
                this.$root.puzzle.current.word.splice(this.$root.puzzle.current.word.findIndex(x => x.id === letter.id), 1);
            }

            if (app.media.supports.audio && app.vue.data.user.settings.soundskeyboard) {
                new Audio('mp3/tock.mp3').play();
            }

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