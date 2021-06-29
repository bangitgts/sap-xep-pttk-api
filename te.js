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
        lichhoc: [],
        nameRoom: "Bang5",
        capacity: 20,
    },
    {
        lichhoc: [],
        nameRoom: "Bang4",
        capacity: 20,
    },
    {
        lichhoc: [],
        nameRoom: "Bang6",
        capacity: 20,
    },

];


let temp = [];

for (let course of course20) {
    temp.push(course.lichhoc.length);
}
console.log(temp)