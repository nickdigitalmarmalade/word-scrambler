Vue.component('component-enter-word', {
    template: `<div class="enter-word">
             
                <div class="check-word">
                    <button @click="enterWord">Enter</button>
                </div>

                <div class="feedback feedback--correct" v-if="wordstatus === true && wordstatus != null">
                correct
                </div>

                <div class="feedback feedback--incorrect" v-if="wordstatus === false">
                  wrong
                </div>
                
                </div>`,
    props: [],
    computed: {

    },
    methods: {

        enterWord: function(){

            if(this.$root.getCurrentWord != ''){

                console.log("entered: " + this.$root.getCurrentWord);
                //console.log(this.$root.puzzle.levels[0].correctwords);

                if(this.$root.puzzle.levels[0].correctwords.includes(this.$root.getCurrentWord)){

                    console.log("Word correct!!!");

                    this.$root.current.score += this.$root.getCurrentWord.length * 100;

                    this.wordstatus = true;

                    this.$root.puzzle.current.word = [];

                    // TODO - not working
                    setTimeout(function(){
                        this.wordstatus = null;
                        console.log("1 sec timeout");
                        console.log(this.wordstatus);
                    }, 1000);
                    
                } else {
                    //console.log("WRONG!!!");
                    this.wordstatus = false;
                    this.$root.puzzle.current.word = [];
                }
            }
            // TODO: Check if word correct and not already used before.
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