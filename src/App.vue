<template>
    <v-app id="app">
        <v-row no-gutters>
            <v-col :cols="8">
                <div ref="surface" class="main-container"></div>
            </v-col>
            <v-col :cols="4">
                <v-textarea
                    outlined
                    :rows="18"
                    v-model="inputStr"
                    label="粘贴运行结果"
                    class="mt-10 px-10"
                ></v-textarea>
                <v-row class="mt-1">
                    <v-spacer></v-spacer>
                    <v-btn color="warning" outlined class="mx-12" @click="submit">
                        <v-icon class="mr-2">mdi-check</v-icon>
                        确认
                    </v-btn>
                    <v-btn color="success" outlined class="mx-12" @click="reset">
                        <v-icon class="mr-2">mdi-close-circle-outline</v-icon>
                        清空
                    </v-btn>
                    <v-spacer></v-spacer>
                </v-row>
            </v-col>
        </v-row>
    </v-app>
</template>

<script>
import { parse } from '@/utils/parse';

export default {
    data: function () {
        return {
            colors: [
                '#313695',
                '#4575b4',
                '#74add1',
                '#abd9e9',
                '#e0f3f8',
                '#ffffbf',
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026'
            ],
            lights: {
                main: {
                    intensity: 0.3,
                    alpha: 135,
                    beta: 45
                },
                ambient: {
                    intensity: 0.8
                }
            },
            viewControl: {
                projection: 'perspective',
                alpha: 15,
                beta: -135,
                distance: 240
            },
            echarts: null,
            inputStr: '',
            xAxis: [],
            yAxis: [],
            mountain: []
        };
    },
    mounted() {
        this.echarts = this.$echarts.init(this.$refs.surface);
        this.refresh();
    },
    methods: {
        refresh() {
            let formatted = [];
            this.mountain.forEach((line, i) => line.forEach((item, j) => formatted.push([i, j, item])));
            this.echarts.setOption({
                visualMap: {
                    show: false,
                    min: Math.min(...formatted.map((i) => i[2])),
                    max: Math.max(...formatted.map((i) => i[2])),
                    color: this.colors.reverse()
                },
                grid3D: {
                    light: this.lights,
                    viewControl: this.viewControl
                },
                xAxis3D: {
                    type: 'category',
                    data: this.xAxis,
                    name: '工作集大小（字节）'
                },
                yAxis3D: {
                    type: 'category',
                    data: this.yAxis,
                    name: '步长（字）'
                },
                zAxis3D: {
                    name: '读吞吐率（MB/s）',
                    axisLabel: {
                        show: formatted.length > 0
                    }
                },
                series: [
                    {
                        type: 'surface',
                        data: formatted
                    }
                ]
            });
        },
        submit() {
            const result = parse(this.inputStr);
            this.mountain = result['map'];
            this.xAxis = result['xAxis'];
            this.yAxis = result['yAxis'];
            this.refresh();
        },
        reset() {
            this.inputStr = '';
            this.mountain = [];
            this.xAxis = this.yAxis = [];
            this.refresh();
        }
    }
};
</script>

<style>
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}
</style>

<style scoped>
.main-container {
    width: 100%;
    height: 115%;
    margin-top: -11%;
}
</style>
