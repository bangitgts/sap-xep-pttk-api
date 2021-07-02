let rooms = [{
        lichchan: [{
                nameCourse: "Bang1",
                schedule: "2",
                during: 2,
            },
            { during: 2 },
            { during: 2 },
        ],
        lichle: [],
        nameRoom: "P01",
        capacity: 20,
    },
    {
        lichchan: [{ during: 2 }],
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
const c = Object.getOwnPropertyNames(rooms[0].lichchan[1]).length;

const d = rooms[0].lichchan.reduce((a, b) => a + b.during, 0);

let temp = [];
for (let i = 0; i < rooms.length; i++) {
    for (let j = 0; j < rooms[i].lichchan.length; j++) {
        const c = Object.getOwnPropertyNames(rooms[i].lichchan[j]).length;
        if (c === 1) {
            const itemAdd = {
                nameRoom: rooms[i].nameRoom,
                lichIndex: j,
                during: rooms[i].lichchan[j].during
            }
            temp.push(itemAdd);
        }
    }
}

console.log(temp);