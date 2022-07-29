export function parse(str) {
    let x = [],
        y = [],
        map = [];
    str.trim()
        .split('\n')
        .map((i) => i.trim().split(/\s+/))
        .forEach((i) => {
            if (i.length === 15) {
                x = i;
            } else if (i.length === 16) {
                y.push(i[0]);
                map.push(
                    Array(i.length - 1)
                        .fill(1)
                        .map((item, index) => parseInt(i[index + 1]))
                );
            }
        });
    console.log(map);
    return {
        x: x,
        y: y,
        map: map
    };
}
