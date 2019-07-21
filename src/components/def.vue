<template>
	<span class="comp-def">
		<span>
			<slot></slot>
		</span>
		<div
			class="def-box"
			:class="{
				'has-link': $options.termObj.link
			}"
			v-html="$options.termObj.def"
		>
		  <router-link
			  v-if="$options.termObj.link"
			  :to="$options.termObj.link"
		  >
			  {{ $options.termObj.linkTitle }}
		  </router-link>
		</div>
	</span>
</template>

<style scoped lang="scss">
	.hide-def .comp-def {
		&:before, .def-box {
			display: none;
		}

		&:hover span {
			color: inherit;
		}
	}

	.comp-def {
		position: relative;
		
		span {
			position: relative;
			z-index: 5;
		}
		
		&:before {
			content: '';
			position: absolute;
			left: -3px; 
			top: -5px;
			bottom: -4px;
			z-index: 5;
			width: calc(100% + 6px);
			border-bottom: 3px solid dodgerblue;
			border-radius: 5px;
			transition: all 0.2s;
		}

		&:hover {
			span {
				color: white;
				cursor: default;
				transition: color 0.2s;
			}
			
			&:before {
				left: -10px;
				visibility: visible;
				width: calc(100% + 20px);
				border-radius: 5px 5px 0 0;
				background-color: dodgerblue;
				transition:
					all 0.2s ease-out 0.7s,
					background-color 0.2s;
			}
			
			.def-box {
				left: -10px;
				visibility: visible;
				opacity: 1;
				transition:
					opacity 0.2s ease-out 0.7s,
					left 0.2s ease-out 0.7s,
					visibility 0s linear 0.7s;
				@include shadow;
			}
		}

		.def-box {
			position: absolute;
			left: 0px;
			top: calc(1em + 7px);
			z-index: 4;
			visibility: hidden;
			opacity: 0;
			width: 200px;
			padding: 20px 15px;
			border: 1px solid $c-border;
			font-size: 0.9em;
			background: white;

			&.has-link {
				padding-bottom: 40px;
			}
			
			a {
				position: absolute;
				right: 10px;
				bottom: 10px;
				font-size: 0.9em;
				color: $c-prim;
			}
		}
	}
</style>

<script>
	import definitions from '@/data/definitions';

	export default {
		name: 'def',
		props: {
			term: String
		},
		termObj: null,
		created: function() {
		  this.$options.termObj = definitions[this.term] || { def: 'No Definition Found.' };
		}
	};
</script>
