Vue.component('component-word', {
    template: `<div class="list" :class="{ isWordFound: isWordFound }">
                    
                    {{ wordFound}}
                    
                    <div v-if="isWordFound">
                        <template v-for="(letter, idx) in word.length">
                           <span>{{ word[letter - 1] }}</span>
                        </template>
                    </div>
                    <div v-else>
                        <template v-for="(letter, idx) in word.length">
                           <span></span> 
                        </template>
                    </div>

                </div>`,
    props: ['word'],
    data() {
        return {
            isWordFound: false
        }
    },
    created: function() {
       this.wordFound;
    },
    methods: {
  
    },
    computed: {
        wordFound() {
            if(this.$root.puzzle.current.found.includes(this.word)){
                this.isWordFound = true;
            } else {
                this.isWordFound = false;
            }
        }
    },
});