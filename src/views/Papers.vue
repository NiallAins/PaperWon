<template>
	<div class="view-papers">
		<h1> Exam papers by year </h1>
		<div v-for="paper in papers">
			<h2> {{ paper.year }} </h2>
			<ul>
				<li v-for="part in paper.parts">
					<router-link :to="'/papers/' + paper.year + '/' + part">
						{{ part[0] === 'h' ? 'Higher' : 'Ordinary' }} Level Paper {{ part[1] === '1' ? 'One' : 'Two' }}
					</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<style scoped>
	ul {
		list-style: none;
	}
	li {
		padding-bottom: 10px;
	}
</style>

<script>
import paperData from '@/data/paperData';

export default {
	name: 'papers',
	data: function() {
		return {
			papers: []
		}
	},
	created: function() {
		Object.keys(paperData).forEach(p => {
			this.papers.push({
				year: p,
				parts: Object.keys(paperData[p])
			})
		});
	}
}
</script>