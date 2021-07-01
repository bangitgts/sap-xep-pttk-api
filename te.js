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
    {
        nameCourse: "Bang5",
        schedule: "2",
        during: 3,
    },
    {
        nameCourse: "Bang6",
        schedule: "2",
        during: 4,
    },
];

let rooms = [{
        lichchan: [],
        lichle: [],
        nameRoom: "P01",
        capacity: 20
    },
    {
        lichchan: [],
        lichle: [],
        nameRoom: "P02",
        capacity: 20
    },
    {
        lichchan: [],
        lichle: [],
        nameRoom: "P03",
        capacity: 20
    }
];

while (course20.length !== 0) {
    const findChan = course20.find((el) => el.schedule === "2");
    const findChanIndex = course20.findIndex((el) => el.schedule === "2");
    rooms.sort(function(a, b) {
        return (
            a.lichchan.reduce((a, b) => a + b.during, 0) -
            b.lichchan.reduce((a, b) => a + b.during, 0)
        );
    });
    course20.pop();
    res.json(rooms);

    // rooms[0].lichchan.push(findChan);
    // course20.splice(findChanIndex, 1);
}
res.json(rooms);