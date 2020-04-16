

Vue.component('component-keyboard', {
    template: `<div class="keyboard">
                <div class="keys" v-for="(letter, idx) in $root.startingLetters">
                        
                        <div @click="addLetter(letter)">{{letter}}</div>

                </div> 
            </div>`,
    props: ['startingLetters'],
    computed: {
        isCorrect: function() {

        },
    },
    methods: {

        addLetter: function(letter){

            // add letter to new word array.
            console.log(letter);
            this.$root.currentWord.push(letter);
        }

    },
    created: function() {
        console.log(this.$root.startingLetters);

        console.log(this.startingLetters);

    },
});