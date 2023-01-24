const prompt = require('prompt-sync')();
const fs = require('fs');

let entered_word = ''
let word_correctness = ''
let gray_characters = ''
let yellow_characters = ''
let regexpString = ['', '', '', '', ''];
let words = []
let regexp;
let keep_playing = ''

console.log("Welcome to WordleHelper!");
console.log("If you have no characters, just press enter.");
console.log('For each character you entered, put the color you put in there as a letter')
console.log('Put a g for green, y for yellow and x for gray characters.')
console.log(`For example, in the word you entered ATONE, if the first 2 characters are green, third is yellow and the rest are gray, you would do: `)
console.log(`ATONE: ggyxx`);

while (true) {
  entered_word = prompt("Enter your word: ");
  word_correctness = prompt(`${entered_word}: `);

  entered_word = entered_word.toUpperCase().trim();
  word_correctness = word_correctness.toLowerCase().trim();

  for (let i = 0; i < entered_word.length; i++) {
    const e = entered_word[i];
    const w = word_correctness[i];
    if (w === 'x') {
      gray_characters += e
    }
    if (w === 'y') {
      yellow_characters += e
    }
  }

  for (let i = 0; i < entered_word.length; i++) {
    const e = entered_word[i];
    const w = word_correctness[i];
    switch (w) {
      case 'g':
        regexpString[i] = '[' + e + ']';
        break;
      case 'y':
        regexpString[i] = '[^' + e + gray_characters + ']';
        break;
      case 'x':
        regexpString[i] = '[^' + gray_characters + ']';
        break;
      default:
        throw 'Please enter g for green, y for yellow or x for gray.'
    }
  }
  console.log("The regexp is - " + regexpString)
  regexp = new RegExp(regexpString.join(''), 'g');
  const data = fs.readFileSync('words.txt', 'UTF-8');
  const lines = data.split(/\r?\n/);

  lines.join(' ').match(regexp).forEach(w => {
    if (!/\s/g.test(w)) {
      words.push(w);
    }
  })

  if (yellow_characters) {
    yellow_characters.split('').forEach(c => {
      words = words.filter(e => e.includes(c))
    })
  }

  console.log("Possible solutions are: ");
  console.dir(words.sort(), { maxArrayLength: null });
  words = []
};
