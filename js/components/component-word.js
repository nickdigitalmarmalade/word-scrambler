Vue.component('component-word', {
    template: `<div :class="{ isWordFound: isWordFound }">
                  {{ wordFound}}
                    
                    <div v-if="isWordFound">
                        <template v-for="(letter, idx) in word.length">
                           {{ word[letter - 1] }}
                        </template>
                    </div>
                    <div v-else>
                        <template v-for="(letter, idx) in word.length">
                           #
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
            }
        }
    },
});