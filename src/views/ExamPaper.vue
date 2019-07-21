<template>
		<div class="view-exam-paper">
				<div class="paper-title">
						<h2> Leaving Certificate Examination {{ $route.params.year }} </h2>
						<br>
						<h1> Mathematics </h1>
						<h2> Paper {{ $route.params.paper[1] }}</h2>
						<h2> {{ $route.params.paper[0] === 'h' ? 'Higher' : 'Ordinary' }} Level </h2>
				</div>
				<div class="question" v-for="(question, q_index) in questions">
						<em>Question {{ q_index + 1 }} </em>
						<router-link
							class="question-content"
							v-for="(part, p_index) in question"
							:to="$route.path + '/' + (q_index + 1) + '/' + (p_index + 1)"
						>
								<div class="part-num">({{ part.label }})</div>
								<render-html class="hide-def">{{ part.text }}</render-html>
						</router-link>
				</div>
		</div>
</template>

<style scoped lang="scss">
	.view-exam-paper {
		margin: 0 auto 100px;
		max-width: 764px;
	}

	.paper-title {
		padding: 30px 0 60px;
		text-align: center;

		h1, h2 {
			font-family: $f-sec;
			font-weight: 500;
			color: black;
		}

		h1 {
			font-size: 36px;
		}

		h2 {
			font-size: 24px;
		}
	}

	.question {
		em {
			font-weight: bold;
			font-style: normal;
		}

		.question-content {
			position: relative;
			display: block;
			padding: 2em;
			padding-left: 4em;
			border: 1px solid #ccc;
			margin: 1em 0;
			transition: all 0.1s;
			
			&:after {
				content: unset;
			}
			
			&:hover {
				padding: calc(2em - 1px);
				padding-left: calc(4em - 1px);
				border: 2px solid $c-prim;

				.part-num {
					left: calc(1em - 1px);
					top: calc(2.1em - 1px);
				}
			}

			.part-num {
				position: absolute;
				transition: all 0.1s;
				left: 1em;
				top: 2.1em;
				font-weight: bold;
			}
		}
	}
</style>

<script>
	import renderHtml from '@/components/render-html';
	import paperData from '@/data/paperData';

	export default {
		name: 'about',
		components: {
			'render-html': renderHtml
		},
		data: function() {
			return {
				questions: []
			}
		},
		created: function() {
			this.questions = paperData[this.$route.params.year][this.$route.params.paper];
		}
	}
</script>