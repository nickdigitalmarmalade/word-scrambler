

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

                    <div>
                        <button @click="nextLevel">Next level</button>
                    </div>

                <div class="feedback feedback--correct" v-if="wordstatus === 'new-word'">
                    Woohoo!!
                </div>
                <div class="feedback feedback--info" v-if="wordstatus === 'already-found'">
                    Word already found!
                </div>
                <div class="feedback feedback--incorrect" v-if="wordstatus === 'wrong'">
                    Incorrect word!
                </div>

            </div>`,
    props: [],
    computed: {
        splitLetters: function() {
            return this.$root.puzzle.levels[this.$root.puzzle.current.level].startingletters.split("");
        }
    },
    methods: {
        addScore: function(){
            this.$root.current.score += this.$root.getCurrentWord.length * 100;
        },
        enterWord: function(){
            if(this.$root.getCurrentWord != ''){

                if(this.isCorrectWord()){

                    if(!this.isAlreadyFound()){
                        this.addScore();
                        this.wordstatus = "new-word";
                        this.$root.puzzle.current.found.push(this.$root.getCurrentWord);

                        if (app.media.supports.audio && app.vue.data.user.settings.soundskeyboard) {
                            new Audio('mp3/success.mp3').play();
                        }

                    } else {
                        this.wordstatus = "already-found";
                    }

                    // if level completed, advance to next one.
                    if(this.$root.puzzle.current.found.sort().toString() === this.$root.puzzle.levels[this.$root.puzzle.current.level].correctwords.sort().toString()){
                        
                        var self = this;

                        setTimeout(function(){
                            self.nextLevel();
                            //self.$root.puzzle.current.found = [];
                        }, 1500);
                    }

                } else {
                    this.wordstatus = "wrong";
                }

                this.$root.puzzle.current.word = [];
                this.showFeedback();
            }
        },

        isAlreadyFound: function(){
            return this.$root.puzzle.current.found.includes(this.$root.getCurrentWord);
        },
        isCorrectWord: function(){
            return this.$root.puzzle.levels[this.$root.puzzle.current.level].correctwords.includes(this.$root.getCurrentWord)
        },
        showFeedback: function(){
            var self = this;

            setTimeout(function(){
                 self.wordstatus = null;
            }, 1500);
        },
        nextLevel: function(){

            if(this.$root.puzzle.current.level > 1){
                this.$root.puzzle.current.level = 0;
            } else {
                this.$root.puzzle.current.level++
            }
        }
    },
    data() {
        return {
           wordstatus: null
        }
    },
    created: function() {

    }
});