

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

                    <div class="check-word">
                        <button @click="enterWord">Enter</button>
                    </div>

                <div class="feedback feedback--correct" v-if="wordstatus === true">
                    Woohoo!!
                </div>
                <div class="feedback feedback--incorrect" v-if="wordstatus === false">
                    Fail!!
                </div>
            </div>`,
    props: [],
    computed: {
        splitLetters: function() {
            return this.$root.puzzle.levels[0].startingletters.split("");
        }
    },
    methods: {

        addScore: function(){
            this.$root.current.score += this.$root.getCurrentWord.length * 100;
        },
        enterWord: function(){
            if(this.$root.getCurrentWord != ''){

                //console.log("entered: " + this.$root.getCurrentWord);
                //console.log(this.$root.puzzle.levels[0].correctwords);

                if(this.isCorrectWord()){

                    if(!this.isAlreadyFound()){
                        this.addScore();
                        this.wordstatus = true;
                    }
                    
                    this.$root.puzzle.current.found.push(this.$root.getCurrentWord);

                } else {
                    this.wordstatus = false;
                }

                this.$root.puzzle.current.word = [];
                this.showFeedback();

            }
            // TODO: Check if word correct and not already used before.
        },

        isAlreadyFound: function(){
            return this.$root.puzzle.current.found.includes(this.$root.getCurrentWord);
        },
        isCorrectWord: function(){
            return this.$root.puzzle.levels[0].correctwords.includes(this.$root.getCurrentWord)
        },
        showFeedback: function(){
            var self = this;

            setTimeout(function(){
                 self.wordstatus = null;
            }, 1500);
        },
    },
    data() {
        return {
           wordstatus: null
        }
      },
    created: function() {
        console.log(this.$root.puzzle.levels[0].startingletters);
    },
});