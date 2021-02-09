Vue.component('component-buttons', {
    template: `<div class="action-word">

                    <a href="#0" class="icon-button" @click.stop="deleteWord"
                    :class="{'disabled' : this.$root.puzzle.current.word.length === 0}">
                        <svg viewBox="0 0 512 512" class="icon">
                          <use xlink:href="#iconDeleteWord"></use>
                        </svg>
                        <span class="icon-button__text visuallyhidden">Delete Word</span>
                    </a>

                    <a href="#0" class="icon-button" @click.stop="undoLetter" 
                    :class="{'disabled' : this.$root.puzzle.current.word.length === 0}">
                        <svg viewBox="0 0 512 512" class="icon">
                          <use xlink:href="#iconDeleteLetter"></use>
                        </svg>
                        <span class="icon-button__text visuallyhidden">Delete Letter</span>
                    </a>

                </div>`,
    props: [],
    computed: {

    },
    methods: {
        undoLetter: function() {
            this.$root.puzzle.current.word.splice(-1,1);
        },

        deleteWord: function(){
            this.$root.puzzle.current.word = [];

        }
    },
    data() {
        return {
           
        }
      },
    created: function() {
       
    },
});