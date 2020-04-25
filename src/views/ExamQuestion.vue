<template>
	<div class="view-exam-question">
		<div class="row nav-bar">
			<div class="col-6">
				<router-link
					class="link-small"
					:to="'/papers/' + year + '/' + paper"
				><i class="icon-prev"></i>Back to Paper</router-link>
			</div>
			<div class="col-6 content-right">
				<router-link
					v-if="questionData.prev"
					class="link-small"
					:to="'/papers/' + questionData.prev"
				><i class="icon-prev"></i>Previous Question</router-link>
				<router-link
					v-if="questionData.next"
					class="link-small"
					:to="'/papers/' + questionData.next"
				>Next Question<i class="icon-next"></i></router-link>
			</div>
		</div>
		<div class="row">
			<div class="col-12">
				<h4> {{ title }} </h4>
				<h2>
					Section {{ sectionNum }},
					Question {{ questionNum }} <b>{{ questionData.label.replace('>', '') }}</b>
				</h2>
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<h2> Problem </h2>
				<div v-if="questionParentText">
					<render-html>{{ questionParentText }}</render-html>
					<br/>
				</div>
				<render-html>{{ questionData.text }}</render-html>
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<h2> Solution </h2>
			</div>
			<div class="col-5">
				<step-list
					v-model="solutionStep"
					:questionref="questionRef"
				></step-list>
			</div>
			<div class="col-7">
				<solution-ani
					v-if="questionData.ani"
					:currentStep="solutionStep"
					:questionref="questionRef"
					:showedit="false"
				></solution-ani>
				<br/>
				<grapher
					v-if="questionData.graph"
					:currentStep="solutionStep"
					:questionref="typeof questionData.graph === 'string' ? questionData.graph : questionRef"
				></grapher>
			</div>
		</div>
	</div>
</template>

<script>
	import paperData from '@/data/paperData';
	import renderHtml from '@/components/render-html';
	import stepList from '@/components/step-list';
	import solutionAni from '@/components/solution-ani';
	import grapher from '@/components/grapher';

	export default {
		name: 'ExamQuestion',
		components: {
			'render-html': renderHtml,
			'step-list': stepList,
			'solution-ani': solutionAni,
			'grapher': grapher
		},
		props: {
			year: String,
			paper: String,
			question: String
		},
		data: function() {
			return {
				questionData: {},
				questionRef: '',
				questionParentText: '',
				title: '',
				sectionNum: '',
				questionNum: '',
				solutionStep: 0
			}
		},
		watch: {
			question: function() {
				this.renderQuestion();
			}
		},
		created: function() {
			this.renderQuestion();
		},
		methods: {
			renderQuestion: function() {
				this.title =
					this.year +
					(this.paper[0] === 'h' ? ' Higher' : ' Ordinary') +
					' Level Paper' +
					(this.paper[1] === '1' ? ' One' : ' Two');
				this.questionRef = [this.year, this.paper, this.question].join('-');

				let questionParts = this.question.split('-');
				this.sectionNum = questionParts[0];
				this.questionNum = questionParts[1];

				let questionParentObj = paperData[this.year][this.paper][this.sectionNum - 1].questions[this.questionNum - 1];
				this.questionParentText = questionParentObj.text;
				this.questionData = questionParentObj.parts[ questionParts[2] - 1];
			}
		}
	}
</script>

<style scoped lang="scss">
	.nav-bar {
		border-bottom: 1px solid $c-border;
		padding-bottom: #{1 * $w-pad};
		margin-bottom: #{2 * $w-pad};

		.content-right a:last-child {
			padding-left: #{2 * $w-pad};
		}
	}

	h4 {
		margin-bottom: 5px;
	}

	.row:last-child {
		margin-top: 20px;
	}

	.link-back {
		line-height: 20px;
	}
</style>