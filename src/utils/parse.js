export function parse(str) {
    let xAxis = [],
        yAxis = [],
        map = [];
    str.trim()
        .split('\n')
        .map((i) => i.trim().split(/\s+/))
        .forEach((i) => {
            if (i.length === 15) {
                xAxis = i;
            } else if (i.length === 16) {
                yAxis.push(i[0]);
                map.push(
                    Array(i.length - 1)
                        .fill(1)
                        .map((item, index) => parseInt(i[index + 1]))
                );
            }
        });
    return {
        xAxis: xAxis,
        yAxis: yAxis,
        map: map
    };
}
