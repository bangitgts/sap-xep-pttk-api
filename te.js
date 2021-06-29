var course20 = [{
        nameCourse: "Bang1",
        schedule: "2",
        during: 2,
    },
    {
        nameCourse: "Bang2",
        schedule: "0",
        during: 2,
    },
    {
        nameCourse: "Bang3",
        schedule: "2",
        during: 3,
    },
    {
        nameCourse: "Bang4",
        schedule: "2",
        during: 4,
    },
];

var rooms = [{
        lichhoc: [
            [],
            []
        ],
        nameRoom: "Bang5",
        capacity: 20,
    },
    {
        lichhoc: [
            []
        ],
        nameRoom: "Bang4",
        capacity: 20,
    },
    {
        lichhoc: [
            []
        ],
        nameRoom: "Bang6",
        capacity: 20,
    },
];
let temp = [];
for (let item of rooms) {
    temp.push(item.lichhoc.length);
}
let c = Math.min(...temp);
let temp1 = [];
for (let item of rooms) {
    var last = [...item.lichhoc].pop();
    const tong = last.reduce((a, b) => a + b, 0);
    if (item.lichhoc.length === c && tong !== 1 && tong !== 5) {
        temp1.push(item);
    }
}

for (let item of temp1) {
    for (lichhoc of item.lichhoc) {
        var tong = [...item.lichhoc].pop().reduce((a, b) => a + b, 0);

    }
}