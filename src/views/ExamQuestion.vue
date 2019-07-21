<template>
	<div class="view-exam-question">
		<h3>
			{{ $route.params.year }}
			{{ $route.params.paper[0] === 'h' ? 'Higher' : 'Ordinary' }} Level Mathematics -
			 Paper {{ $route.params.paper[1] === '1' ? 'One' : 'Two' }}
		</h3>
		<h4>
			Question {{ $route.params.question }} <b>{{ question.label }})</b>
		</h4>
		<render-html>{{ question.text }}</render-html>
	</div>
</template>

<style scoped lang="scss">
	.view-exam-question {
		padding-bottom: 200px;
	}
</style>

<script>
	import paperData from '@/data/paperData';
	import renderHtml from '@/components/render-html'

	export default {
		name: 'ExamQuestion',
		components: {
			'render-html': renderHtml
		},
		data: function() {
			return {
				question: {}
			}
		},
		created: function() {
			this.question = paperData[this.$route.params.year][this.$route.params.paper][this.$route.params.question - 1][this.$route.params.part - 1];
		}
	}

</script>