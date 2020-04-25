<template>
	<span class="comp-def">
		<span>
			<slot></slot>
		</span>
		<div
			class="def-box"
			:class="{
				'has-link': termObj.link
			}"
		>
			<render-html>
				{{ termObj.def }}
				<span v-if="termObj.example" class="example">
					<i class="sans">Ex.</i> {{ term.example }}
				</span>
			</render-html>
		  <router-link
			  v-if="termObj.link"
			  :to="termObj.link[0]"
				class="link-small"
		  >
			  {{ termObj.link[1] }}<i class="icon-next"></i>
		  </router-link>
		</div>
	</span>
</template>

<script>
	import definitions from '@/data/definitions';
	import renderHtml from '@/components/render-html';

	export default {
		name: 'def',
		components: {
			'render-html': renderHtml,
		},
		props: {
			term: String
		},
		created: function() {
		  this.termObj = definitions[this.term] || { def: 'No Definition Found.' };
		}
	};
</script>

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
		
		&>span {
			position: relative;
			z-index: $z-dropdown - 1;
			transition: color $l-trans ease $l-ani;
		}
		
		&:before {
			content: '';
			position: absolute;
			left: -3px; 
			top: -5px;
			bottom: -4px;
			z-index: $z-dropdown - 1;
			width: calc(100% + 6px);
			border-bottom: 3px solid $c-prim;
			border-radius: 5px;
			transition:
				width $l-trans ease $l-ani,
				visibility $l-trans ease $l-ani,
				left $l-trans ease $l-ani,
				border-radius $l-trans ease $l-ani,
				background-color $l-trans ease $l-ani;
		}

		&:hover {
			&>span {
				color: $c-bg;
				z-index: $z-dropdown;
				transition: none;
				cursor: none;
			}
			
			&:before {
				left: -10px;
				z-index: $z-dropdown;
				visibility: visible;
				width: calc(100% + 20px);
				border-radius: 5px 5px 0 0;
				background-color: $c-prim;
				transition:
					all $l-trans ease $l-ani,
					background-color $l-trans;
			}
			
			.def-box {
				left: -10px;
				visibility: visible;
				opacity: 1;
				@include shadow;
			}
		}

		.def-box {
			position: absolute;
			left: 0px;
			top: calc(1em + 10px);
			z-index: $z-dropdown;
			visibility: hidden;
			opacity: 0;
			width: 200px;
			padding: 20px 15px;
			border: 1px solid $c-border;
			font-size: 0.9em;
			background: white;
			transition:
				box-shadow $l-trans ease $l-ani,
				opacity $l-trans ease $l-ani,
				left $l-trans ease $l-ani,
				visibility 0s linear $l-ani;

			&.has-link {
				padding-bottom: 40px;
			}
			
			a {
				position: absolute;
				right: 10px;
				bottom: 10px;
			}

			.exmaple {
				padding-top: $w-pad;
			}
		}
	}
</style>
