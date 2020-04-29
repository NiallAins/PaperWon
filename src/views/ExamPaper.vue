<template>
		<div class="view-exam-paper">
			<section class="row">
				<div class="col-12 no-pad-b">
					<p> Select a question from the paper below to work through its solution.</p>
				</div>
			</section>


			<section :class="['page', { 'nav-open': navOpen }]">
				<aside>
					<div class="aside-container">
						<button
							class="close"
							@click="navOpen = false"
						></button>
						<table class="contents">
							<tbody v-for="(section, sIndex) in paperData">
								<tr>
									<td colspan="2">
										Section {{ String.fromCharCode(sIndex + 65) }}
										<br>
										<i> {{ section.title }}</i>
									</td>
								</tr>
								<tr>
									<th>Ques.</th>
									<th>Topic</th>
								</tr>	
								<tr
									v-for="(question, qIndex) in section.questions"
									class="entry"
									@click="scrollTo(sIndex + '-' + qIndex)"
								>
									<td> {{ qIndex + 1 }} </td>
									<td>
										<span v-for="(topic, tIndex) in question.topics">
											<span v-if="tIndex > 0">, </span>
											<router-link
												class="link-small"
												:to="'/topics/' + topic"
											>{{ topic }}</router-link>
										</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</aside>

				<main>
					<button
						:class="['show-aside', { 'aside-open': navOpen }]"
						@click="navOpen = true"
					>
						Contents
					</button>

					<div class="paper-title">
						<h2> Leaving Certificate Examination {{ this.year }} </h2>
						<br>
						<h1> Mathematics </h1>
						<h2> Paper {{ this.paper[1] }}</h2>
						<h2> {{ this.paper[0] === 'h' ? 'Higher' : 'Ordinary' }} Level </h2>
					</div>

					<div class="contain" v-for="(section, sIndex) in paperData">
						<div class="section-title row">
							<div class="col-3"> Section {{ String.fromCharCode(sIndex + 65) }} </div>
							<div class="col-6"> {{ section.title }} </div>
							<div class="col-3"> {{ section.marks }} Marks </div>
						</div>

						<div
							class="question"
							v-for="(question, qIndex) in section.questions"
							:ref="sIndex + '-' + qIndex"
						>
								<em> Question {{ qIndex + 1 }} </em>
								<span class="push-right"> ({{ question.marks }} marks) </span>

								<p>
									<render-html class="hide-def">{{ question.text }}</render-html>
								</p>

								<div v-if="question.graph" class="row">
									<div class="col-8 col-off-2 no-pad-t">
										<grapher
											v-if="question.graph"
											:onpaper="true"
											:questionref="question.graph"
										></grapher>
									</div>
								</div>

								<router-link
									class="question-part"
									v-for="(part, pIndex) in question.parts"
									:to="$route.path + '/' + [sIndex + 1, qIndex + 1, pIndex + 1].join('-')"
								>
										<div class="part-num">
											{{ part.label.replace('>', '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') }}
										</div>
										<render-html class="hide-def">{{ part.text }}</render-html>
								</router-link>
						</div>
					</div>
				</main>
			</section>
		</div>
</template>

<script>
	import allPaperData from '@/data/paperData';
	import renderHtml from '@/components/render-html';
	import grapher from '@/components/grapher';

	export default {
		name: 'about',
		components: {
			'render-html': renderHtml,
			'grapher': grapher
		},
		props: {
			year: String,
			paper: String
		},
		data: function() {
			return {
				paperData: [],
				navOpen: false
			}
		},
		created: function() {
			this.paperData = allPaperData[this.year][this.paper];
		},
		methods: {
			scrollTo: function(questionRef) {
				let top = this.$refs[questionRef][0].offsetTop + 100;
				window.scrollTo({ top: top, behavior: 'smooth' });

				// Browser support
				let checkScroll = window.scrollY;
				setTimeout(() => {
					if (window.scrollY === checkScroll) {
						window.scrollTo(0, top);
					}
				}, 100);
			}
		}
	}
</script>

<style scoped lang="scss">
	$w-page: 880px;
	$w-aside: 300px;

	.view-exam-paper {
		overflow: visible;

		p {
			max-width: $w-page;
			margin: 0 auto #{$w-pad * 2};
		}
	}

	.page {
		position: relative;
		max-width: $w-page;
		margin: 20px auto;

		aside {
			position: absolute;
			top: 0;
			bottom: 0;
			left: -#{$w-pad + ($w-aside / 2)};
			z-index: 0;
			width: $w-aside;
			pointer-events: none;
			opacity: 0;
			transition: opacity $l-trans;

			.aside-container {
				position: sticky;
				top: #{($w-pad * 3) + $h-header};
				border: 1px solid $c-border;
				background: $c-bg;
			}

			button.close-aside {
				position: absolute;
				top: $w-pad;
				right: $w-pad;
				padding: 4px 10px;
			}
		}

		main {
			position: relative;
			left: 0;
			z-index: 1;
			padding: 70px 60px;
			border: 1px solid $c-border;
			color: $c-font-exam;
			background: $c-bg;
			transition: left $l-trans;
			@include shadow();

			button.show-aside {
				position: sticky;
				top: #{$h-header + (2 * $w-pad)};
				z-index: $z-sticker;
				padding: #{$w-pad / 2} $w-pad;
				border: 1px solid $c-border;
				border-top-left-radius: 0;
				margin: -5px 0 -5px -72px;
				background: $c-bg-d;
				color: $c-font;
				opacity: 1;
				transition: opacity $l-trans;

				&:before {
					content: '';
					position: absolute;
					left: -1px;
					top: -5px;
					height: 5px;
					width: 12px;
					border-top-left-radius: 100%;
					background: $c-bg-dd;
				}

				&.aside-open {
					opacity: 0;
					pointer-events: none;
				}
			}
		}

		&.nav-open {
			aside {
				pointer-events: all;
				opacity: 1;
			}

			main {
				left: $w-aside / 2;
			}
		}
	}

	table.contents {
		margin: 0 20px 30px;
		border-collapse: collapse;

		tr.entry:hover {
			background: $c-bg-d;
			cursor: pointer;
		}

		tr:first-child td {
			text-align: left;
			padding: #{$w-pad * 3} 0 #{$w-pad / 2};
			line-height: 1.1em;

			i {
				font-size: $f-size-sm;
			}
		}
		th {
			text-align: left;
			font-weight: normal;
			font-size: 0.8em;
		}
		td, th {
			padding-right: 10px;
			vertical-align: top;

			&:first-child {
				text-align: center;
			}
		}
		a {
			text-transform: capitalize;
		}
	}

	.paper-title {
		margin: 30px 0 0;
		text-align: center;

		h1, h2 {
			font-weight: 500;
		}

		h1 {
			font-size: $f-size-title-exam;
		}

		h2 {
			font-size: $f-size-title;
		}
	}

	.section-title {
		padding: 0 $w-pad;
		margin-top: 80px;
		background: $c-bg-d;
		font-family: $f-sec;

		div:last-child {
			text-align: right;
		}
		div:nth-child(2) {
			text-align: center;
		}
	}

	.question {
		margin-top: 60px;

		.question-part {
			position: relative;
			display: block;
			padding: 2em;
			padding-left: 4em;
			border: 1px solid $c-border;
			margin: 1em 0;
			line-height: 1.35;
			
			&:hover,
			&:focus {
				outline: 2px solid $c-prim;
				outline-offset: -1px;
			}

			.part-num {
				position: absolute;
				transition: all 0.1s;
				left: 0.8em;
				top: 1.9em;
				font-weight: bold;
			}
		}
	}
</style>