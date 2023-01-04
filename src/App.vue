<template>
    <v-app id="app">
        <v-row no-gutters>
            <v-spacer></v-spacer>
            <v-col :cols="$vuetify.breakpoint.mobile ? 8 : 7">
                <div
                    ref="surface"
                    class="main-container"
                    :style="{ marginLeft: $vuetify.breakpoint.mobile ? '1%' : '-9%' }"
                ></div>
            </v-col>
            <v-col :cols="4">
                <v-textarea
                    filled
                    no-resize
                    :height="$vuetify.breakpoint.mobile ? '32vw' : '36vw'"
                    v-model="inputStr"
                    label="粘贴运行结果"
                    class="mt-10 px-10"
                ></v-textarea>
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
            <v-spacer></v-spacer>
        </v-row>
        <div v-show="xAxis.length !== 0">
            <v-row no-gutters :style="{ marginTop: $vuetify.breakpoint.mobile ? '-3vw' : '-5vw' }">
                <v-spacer></v-spacer>
                <v-row no-gutters v-if="$vuetify.breakpoint.mobile">
                    <v-row no-gutters>
                        <v-spacer></v-spacer>
                        <v-col :cols="10">
                            <div class="black--text text-body-1 text-left">{{ '选择' + xName + ':' }}</div>
                            <v-radio-group v-model="xAxisIndex" row @change="refreshXAxis">
                                <v-radio
                                    v-for="(item, index) in xAxis"
                                    :key="index"
                                    :label="item"
                                    :value="index"
                                    class="mr-3"
                                ></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-spacer></v-spacer>
                    </v-row>
                </v-row>
                <v-radio-group v-model="xAxisIndex" row @change="refreshXAxis" v-else>
                    <template v-slot:label>
                        <span class="black--text text-body-1 mr-3">{{ '选择' + xName + ':' }}</span>
                    </template>
                    <v-radio
                        v-for="(item, index) in xAxis"
                        :key="index"
                        :label="item"
                        :value="index"
                        class="mr-3"
                    ></v-radio>
                </v-radio-group>
                <v-spacer></v-spacer>
            </v-row>
            <v-row no-gutters>
                <v-spacer></v-spacer>
                <div ref="xDraw" :class="$vuetify.breakpoint.mobile ? 'sub-container-mb' : 'sub-container-pc'"></div>
                <v-spacer></v-spacer>
            </v-row>
        </div>
        <div v-show="yAxis.length !== 0">
            <v-row no-gutters>
                <v-spacer></v-spacer>
                <v-row no-gutters v-if="$vuetify.breakpoint.mobile">
                    <v-row no-gutters>
                        <v-spacer></v-spacer>
                        <v-col :cols="10">
                            <div class="black--text text-body-1 text-left">{{ '选择' + yName + ':' }}</div>
                            <v-radio-group v-model="yAxisIndex" row @change="refreshYAxis">
                                <v-radio
                                    v-for="(item, index) in yAxis"
                                    :key="index"
                                    :label="item"
                                    :value="index"
                                    class="mr-3"
                                ></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-spacer></v-spacer>
                    </v-row>
                </v-row>
                <v-radio-group v-model="yAxisIndex" row @change="refreshYAxis" v-else>
                    <template v-slot:label>
                        <span class="black--text text-body-1 mr-3">{{ '选择' + yName + ':' }}</span>
                    </template>
                    <v-radio
                        v-for="(item, index) in yAxis"
                        :key="index"
                        :label="item"
                        :value="index"
                        class="mr-3"
                    ></v-radio>
                </v-radio-group>
                <v-spacer></v-spacer>
            </v-row>
            <v-row no-gutters>
                <v-spacer></v-spacer>
                <div ref="yDraw" :class="$vuetify.breakpoint.mobile ? 'sub-container-mb' : 'sub-container-pc'"></div>
                <v-spacer></v-spacer>
            </v-row>
        </div>
    </v-app>
</template>

<script>
import { parse } from '@/utils/parse';

