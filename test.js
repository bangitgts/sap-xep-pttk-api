let rooms = [{
        lichchan: [],
        lichle: [],
        nameRoom: "P01",
        capacity: 20,
    },
    {
        lichchan: [{ during: 1 }],
        lichle: [],
        nameRoom: "P02",
        capacity: 20,
    },
    {
        lichchan: [],
        lichle: [{ during: 1 }],
        nameRoom: "P03",
        capacity: 20,
    },
];

rooms.sort(function(a, b) {
    return (
        a.lichchan.reduce((a, b) => a + b.during, 0) -
        b.lichchan.reduce((a, b) => a + b.during, 0)
    );
});
rooms.sort(function(a, b) {
    return (
        a.lichle.reduce((a, b) => a + b.during, 0) -
        b.lichle.reduce((a, b) => a + b.during, 0)
    );
});
console.log(rooms)