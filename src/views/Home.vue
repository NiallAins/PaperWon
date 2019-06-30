<template>
	<div class="view-home">
		<article class="col-12">
			<h1> Bring the Leaving to Life</h1>
			<h2>  Take a deeper dive into your Higher Level Maths papers</h2>
			<p>
				We take each exam question, add interactive diagrams and visual aids, and then help you break down the solution step by step. With this approach we leave you with not only the answers, but with a deeper understanding of the concepts involved. 
			</p>
			<h2> Helping Visual Learners </h2>
			<p>
				The Leaving Cert teaches mathamatics through numbers and figures. However, with this approach we lose the connection those numbers have with the living and moving world around us.
				<br>
				This stucture can really impact visual and tactile learners. These students, who otherwise may love and excel at maths, often feel lost and overwhealed by the static stucture. Many will miss out on the opportuninty to really understand the concerpts covered in the leaving cert course and never reach their full potential.
				<br>
				At PaperWon, our interactive guides help students of all abilities and mind-sets get the most out of thier study.
			</p>

			<h2> Get started </h2>
			<p>
				You can go through past papers by year, or just view qusetions related to your current topic.
				<br>
				So start learning now and <router-link :to="'/papers'"> Study by Year </router-link> or <router-link :to="'/topics'"> Study by Topic </router-link>.
			</p>
		</article>

		<div class="col-12">
		<button @click="aniStep++">Next</button>
			<solution-ani
				:step="aniStep"
				:expression="'2 / (2x + 1) + 2 / 5 = 1 / (3x + 1)'"
				:keyframes="[
					[
						'm,0,1',
						'm,5,1',
						'w,200',
						'a,(2x + 1),0/1,1',
						'a,(2x + 1),0/1,1',
						'a,(2x + 1),0/1,1',
						'w',
						'm,6,1',
						'm,2/-1:1,-2',
						'm,0/1:6,1/-2',
						'm,9,6',
						'm,0/1:6,9/-2',
						'm,8/1:1,3',
						'm,17/-1:1,-1',
						'm,0/1:6,17/-2',
						'm,16/1:4,1',
						'w',
						'a,(5),10/1,2',
						'a,(5),10/1,2',
						'a,(5),10/1,2',
						'w',
						'm,7,3',
						'm,18,3',
						'm,13/1:3,-6/-2',
						'm,13/1:3,5/-2',
						'm,13/1:3,16/-2',
						'm,1/1:4,2',
						'm,14/1:1,1',
						'm,23/1:4,2',
						'w',
						'a,(3x + 1),24/1,3',
						'a,(3x + 1),24/1,3',
						'a,(3x + 1),24/1,3',
						'w',
						'm,10,6',
						'm,27,6',
						'm,36/1:6,-9/-2',
						'm,36/1:6,-26/-2',
						'm,36/1:6,8/-2',
						'm,3/1:4,3',
						'm,21/1:1,3',
						'm,37/1:4,3',
					],
					[
						's,1/-1,6',
						's,6/1,4',
						's,24/-1,3',
						's,24/1,1',
						's,44/-1,6',
						's,40/1,4',
						'w',
						'r,1/-1,6',
						'r,6/1,4',
						'r,24/-1,3',
						'r,24/1,1',
						'r,44/-1,6',
						'r,40/1,4',
						'w',
						'm,1,-6',
						'm,0/-1:10,0/1',
						'm,18,-3',
						'm,11/-1:13,0/1',
						'm,25/-1:10,0/1'
					],
					[
						'r,0,10',
						'a,30x + 10,0',
						'm,6,-4',
						'w',
						'r,7,13',
						'a,12x^2 + 4x + 6x + 2,7',
						'm,20,-1',
						'w',
						'r,20,10',
						'a,10x + 1,20',
					],
					[
						'c,7,4,1',
						'w',
						'm,0,5',
						'm,12:4,-12',
						'a,+,4',
						'r,11,1',
						'm,12,-5',
						'w',
						'c,5,3,2',
						'c,12,2,2',
						'c,15,2,2',
						'c,20,3,2',
						'w',
						'm,8,10',
						'm,21:6,-13',
						'a,-,14',
						'm,30:3,-15',
						'r,33,1',
						'm,34,-4',
						'm,27,-6',
						'w',
						'c,19,2,3',
						'c,22,1,3',
						'c,24,1,3',
						'w',
						'm,23,2',
						'm,26:1,-2',
						'a,-,23',
						'a,0,26'
					],
					[
						'r,8,10',
						'm,18,-10',
						'w',
						'r,10,5',
						'm,15,-4',
						'a,1,10,3'
					]
				]"
			/>
		</div>
	</div>
</template>

<script>
	import grapher from '@/components/grapher';
	import solutionAni from '@/components/solution-ani';

	export default {
		name: 'home',
		components: {
			'grapher': grapher,
			'solution-ani': solutionAni
		},
		data: function() {
			return {
				aniStep: 0
			}
		}
	}
</script>