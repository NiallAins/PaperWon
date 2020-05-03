<template>
	<div
		class="comp-solution-ani"
		@keyup="keyListener($event)"
		@keydown="$event.keyCode === 16 ? shiftDown = true : ''"
		:tabindex="editing ? 0 : -1"
	>
		<div
			:class="[
				'equation-bg', { 
				'animation-off': animationOff,
				'frame-slow': frameSlow
			}]"
			:style="{ 'font-size': fontSize + 'px' }"
		>
			<div
				:class="['equation-contain', { 'editing': editing	}]"
				:style="{ 'height': height + 'px' }"
			>
				<span
					v-for="(term, i) in aniObject[step][frame]"
					:class="[
						'term',
						TYPES[term.type],
						CLASSES[term.class],
						term.color ? 'color-' + term.color : '',
						{
							'selected': selected === term || multiSelect.includes(i),
							'strike': term.strike,
							'hidden': !term.show,
							'is-symbol': term.value && term.value.length > 1 && term.value[0] !== '&'
						}
					]"
					:style="{
						'top': term.y + 'em',
						'left': term.x + 'em',
						'width': (term.length || 1) + 'em',
						'font-size': fontSize + 'px'
					}"
					@mousedown="selectTerm(i)"
					@mousemove="$event.buttons === 1 ? selectTerm(i, true) : 0"
					v-html="term.value || ''"
				></span>
			</div>

			<div class="buttons" v-if="!demo">
				<button
					class="secondary"
					:disabled="step === 0"
					@click="initStep(step)"> Replay </button>
				<button
					:class="['secondary', {'active': frameSlow }]"
					@click="frameSlow = !frameSlow"
				> Slow </button>
			</div>
		</div>


		<!--!!DEV -->
			<span
				style="font-size: 10px; float: right"
				@click="editing = !editing"
			> Edit </span>
			<div class="controls" v-if="editing">
				<div>
					<button @click="encodeAnimation(aniObject, true)"> Log AniObject </button>
				</div>
				<div>
					<button
						:disabled="frame === 0"
						@click="frame--; selected = null;"
						:style="{'background' : frame || step === 0 ? 'white' : 'red'}"
					> - </button>
					Frame {{ frame }} / {{ aniObject[step].length - 1 }}
					<button
						:disabled="frame === aniObject[step].length - 1"
						@click="frame++; selected = null;"
					> + </button>
					<button
						v-if="frame === aniObject[step].length - 1"
						@click="addFrame(); selected = null;"
					> Add Frame </button>
				</div>
				<div>
					<button
						:disabled="step === 0"
						@click="
							step--;
							frame = aniObject[step].length - 1;
							selected = null;
						"
					> - </button>
					Step {{ step + 1 }} / {{ aniObject.length }}
					<button
						:disabled="step === aniObject.length - 1"
						@click="
							step++;
							frame = 1;
							selected = null;
						"
					> + </button>
					<button
						v-if="step === aniObject.length - 1"
						@click="addStep(); selected = null"
					> Add Step </button>
				</div>
				<div v-if="step !== 0 || frame !== 0">
					<button @click="deleteFrame()">
						Delete {{ aniObject[step].length === 1 ? 'Step' : 'Frame' }}
					</button>
					<br/></br>
				</div>
				<div>
					<button
						v-for="(termType, i) in TYPES"
						@click="addTerm(i)"
					>
						Add {{ termType }}
					</button>
				</div>
				<div class="edit-term" v-if="selected">
					<div>
						<button
							@click="editFutureTerms = !editFutureTerms"
							:class="['secondary', { active: editFutureTerms }]"
						>
							Edit All in Step
						</button>
					</div>
					<div>
						<button @click="editTerm('show', selected.show ? 0 : 1)">
							{{ selected.show ? 'Hide' : 'Show' }} Term
						</button>
						<button @click="deleteTerm(selected)"> Delete Term </button>
						<button @click="cloneTerm()"> Clone Term </button>
					</div>
					<div v-if="typeof selected.length !== 'undefined'">
						Length
						<input
							type="number"
							:value="selected.length"
							onfocus="this.select()"
							@input="editTerm('length', parseInt($event.target.value) || 0)"
						/>
					</div>
					<div v-if="typeof selected.value !== 'undefined'">
						<div class="colour-select">
							Color
							<span
								v-for="i in this.COLORS"
								@click="editTerm('color', i - 1)"
							></span>
						</div>
						<div>
							Styles:
							<span
								:class="{ 'active': selected.strike }"
								@click="editTerm('strike', selected.strike === 0 ? 1 : 0)"
							>
								strike
							</span>
							<span
								v-for="(cl, i) in CLASSES"
								:class="{ 'active': selected.class === i }"
								@click="editTerm('class', selected.class === i ? 0 : i)"
							>
								{{ cl.replace('-r', '-right') }}
							</span>
						</div>
					</div>
				</div>
			</div>
		<!-- -->
	</div>
</template>

<style src="./solution-ani.scss" scoped lang="scss"></style>
<script src="./solution-ani.js"></script>