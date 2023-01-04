export function parse(str) {
    let xAxis = [],
        yAxis = [];
    const buf = str.split('\n').map((i) => i.trim().split(/\s+/));
    buf.forEach((i) => {
        i.length === 15 && (xAxis = i);
        i.length === 16 && yAxis.push(i[0]);
    });
    const map = xAxis.map(() => Array(yAxis.length).fill(0));
    buf.filter((i) => i.length === 16).forEach((colItem, colIndex) => {
        colItem.slice(1).forEach((rowItem, rowIndex) => {
            map[rowIndex][colIndex] = parseInt(rowItem);
        });
    });
    return {
        xAxis: xAxis,
        yAxis: yAxis,
        map: map
    };
}
