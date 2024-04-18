const fs = require("fs");

function getNumbersFromFile(filename) {
  try {
    const data = fs.readFileSync(filename, "utf8");
    const foos = data
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .map(Number);
    return foos;
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
}

function getSum(foos) {
  return foos.reduce((acc, curr) => acc + curr, 0);
}

function getAverage(foos) {
  if (foos.length === 0) return 0;
  return getSum(foos) / foos.length;
}

function main() {
  const foos = getNumbersFromFile("numbers.txt");
  const total = getSum(foos);
  const average = getAverage(foos);

  console.log(`Sum: ${total}`);
  console.log(`Average: ${average}`);
}

main();
