<template>
  <div class="view-topics">
		<div class="row">
			<div class="col-12">
				<h2>Logarithims</h2>
				<p>
					Learn the rules of logarthims with the explainations and examples below.</br>
					Click the play button next to each example for a demonstation.
				</p>
			</div>
		</div>
		<div class="row" v-for="section in content">
			<div class="col-6">
				<h3>{{ section[0] }}</h3>
				<render-html>{{ section[1] }}</render-html>
			</div>
			<div class="col-6">
				<solution-ani
					mode="topics"
					:questionref="section[2]"
				></solution-ani>
			</div>
		</div>
  </div>
</template>

<script>
	import solutionAni from '@/components/solution-ani';
	import renderHtml from '@/components/render-html'

  export default {
    name: 'topics',
		components: {
			'solution-ani': solutionAni,
			'render-html': renderHtml
		},
    created: function() {
			this.content = [
				[
					'Logs and Indices',
					'Logarithims, or Logs, are the inverse of <router-link :to="\'topics/indices\'" class="link">Indices</router-link>.<br/> You can often simplify equations by converting any logs into thier corresponding indices as shown.<br/> In this example, <i m>b</i> represents the base value of the Log.',
					'0L00_0x2020010=30_0y4030010b101031||0L00_0x2020010=30_0y4030010b101031|0L0000000x2020010=30_0y5030110b401001|0L00_0x2020010=30_0y4030010b101031',
				],
				[
					'Natural Logs',
					'The Natural Log is the name given to a Log which uses <i m>e</i> as the base.<br/> The symbol <span class="math"><span class="term">ln</span></span> is used to represent the Natural Log.<br/> The Natural Log operates the same as any other Log, as shown.',
					'0L00_0x2020010=30_0y4030010e1010310N12_0x2220010=32_0y423001||0L00_0x2020010=30_0y4030010e1010310N12_0x2220010=32_0y4230010e121030|0L0000000x2020010=30_0y5030110e4010010N1200000x2220010=32_0y5230110e421001|0L00_0x2020010=30_0y4030010e1010310N12_0x2220010=32_0y4230010e121030'
				],
				[
					'The Product Rule',
					'The Product Rule shows how the log of two multiplied terms can be separated into two seperate logs.',
					'0L00_0e1010310(20_0x3020010z4040010)50_0=60_0y7030010L00_0e1010310(20_0)50_||0L00_0e1010310(20_0x3020010z4040010)50_0=60_0y7030010L00_0e1010310(20_0)50__0|0L00_0e1010310(20_0x3020010z4240010)50_0=60_0y7030010L02_0e1210310(22_0)52__0|0L00_0e1010310(20_0x3020010z9240010)40_0=b0_0yc030010L62_0e7210310(82_0)a2_0+520000|0L00_0e1010310(20_0x3020010z9040010)40_0=b0_0yc030010L60_0e7010310(80_0)a0_0+50_|0L00_0e1010310(20_0x3020010z4040010)50_0=60_0y7030010L00_0e1010310(20_0)50_0+000000'
				],
				[
					'The Quotient Rule',
					'The Quotient Rule shows how the log of two divided terms can be separated into two seperate logs.',
					'0L01_0x3020010=51_0y6130010b1110311131_0z3240010(2100510)4100510L01_0b111031||0L01_0x3020010=51_0y6130010b1110311131_0z3240010(2100510)4100510L01_0b111031_0|0L01_0x3120010=51_0y6130010b111031113100000z3340010(2100500)4100500L03_0b1310310-030000|0L01_0x2120010=71_0y8130010b111031_10z634001_0_00L43_0b5310310-33_|0L01_0x2120010=71_0y8130010b111031113100000z6140010(2100500)4100500L41_0b5110310-31_|0L01_0x3020010=51_0y6130010b1110311131_0z3240010(2100510)4100510L01_0b1110310-010000'
				],
				[
					'The Power Rule',
					'The Power Rule shows how to separte apart the logarithm of a number being raised to a power.',
					'0L00_0x2020010=40_0y5030010b1010310z304011||0L00_0x2020010=40_0y5030010b1010310z3040110)5000000(100000|0L20_0x4020010=60_0y7030010b3010310z0040010)50_0(10_|0L00_0x2020010=40_0y5030010b1010310z3040110)5000000(100000'
				],
				[
					'Changing Base',
					'Is is possible to convert a log with a certain base value into two new logs of a different base.<br/>In the example show, the value of <i m>z</i> can be any value you choose.',
					'0L01_0b1110310x2120010=31_0y4130010L01_||0L01_0b1110310x2120010=31_0y4130010L01_110100000z1100300z113030|0L02_0b2210010x2020010=31_0y4130010L00_1301_0z1040310z124031|0L01_0b1110310x2120010=31_0y4130010L01_110100000z1140300z114030'
				]
      ];
    }
  }
</script>

<style scoped lang="scss">

</style>