export default {
    data: function () {
        return {
            mainChart: null,
            inputStr: '',
            xAxis: [],
            xName: '步长（字）',
            xAxisIndex: 0,
            xChart: null,
            yAxis: [],
            yName: '工作集大小（字节）',
            yAxisIndex: 0,
            yChart: null,
            zName: '读吞吐率（MB/s）',
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
                    intensity: 0.4,
                    alpha: 30,
                    beta: 120
                },
                ambient: {
                    intensity: 0.8
                }
            },
            viewControl: {
                projection: 'perspective',
                alpha: 20,
                beta: 35,
                distance: 270
            },
            textStyle: {
                nameLocation: 'center',
                nameTextStyle: {
                    fontSize: 17,
                    fontFamily: 'Serif',
                    padding: [16, 0, 44, 0]
                },
                axisLabel: {
                    fontSize: 15,
                    fontFamily: 'Serif'
                }
            },
            lineSeries: {
                type: 'line',
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontFamily: 'Serif'
                    }
                }
            }
        };
    },
    mounted() {
        this.mainChart = this.$echarts.init(this.$refs.surface);
        this.xChart = this.$echarts.init(this.$refs.xDraw);
        this.yChart = this.$echarts.init(this.$refs.yDraw);
        window.onresize = () => {
            this.mainChart.resize();
            this.xChart.resize();
            this.yChart.resize();
        };
        this.colors.reverse();
        const inputStr = this.$route.query['map'];
        if (inputStr) {
            this.inputStr = inputStr;
            const result = parse(inputStr);
            if (result['xAxis'].length > 0 && result['yAxis'].length > 0) {
                this.mountain = result['map'];
                this.xAxis = result['xAxis'];
                this.yAxis = result['yAxis'];
            }
        }
        this.refreshMain();
    },
    methods: {
        refreshMain() {
            let formatted = [];
            this.xAxisIndex = this.yAxisIndex = 0;
            this.refreshXAxis();
            this.refreshYAxis();
            this.mountain.forEach((line, i) => line.forEach((item, j) => formatted.push([i, j, item])));
            this.mainChart.setOption({
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
                    name: this.xName,
                    ...this.textStyle
                },
                yAxis3D: {
                    type: 'category',
                    data: this.yAxis,
                    name: this.yName,
                    ...this.textStyle
                },
                zAxis3D: {
                    name: this.zName,
                    nameTextStyle: this.textStyle.nameTextStyle,
                    axisLabel: {
                        show: formatted.length > 0,
                        ...this.textStyle.axisLabel
                    }
                },
                series: [
                    {
                        type: 'surface',
                        data: formatted,
                        dataShape: [this.xAxis.length, this.yAxis.length]
                    }
                ]
            });
        },
        refreshXAxis() {
            this.xChart.setOption({
                xAxis: {
                    type: 'category',
                    data: this.yAxis,
                    name: this.yName,
                    ...this.textStyle
                },
                yAxis: {
                    type: 'value',
                    name: this.zName,
                    nameRotate: 90,
                    ...this.textStyle
                },
                series: [
                    {
                        ...this.lineSeries,
                        data: this.mountain[this.xAxisIndex]
                    }
                ]
            });
        },
        refreshYAxis() {
            this.yChart.setOption({
                xAxis: {
                    type: 'category',
                    data: this.xAxis,
                    name: this.xName,
                    ...this.textStyle
                },
                yAxis: {
                    type: 'value',
                    name: this.zName,
                    nameRotate: 90,
                    ...this.textStyle
                },
                series: [
                    {
                        ...this.lineSeries,
                        data: this.mountain.map((i) => i[this.yAxisIndex])
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
                    this.refreshMain();
                }
            }
        },
        reset() {
            this.failed = '';
            this.inputStr = '';
            this.mountain = [];
            this.xAxis = this.yAxis = [];
            this.refreshMain();
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
    width: 125%;
    height: 60vw;
    margin-top: -10vw;
}

.sub-container-pc {
    width: 64vw;
    height: 36vw;
    margin-left: 4vw;
}

.sub-container-mb {
    width: 96vw;
    height: 54vw;
    margin-left: 6vw;
}
</style>
