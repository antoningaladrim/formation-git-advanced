const fs = require("fs");

function function_that_reads_and_parses_numbers_from_a_text_file(filename) {
  try {
    const data = fs.readFileSync(filename, "utf8");
    const numbers = data
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .map(Number);
    return numbers;
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
}

function function_that_computes_the_sum_of_an_array_of_numbers(numbers) {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

function function_that_calculates_the_average_of_an_array_of_numbers(numbers) {
  if (numbers.length === 0) return 0;
  return (
    function_that_computes_the_sum_of_an_array_of_numbers(numbers) /
    numbers.length
  );
}

function main() {
  const numbers =
    function_that_reads_and_parses_numbers_from_a_text_file("numbers.txt");
  const total = function_that_computes_the_sum_of_an_array_of_numbers(numbers);
  const average =
    function_that_calculates_the_average_of_an_array_of_numbers(numbers);

  console.log(`Sum: ${total}`);
  console.log(`Average: ${average}`);
}

main();
