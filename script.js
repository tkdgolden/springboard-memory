const gameContainer = document.getElementById('game');

const COLORS = [
  'red',
  'blue',
  'green',
  'orange',
  'purple',
  'red',
  'blue',
  'green',
  'orange',
  'purple',
];

// never declared without var, let, or const.
const topScore = localStorage.getItem('topScore');

// it is considered a bad practice to commit console log (noise) statements to code base.

const date = localStorage.getItem('date');
// I assumed you meant topScore here instead of top.
if (topScore !== null && date !== null) {
  // use string template instead of regular string concat.
  document.querySelector('h3').innerText = `Top Score: ${topScore} on ${date}`;
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    const index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter -= 1;

    // And swap the last element with it
    const temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

const shuffledColors = shuffle(COLORS);
let counter = 0;

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement('div');

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    newDiv.setAttribute('id', counter);
    counter += 1;
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener('click', handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

let selected = [];
let timer = false;
let seconds;
let intervalId;

// sepcially in browsers don't call something before you define it,
// this was declared under the handleCardClick
function countTime() {
  timer = true;
  seconds = 1;
  intervalId = setInterval(() => {
    document.querySelector('h2').innerText = `Time Elapsed: ${seconds} seconds`;
    seconds += 1;
  }, 1000);
}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  if (timer === false) {
    countTime();
  }
  event.target.style.backgroundColor = event.target.classList.value;
  // note that in this particular instance the != to null was actually incorrectly handled
  // the return value was actually undefined not null, but it was still passing the same.
  if (selected.find((element) => element === event.target) !== undefined) {
    selected = [];
  }
  selected.push(event.target);
  let listDivs = event.target.parentElement.children;
  if (selected.length >= 2) {
    if (selected[0].classList.value === selected[1].classList.value) {
      selected = [];
    } else {
      for (let each of listDivs) {
        each.removeEventListener('click', handleCardClick);
      }
      setTimeout(function () {
        selected[0].style.backgroundColor = null;
        selected[1].style.backgroundColor = null;
        selected = [];
        for (let each of listDivs) {
          each.addEventListener('click', handleCardClick);
        }
      }, 1000);
    }
  }

  let correct = true;
  for (let each of listDivs) {
    if (each.style.backgroundColor === '') {
      correct = false;
    }
  }
  if (correct === true) {
    clearInterval(intervalId);
    if (topScore > seconds) {
      localStorage.setItem('topScore', seconds);
      localStorage.setItem('date', Date());
    }
  }
}

document.querySelector('button').addEventListener('click', () => {
  location.reload();
});

// when the DOM loads
createDivsForColors(shuffledColors);
