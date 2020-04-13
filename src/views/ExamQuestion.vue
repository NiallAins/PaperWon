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
		<step-list
			v-model="solutionStep"
			:text="[
				'State the expression',
				'Expand the expression by multipling out the brackets',
				'Group the coefficients of x and x<sup>2</sup>',
				'Set the coefficient of x to 2 times the coefficient of x<sup>2</sup>, as stated in the question',
				'Multiple out the bracket',
				'Rearrange the equation; moving unknowns to the left, constants to the right',
				'Add like terms',
				'Divide both sides by the co-efficient p'
			]"
		></step-list>
		<solution-ani
				:step="solutionStep"
				equation="(2x + 1)(x^2 + px + 4)"
				:keyframes="[
					[
						'a,(x^2+px+4),6',
						'w,100',
						'm,3:2,12',
						'm,6:9,11',
						'r,0',
						'r,5',
						'm,0:,-1',
						'm,5:,-3',
						'w',
						'r,2',
						'm,3:2,-2',
						'r,2',
						'r,10',
						'r,12:2',
						'r,21',
						'm,14:,-2',
						'm,5,-2',
						'm,6:2,-1',
						'a,^3,2',
						'a,2,4',
						'a,^2,7',
						'r,9',
						'a,8x,9'
					],
					[
						'c,4:4,1',
						'c,12:2,1',
						'c,9:2,2',
						'c,15:2,2'
					]
				]"
		></solution-ani>

		<!--
		2x^3+2px^2+8x+x^2+px+4
		2x^3 + x^2(2p + 1) + x(8 + p) + 4
		2(2p + 1) = 8 + p
		4p + 2 = 8 + p
		4p - p = 8 - 2
		3p = 6
		p = 2 -->
	</div>
</template>

<style scoped lang="scss">
	.view-exam-question {
		padding-bottom: 200px;
	}
</style>

<script>
	import paperData from '@/data/paperData';
	import renderHtml from '@/components/render-html';
	import stepList from '@/components/step-list';
	import solutionAni from '@/components/solution-ani';

	export default {
		name: 'ExamQuestion',
		components: {
			'render-html': renderHtml,
			'step-list': stepList,
			'solution-ani': solutionAni
		},
		data: function() {
			return {
				question: {},
				solutionStep: 0
			}
		},
		created: function() {
			this.question = paperData[this.$route.params.year][this.$route.params.paper][this.$route.params.question - 1][this.$route.params.part - 1];
		}
	}

</script>