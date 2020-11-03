// game.js
// written by steve perjesi for voce digital
// steve@perjesi.com
// nov 2020

var questions = {};
questions['q1'] = 'Hay un muchacho y una muchacha en la clase de matemáticas.';
questions['q2'] = 'El maestro dice que los estudiantes necesitan un lápiz.';
questions['q3'] = 'Camila no tiene papel y Mateo tiene papel.';
questions['q4'] = 'Camila no tiene un libro de matemáticas y necesita un libro.';
questions['q5'] = 'Mateo no tiene un lápiz, no tiene una hoja de papel, y no tiene un libro.';
questions['q6'] = 'El maestro está furioso.';

// Globals
var List = [], Moves = 0;

// Methods
const Dropper = {
	allowDrop: (e) => {
	  // Prevent default action
	  e.preventDefault();
	},
	drag: (e) => {
	  // Pass the element ID
	  e.dataTransfer.setData("text", e.target.id);
	},
	drop: (e) => {
	  // Prevent default action
	  e.preventDefault();

	  let id = e.dataTransfer.getData("text"),
	  	ontoId = parseInt(e.target.id.replace("statment-", "")),
	  	withId = parseInt(id.replace("statment-", "")),
	  	list = this.List.slice();	// Clone our statements

	  for (let i = 0; i < list.length; i++) {
	  	if (ontoId === i) {
	  		// Swap the two <li> spots
	  		list[i] = list[withId];
	  		list[withId] = this.List[i];
	  		this.Moves++;
	  		break;	// All done, move along
	  	}
	  }

	  // Update the statements
	  this.List = list;

	  // Redraw board
	  drawboard(list);
	}
}

const Store = {
	getWins: () => {
	  return JSON.parse(window.sessionStorage.getItem("wins"));
	},
	saveWin: (num) => {
		let all = Store.getWins() || [],
			save = {
				wins: num,
				now: Date.now(),
			};
		all.push(save);
		
		// Update our session storage of Wins
		window.sessionStorage.setItem("wins", JSON.stringify(all.reverse()));
	}
}

// Functions
const randomize = () => {
	// Build an array of values
	let list = [];
	for (let n in questions) {
		list.push(questions[n]);
	}

	// Randomize/sort the array
	return list.sort(() => Math.random() - 0.5).reverse();
}

const showWinners = () => {
	let elem = document.getElementById("last5wins"),
		wins = Store.getWins() || [],
		len = (wins.length > 5) ? 5 : wins.length;

	elem.innerHTML = "";

	// List our last 5 winners
	for (let i = 0; i < len; i++) {
		let p = document.createElement("p"),
			w = wins[i].wins,
			d = new Date(wins[i].now);

		// Pretty up the date
		let datestring = `${(d.getMonth()+1)}-${d.getDate()}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
		p.innerHTML = `${w} moves on ${datestring}`;

		elem.appendChild(p);
	}

}

const checkWin = () => {
	let winTotal = this.List.length,
		winCount = 0;

	// Compare the order of our statements
	for (let i = 0; i < winTotal; i++) {
		if (this.List[i] === this.questions[`q${i+1}`]) {
			winCount++;
		}
	}

	if (winTotal === winCount) {
		// Statements are in order!
		let winner = document.getElementById("winner"),
			moves = document.getElementById("moves");
		winner.style.display = "block";
		moves.innerHTML = `Success in ${this.Moves} moves`;

		// Save our win
		Store.saveWin(this.Moves);

		// Update the list
		showWinners();
	}
}

const drawboard = (list) => {
	let ul = document.getElementById("list");

	ul.innerHTML = "";
	for (let i = 0; i < list.length; i++) {
		// Create the draggable <li>
		let li = document.createElement("li");
		li.setAttribute("draggable", true);
		li.setAttribute("id", `statment-${i}`);

		// Add the drag/drop event listenters
		li.addEventListener("dragstart", () => { Dropper.drag(event) });
		li.addEventListener("dragover", () => { Dropper.allowDrop(event) });
		li.addEventListener("drop", () => { Dropper.drop(event) });

		// Add a number prefix to be like an <ol>
		li.innerHTML = `${i+1}. ${list[i]}`;

		// Add the <li> to the <ul> in the view
		ul.appendChild(li);
	}

	// Did we win?
	checkWin();
}

// Reset the board
const restart = () => {
	let winner = document.getElementById("winner"),
		moves = document.getElementById("moves");
	winner.style.display = "none";
	moves.innerHTML = "";
	this.Moves = 0;
	this.List = [];
	start();
}

const start = () => {
	// Get a new random list of statements
	this.List = randomize();

	// Draw the list of statements
	drawboard(this.List);

	// Display any of our saved game results
	showWinners();
}