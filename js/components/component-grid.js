
Vue.component('component-grid', {
    template: `<div class="grid">
					<div v-for="(word, idx) in wordsList">
						<component-word :word="word"></component-word>
					</div>
			    </div>`,

    props: [],
    computed: {

        wordsList: function() {
            return this.$root.puzzle.levels[0].correctwords;
        }
    }
});