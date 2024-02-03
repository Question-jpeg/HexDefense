// // const entities = [2];
// // console.log((entities.at(-1) ?? 0) + 1);

// const result = [
//   { name: "boba", value: 1 },
//   { name: "Igor", value: 10 },
//   { name: "Biba", value: 50 },
// ].reduce((prev, cur) => (cur.value > prev.value ? cur : prev), {
//   name: "none",
//   value: 0,
// });

// const obj = {1: 'a', 2: 'b', 3: {'test': 'a'}}
// console.log(obj[4]);
// console.log(Object.keys(obj));
// console.log(Object.values(obj));

// delete obj[1]
// console.log(obj);
// console.log(Boolean('0'));

// // console.log(result);

// console.log(Array.from(Array(3)).map(() => ({ test: 1 })));
// console.log(Number.parseInt(-2));

// const doubled = [2, 12]

// console.log(
//   [
//     [2, 10],
//     [4, 12],
//     [6, 20],
//   ].some((cur) => cur[0] === doubled[0] && cur[1] === doubled[1])
// );

// console.log([2, 12].toString() === [3, 12].toString());
// console.log([2, 12].toString());

// console.log(Boolean({}));

const intervals = [
  [1, 3],
  [3, 5],
  [2, 4],
];

const edges = intervals.flatMap((interval) => interval).sort();

let maxCount = 0
let maxInterval = []
for (let edge of edges) {
  let curCount = 0;

  for (let interval of intervals) {
    if (edge >= interval[0] && edge <= interval[1]) {
      curCount++;
    }
  }
  if (curCount > maxCount) {
    maxInterval = [edge];
    maxCount = curCount;
  } else if (curCount === maxCount && maxInterval.length === 1) {
    maxInterval.push(edge);
  }
}

console.log(maxInterval.reduce((prev, cur) => (prev + cur), 0) / 2)
// console.log(maxInterval);