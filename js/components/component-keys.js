

Vue.component('component-keyboard', {
    template: `<div class="keyboard">
                    <div class="keys" v-for="(letter, idx) in $root.startingLetters" :key="letter.id">
                    
                        <component-keyboard-key 
                            :letter="letter" 
                            :idx="idx">
                        </component-keyboard-key>

                    </div>
                </div> 
            </div>`,
    props: ['letter', 'idx'],
    computed: {
        isCorrect: function() {

        },
    },
    methods: {

    },
    data() {
        return {

        }
      },
    created: function() {
        console.log(this.$root.startingLetters);
        console.log(this.startingLetters);

    },
});