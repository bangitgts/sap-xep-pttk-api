var course20 = [{
        nameCourse: "Bang3",
        schedule: "2",
        during: 2,
    },
    {
        nameCourse: "Bang4",
        schedule: "2",
        during: 2,
    },
];

let rooms = [{
        lichhoc: [
            []
        ],
        nameRoom: "P01",
        capacity: 20,
    },
    {
        lichhoc: [
            []
        ],
        nameRoom: "P02",
        capacity: 20,
    },
    {
        lichhoc: [
            []
        ],
        nameRoom: "P03",
        capacity: 20,
    },
    {
        lichhoc: [
            []
        ],
        nameRoom: "P04",
        capacity: 20,
    },
];

function removeA(arr) {
    var what,
        a = arguments,
        L = a.length,
        ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

while (course20.length !== 0) {
    //const lastTong = c.reduce((a, b) => a + b, 0);
    const findChan = course20.find((el) => el.schedule === "2");
    rooms.sort(function(a, b) {
        return a.lichhoc.length - b.lichhoc.length;
    });
    let c = rooms[0].lichhoc.slice(-1)[0];
    if (findChan !== undefined) {
        // rooms[0].lichhoc.push(2);
        [...rooms.lichhoc].pop()
        removeA(course20, findChan);
    }
}
console.log(rooms);