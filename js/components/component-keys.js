

Vue.component('component-keyboard', {
    template: `<div>
                    <div class="keyboard">
                        <div class="keys" v-for="(letter, idx) in splitLetters" :key="idx">
                            <component-keyboard-key 
                                :letter="letter" 
                                :idx="idx">
                            </component-keyboard-key>
                        </div>
                    </div> 
            </div>`,
    props: [],
    computed: {
        splitLetters: function() {
            return this.$root.puzzle.levels[this.$root.puzzle.current.level].startingletters.split("");
        }
    },
    methods: {
        
    },
    data() {
        return {
           wordstatus: null
        }
    },
    created: function() {

    }
});