<template>
	<div class="view-papers">
		<div class="row">
			<div class="col-12">
				<h2 class="no-pad-v"> Exam Papers by Year </h2>
				<p>
					Select a paper below to start working through exam questions and solutions.
				</p>
			</div>
			<div class="col-12" v-for="paper in papers">
				<h2> {{ paper.year }} </h2>
				<div class="row no-pad-v papers">
					<div class="col" v-for="part in paper.parts">
						<router-link
							class="paper-link"
							:to="'/papers/' + paper.year + '/' + part"
						>
							{{ part[0] === 'h' ? 'Higher' : 'Ordinary' }} Level
							<br/>
							<span>Paper {{ part[1] === '1' ? 'One' : 'Two' }}</span>
						</router-link>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

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
			this.papers = this.papers.sort((a, b) => b.year - a.year);
		}
	}
</script>

<style scoped lang="scss">
	ul {
		list-style: none;
		padding-left: $w-pad;
	}

	li {
		padding-bottom: 10px;
	}

	.papers {
		padding-left: $w-pad;

		.col:nth-child(3) {
			padding-left: #{$w-pad * 3};
		}
	}

	.paper-link {
		position: relative;
		top: 0;
		display: table-cell;
		width: 8em;
		height: 10em;
		border: 1px solid $c-border;
		text-align: center;
		vertical-align: middle;
		font-family: $f-sec;
		@include shadow_sm();
		transition:
			box-shadow $l-trans,
			top $l-trans;

		span {
			font-size: $f-size-lg;
		}

		&:hover {
			top: -3px;
			@include shadow_sm_raise();
		}
	}
</style>