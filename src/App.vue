<template>
    <v-app id="app">
        <v-row no-gutters>
            <v-col :cols="8">
                <div ref="surface" class="main-container"></div>
            </v-col>
            <v-col :cols="4">
                <v-textarea filled :rows="15" v-model="inputStr" label="粘贴运行结果" class="mt-10 px-10"></v-textarea>
                <v-row no-gutters class="mt-1">
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                    <v-btn color="warning" outlined @click="submit">
                        <v-icon class="mr-2">mdi-check</v-icon>
                        确认
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="success" outlined @click="reset">
                        <v-icon class="mr-2">mdi-close-circle-outline</v-icon>
                        清空
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                </v-row>
                <v-row no-gutters class="mt-7">
                    <div v-if="failed.length" class="red--text text-body-2 ml-10">{{ failed }}</div>
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
            echarts: null,
            inputStr: '',
            xAxis: [],
            yAxis: [],
            mountain: [],
            failed: '',
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
                beta: -150,
                distance: 270
            },
            textStyle: {
                fontSize: 15,
                fontFamily: 'Serif'
            },
            nameStyle: {
                fontSize: 17,
                fontFamily: 'Serif'
            }
        };
    },
    mounted() {
        this.echarts = this.$echarts.init(this.$refs.surface);
        this.colors.reverse();
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
                    color: this.colors
                },
                grid3D: {
                    light: this.lights,
                    viewControl: this.viewControl
                },
                xAxis3D: {
                    type: 'category',
                    data: this.xAxis,
                    name: '工作集大小（字节）',
                    nameTextStyle: this.nameStyle,
                    axisLabel: {
                        textStyle: this.textStyle
                    }
                },
                yAxis3D: {
                    type: 'category',
                    data: this.yAxis,
                    name: '步长（字）',
                    nameTextStyle: this.nameStyle,
                    axisLabel: {
                        textStyle: this.textStyle
                    }
                },
                zAxis3D: {
                    name: '读吞吐率（MB/s）',
                    nameTextStyle: this.nameStyle,
                    axisLabel: {
                        show: formatted.length > 0,
                        textStyle: this.textStyle
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
            if (this.inputStr.length === 0) {
                this.failed = '* 你没有输入任何内容。';
            } else {
                const result = parse(this.inputStr);
                if (result['xAxis'].length === 0 && result['yAxis'].length === 0) {
                    this.failed = '* 解析失败，请检查您的输入。';
                } else {
                    this.failed = '';
                    this.mountain = result['map'];
                    this.xAxis = result['xAxis'];
                    this.yAxis = result['yAxis'];
                    this.refresh();
                }
            }
        },
        reset() {
            this.failed = '';
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
