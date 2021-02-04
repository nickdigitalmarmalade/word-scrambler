Vue.component('component-buttons', {
    template: `<div class="current-word">
                
    
                <a href="#0" class="icon-button" @click.stop="deleteWord">
                    <svg viewBox="0 0 512 512" class="icon">
                      <use xlink:href="#iconDeleteWord"></use>
                    </svg>
                    <span class="icon-button__text visuallyhidden">Settings</span>
                </a>

                <a href="#0" class="icon-button" @click.stop="undoLetter">
                    <svg viewBox="0 0 512 512" class="icon">
                      <use xlink:href="#iconDeleteLetter"></use>
                    </svg>
                    <span class="icon-button__text visuallyhidden">Settings</span>
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