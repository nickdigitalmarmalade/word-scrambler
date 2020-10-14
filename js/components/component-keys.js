

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

                <div class="feedback feedback--correct" v-if="wordstatus === 'new-word'">
                    Correct, well done!
                </div>
                <div class="feedback feedback--info" v-if="wordstatus === 'already-found'">
                    Word already found!
                </div>
                <div class="feedback feedback--incorrect" v-if="wordstatus === 'wrong'">
                    Incorrect, try again.
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
						
						var userCorrect = this.$root.puzzle.current.found.length;
						var totalCorrect = this.$root.puzzle.levels[this.$root.puzzle.current.level].correctwords.length;

						if(userCorrect === totalCorrect){
							
							console.log("level completed");
							
							var self = this;

							setTimeout(function(){
								self.nextLevel();
								// TODO - self.bonusTime();
							}, 1500);
						}

                } else {
                    this.wordstatus = "wrong";

                    if (app.media.supports.audio && app.vue.data.user.settings.soundskeyboard) {
                        new Audio('mp3/error.mp3').play();
                    }

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
		bonusTime: function(){

		},
        nextLevel: function(){

			//console.log(this.$root.puzzle.current.level);
			//console.log(this.$root.getLevelCount);

            if(this.$root.puzzle.current.level ==  this.$root.getLevelCount - 1){
               
			   // Show completition.
				app.vue.model.showModal('completion')
			   
            } else {
                this.$root.puzzle.current.level++;
				this.$root.puzzle.current.found = [];
				
				//app.timer.addBonus();
				//app.helpers.saveUserTime();
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