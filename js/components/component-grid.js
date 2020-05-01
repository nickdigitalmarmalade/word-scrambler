
Vue.component('component-grid', {
    template: `<div class="grid">
					<div class="words" v-for="(word, idx) in wordsList">
						<component-word :word="word"></component-word>
					</div>
			    </div>`,

    props: [],
    computed: {

        wordsList: function() {
            return this.$root.puzzle.levels[this.$root.puzzle.current.level].correctwords;
        }
    }
});