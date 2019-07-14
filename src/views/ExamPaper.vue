<template>
    <div class="view-exam-paper">
        <div class="paper-title">
            <h2> Leaving Certificate Examination {{ $route.params.year }} </h2>
            <br>
            <h1> Mathematics </h1>
            <h2> Paper {{ $route.params.paper }}</h2>
            <h2> Higher Level </h2>
        </div>
        <div class="question">
            <em>Question 1</em>
            <router-link :to="$route.path + '/q1'" class="question-content">
                <div class="part-num">(a)</div>
                In the expansion of (2<i>x</i> + 1)(<i>x</i><sup>2</sup> + <i>px</i> + 4),
                where <i>p</i> <span v-symbol>element</span> <def term="naturalnumber"><span v-symbol>natural</span></def>,
                the coefficient of x is twice the coefficient of <i>x</i><sup>2</sup>. Find the value of <i>p</i>.
            </router-link>
            <router-link :to="$route.path + 'q2'" class="question-content">
                <div class="part-num">(b)</div>
                Solve the equation
                <span v-frac>3 / 2<i>x</i> + 1</span> +
                <span v-frac>2/5</span> =
                <span v-frac>2 / 3<i>x</i> - 1</span>
                where <i>x</i> <span v-symbol>notequal</span>
                -<span v-frac>1 / 2</span>,
                <span v-frac>1 / 3</span>,
                and <i>x</i> <span v-symbol>element</span> <span v-symbol>real</span>.
            </router-link>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import '../_vars.scss';

    .view-exam-paper {
        margin: 0 auto;
        max-width: 764px;
    }

    .paper-title {
        padding: 30px 0 60px;
        text-align: center;
        
        h1, h2 {
            font-family: 'Lora', serif;
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
    import def from '@/components/def';

    export default {
        name: 'about',
        components: {
            'def': def
        }
    }
</script>