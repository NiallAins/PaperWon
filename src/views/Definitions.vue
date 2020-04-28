<template>
	<div class="view-definitions">
		<div class="row">
			<div class="col-12 header">
				<h2> Definitions of Maths Terms </h2>
				<p>
					In the list below you will find a definition and explanation of all the matematical terms and langauge used throughout your Leaving Certificate Course.
					<br/><br/>
					You can search alphbetically, or by using the search box below.
					<br/>
					<input
						type="text"
						v-model="searchterm"
						placeholder="Search for definition..."
					/>
				</p>
			</div>
		</div>

		<div class="row results">
			<div class="col-12 no-result" v-if="defs.length === 0">
				<h3> No results found for "{{ searchterm }}"</h3>
				<button @click="searchterm = ''" class="secondary">
					<i class="icon-prev"></i>
					Back to Full List
				</button>
			</div>
			<div
				v-for="d in defs"
				class="col-12 no-pad-b"
			>
				<h3> {{ d.name }} </h3>
				<p>
					<render-html>{{ d.def }}</render-html>
					<span v-if="d.example">
						<br/>
						<span class="example-title">Example: </span>
						<render-html v-if="d.example">{{ d.example }}</render-html>.
					</span>
					<router-link
						v-if="d.link"
						class="link-small"
						:to="d.link[0]"
					> {{ d.link[1] }}<i class="icon-next"></i></router-link>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	import definitions from '@/data/definitions';
	import renderHtml from '@/components/render-html';

	export default {
		name: 'about',
		components: {
			'render-html': renderHtml
		},
		props: {
			searchterm: String
		},
		data: function() {
			return {
				defs: []
			}
		},
		created: function() {
			this.ALLDEFS = [];
			for(let key in definitions) {
				let d = definitions[key];
				if (!d.hideInDefPage) {
					d.name = key.replace(/_/g, ' ');
					this.ALLDEFS.push(d);
				}
			}
			this.ALLDEFS.sort((a, b) => a.name.charCodeAt() - b.name.charCodeAt());
			if (this.searchterm) {
				this.filterTerms(this.searchterm);
			} else {
				this.defs = this.ALLDEFS;
			}
		},
		watch: {
			searchterm: function() {
				this.filterTerms();
			}
		},
		methods: {
			filterTerms: function() {
				this.defs = this.ALLDEFS.filter(t => t.name.indexOf(this.searchterm) !== -1);
			}
		}
	}
</script>

<style scoped lang="scss">
	.header {
		border-bottom: 1px solid $c-border;
		margin-bottom: $w-pad * 2;

		input[type=text] {
			padding: $w-pad / 2;
			margin-top: $w-pad;
			font-size: $f-size-sm;
			font-family: $f-prim;
			width: 300px;
		}
	}

	.results {
		.col-12 {
			//border-bottom: 1px solid $c-border;
			margin-bottom: $w-pad / 2;
			padding-left: $w-pad * 2;

			p {
				margin-top: $w-pad;
			}
		}

		.no-result {
			border-bottom: none;

			h3 {
				font-style: italic;
				text-transform: none;
			}

			button {
				margin-top: 40px;

				i:after {
					margin-top: -1px;
					border-color: $c-font;
				}
			}
		}
	}

	h3 {
		text-transform: capitalize;
		margin-bottom: 0;
	}

	.example-title {
		padding-right: $w-pad / 2;
		line-height: 2.5;
		font-style: italic;
	}

	a.link-small {
		padding: $w-pad;
		padding-top: $w-pad / 2;
		display: block;
	}
</style>