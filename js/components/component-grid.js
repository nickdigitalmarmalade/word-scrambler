
Vue.component('component-grid', {
    template: `<div class="grid">

	<table cellpadding="0" cellspacing="0" class="puzzle-table">
		<tbody class="puzzleholder">
			<tr v-for="(row, idx) in $root.puzzle.levels[0].gridstart">

				<td v-for="(cell, j) in row" 
				:item="cell" 
				:idx="[idx, j]" 
				:key="cell.id"
				:class="{ 'blank' : cell == '#'}">
					<!-- <div>{{idx}}{{j}}</div> -->
					
					<div>
					{{ $root.puzzle.levels[0].answers[idx][j] }}
					</div>

				</td>

			</tr>
		</tbody>
	</table>

    </div>`,

    props: ['item'],
});