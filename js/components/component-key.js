Vue.component('component-keyboard-key', {
    template: `<a href="#" 
                    @click.prevent="addLetter(letter, idx)"
                    :class="{ isLetterUsed: isLetterUsed }">
                    {{ letter.letter }}
                </a>`,
    props: ['letter', 'idx'],
    computed: {

    },
    methods: {

        addLetter: function(letter, idx){

            this.isLetterUsed = !this.isLetterUsed;

            if(this.isLetterUsed){
                this.$root.currentWord.push(letter);
            } else {

                // Remove item.
                this.$root.currentWord.splice(this.$root.currentWord.findIndex(x => x.id === letter.id), 1);
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
});