let rooms = [{
        nameCourse: "Bang1",
        schedule: "2",
        during: 3,
        amount: 19,
    },
    { nameCourse: "Bang2", schedule: "2", during: 3, amount: 20 },
    {
        nameCourse: "Bang3",
        schedule: "2",
        during: 3,
        amount: 18
    }
];

function bubbleSort(array) {
    var size = array.length;
    for (var i = 0; i < size - 1; i++) {
        for (var j = 0; j < size - i - 1; j++) {
            if (array[j].during > array[j + 1].during) {
                var temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            } else if (
                array[j].during === array[j + 1].during &&
                array[j].amount < array[j + 1].amount
            ) {
                var temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }
}
bubbleSort(rooms)
console.log(rooms);