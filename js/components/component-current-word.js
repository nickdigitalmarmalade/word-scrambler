Vue.component('component-current-word', {
    template: `<div class="current-word">

                    <div class="current-word-wrapper">
                        <div class="word">
                            {{ formatCurrentWord }}
                        </div>

                        <a href="#0" class="icon-button btn--enter-word"
                            @click.stop="enterWord" 
                            :class="{active: this.$root.getCurrentWord.length > 2}">
                                <svg viewBox="0 0 12 12" class="icon">
                                  <use xlink:href="#iconConfirm"></use>
                                </svg>
                                <span class="icon-button__text visuallyhidden">Enter Word</span>
                        </a>
                    </div>

                    <div class="feedback-wrapper">

                        <div class="feedback feedback--correct" 
                            :class="{'active' : wordstatus === 'new-word'}">
                                <div class="left-icon"></div>
                                Wonderful!
                                <div class="right-icon"></div>
                        </div>

                        <div class="feedback feedback--info" 
                            :class="{'active' : wordstatus === 'already-found'}">
                            Repeated word!
                        </div>

                        <div class="feedback feedback--incorrect" 
                            :class="{'active' : wordstatus === 'wrong'}">
                            Nope... try again!
                        </div>
                    </div>

                </div>`,
    props: [],
    computed: {
        formatCurrentWord: function() {
            function joinLetters(el){
                return el;
            }
            return this.$root.puzzle.current.word.map(joinLetters).join('');
        
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
            //}, 99999999);
            }, 2000);
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
       
    },
});