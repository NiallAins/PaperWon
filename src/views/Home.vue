<template>
	<div class="view-home">
		<div class="row fill-height vert-center">
			<div class="col-6">
				<article>
					<h1> Master your <br/> Leaving Certificate Maths <br/> course with our interactive exam paper breakdowns.</h1>
					
					<h3> Get started by working through questions by year or by topic:</h3>
					<div class="row">
						<div class="col-6">
							<router-link :to="'/papers'" class="button"> Study by Year </router-link>
						</div>
						<div class="col-6">
							<router-link :to="'/topics'" class="button"> Study by Topic </router-link>
						</div>
					</div>
				</article>
			</div>
			<div class="col-6">
				<article class="demo">
					<h4> Section 1, Question 2 (a) (i) </h4>
					<solution-ani
						:currentStep="aniStep"
						questionref="2019-h1-1-2-1"
						@stepend="continueAnimation()"
						:demo="true"
					></solution-ani>
					<br/>
					<grapher
						:currentStep="aniStep"
						questionref="2019-h1-1-2-1"
						@stepend="continueAnimation(true)"
					></grapher>
				</article>
			</div>
		</div>
	</div>
</template>

<script>
	import solutionAni from '@/components/solution-ani';
	import grapher from '@/components/grapher';

	export default {
		name: 'home',
		components: {
			'solution-ani': solutionAni,
			'grapher': grapher
		},
		data: function() {
			return {
				aniStep: 0,
			}
		},
		methods: {
			continueAnimation: function(lastStep) {
				setTimeout(() =>  lastStep ? this.aniStep = 0 : this.aniStep++, 800);
			}
		}
	}
</script>

<style scoped lang="scss">
	.view-home {
		background: $c-bg;
		margin-bottom: 0;

		.fill-height {
			min-height: calc(100vh - #{$h-header + ($w-pad * 3)});

			&.vert-center>.col-6 {
				padding-bottom: 8%;
			}
		}

		h1 {
			margin-bottom: 50px;
		}

		a.button {
			display: inline-block;
			text-align: center;
			padding: $w-pad;
			width: calc(100% - #{$w-pad});
			margin-right: $w-pad;
		}
		
		article {
			padding: 0 40px;
		}

		article.demo {
			padding: 30px;
			width: 75%;
			margin: 0 auto;
			border: 1px solid $c-border;
			background: white;
			box-shadow: 5px 6px 13px 1px $c-shadow;
			transform: rotate3d(-0.1, 1.8, 0.2, 15deg);
		}
	}
</style>