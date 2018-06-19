import * as Cards from "./Cards.js";
import * as GameLib from "./GameLib.js";

/*
 * Create a list that holds all of your cards
 */



/*
 * Display the cards on the page
 *   - pick 8 cards out of the list (for lists with a length longer than 8)
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function
 *    that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in
 *    another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this
 *      functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the
 *      card's symbol (put this functionality in another function that you call
 *      from this one)
 *    + increment the move counter and display it on the page (put this
 *      functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put
 *      this functionality in another function that you call from this one)
 */
function playGame() {
	// variables used to tell when the game is over
	const maxPairs = 8;
	let unmatchedPairs = maxPairs;

	// Boolean used to tell if two cards match
	let matched = false;

	// used to implement the move counter
	let moveCounter = 0;
	const moves = $('#moves');

	// Used to keep track of the clicked cards
	let currentCard;
	const currentCards = [];

	// Tells the system that it's waiting for the timeout to run
	let inTimeout = false;

	// Variables used to implement a timer
	var gameStart;
	let timer;
	const timerEl = document.getElementById('timer');

	// variables used to implement the star rating system
	const maxStars = 3;
	let starCount = maxStars;
	let nextStar;
	const stars = $('#stars');

	// Used to implement the winning modal
	const closeModal = document.getElementById('cancel');
	const nextGame = document.getElementById('newGame');
	const winDialog = document.getElementById('winner');

	// Selects the deck for the event listener
	const deck = $('#deck');

	// Selects the restart area, when a player wants to start a new game.
	const restart = $('#restart');

	function displayCards(cardSet) {
		let cards;

		// pick 8 cards to play
		cards = GameLib.randomSetFromList(cardSet, 8);

		// Now create and shuffle an array of 8 matching pairs.
		cards = GameLib.shuffle([...cards, ...cards]);

		// clear out the existing cards
		clearDeck();

		// Loop through the array and add the html
		for (let i = 0; i < cards.length; ++i) {
			const newCard = cards[i];
			deck.append(
				`<li class="card" data-card="${newCard}" data-id="${i}">
					<i class="${newCard}">
				</li>`
			);
		}
	}

	function formatNumber(num) {
		return (num < 10)
			? `0${num}`
			: `${num}`;
	}

	function formatElapsed(start) {
		const now = new Date();
		const elapsedSecs = (now - start) / 1000;
		const min = Math.trunc(elapsedSecs / 60);
		const sec = Math.trunc(elapsedSecs % 60);

		return `${formatNumber(min)} : ${formatNumber(sec)}`;
	}

	function displayElapsed(elem, start) {
		const elapsedStr = formatElapsed(start);
		elem.textContent = 'Time: ' + elapsedStr;
	}

	function startTimer(elem) {
		const start = new Date();

		displayElapsed(elem, start);

		timer = setInterval(function() {
			displayElapsed(elem, start);
		}, 1000);

		return start;
	}

	// return a string holding the amount of time the game took
	function stopTimer(start) {
		/* clear the stop watch using the setInterval( )
		   return value 'timer' as ID */
		clearInterval(timer);

		return formatElapsed(start);
	}

	// Check to see if the user has a match
	function check(array) {
		if (array[0][0].dataset.card === array[1][0].dataset.card) {
			return true;
		} else {
			return false;
		}
	}

	function clearArray(array) {
		let numItems = array.length;
		for (let i = 0; i < numItems; ++i) {
			array.pop();
		}
	}

	// Show the clicked cards
	function showCard(currentCard) {
		currentCard.addClass('up');
		currentCard.addClass('show');
	}

	//Update the moves moveCounter
	function updateMoveCounter() {
		moveCounter += 1;
		moves.text(`${moveCounter}`);
	}

	function updateStars() {
		switch (moveCounter) {
			case 31:
			case 41:
			case 55:
				nextStar = stars[0].children[0];
				nextStar.remove();
				starCount -= 1;
		}
	}

	function resetStars() {
		for (let i = starCount; i < maxStars; i++) {
			stars.append('<li><i class="fa fa-star"></i></li>');
		}
		starCount = maxStars;
	}

	function clearDeck() {
		deck.empty();
	}

	function gameWon() {
		const winningTime = stopTimer(gameStart);
		$('#winnerMessage').empty();
		$('#winnerMessage').append(
			`You won the game!  You did it with:
			<ul>
			<li>a time of ${winningTime}</li>
			<li> ${moveCounter} moves</li>
			</ul>
			<p>You earned ${starCount} stars.</p>`
		)

		winDialog.showModal();
		unmatchedPairs = maxPairs;
	}

	function invalidClick(currentCard, inTimeout) {
		//check to see if the target is a card
		if (currentCard[0].className !== 'card') {
			return true;
		}

		// Don't let the same card get selected twice
		if ((currentCards.length === 1) &&
			(currentCard[0].dataset.id === currentCards[0][0].dataset.id)) {
			return true;
		}

		// Don't let a matched card get selected
		if (currentCard[0].classList.contains('match')) {
			return true;
		}

		// Don't let more clicks register if waiting for the 2 second inTimeout
		if (inTimeout) {
			return true;
		}
		return false;
	}

	// Set up the Game
	function startGame(cardSet) {
		displayCards(cardSet);
		moveCounter = 0;
		moves.text(`${moveCounter}`);
		gameStart = startTimer(timerEl);

		resetStars();
	}

	startGame(Cards.baseCards);

	// Close the winning modal.
	closeModal.addEventListener('click', function() {
		winDialog.close();
	});

	// Start the next game from the winning modal.
	nextGame.addEventListener('click', function() {
		winDialog.close();
		startGame(Cards.baseCards);
	});

	// Set up event listener for the deck
	deck.on('click', function(e) {
		currentCard = $(e.target);

		// Check to see if it's an invalid click.
		if (invalidClick(currentCard, inTimeout)) {
			return;
		}

		showCard(currentCard);
		updateMoveCounter();
		updateStars();

		currentCards.push(currentCard);
		if (currentCards.length === 2) {
			matched = check(currentCards);

			if (matched) {
				currentCards[0].addClass('match');
				currentCards[1].addClass('match');
				unmatchedPairs -= 1;
				clearArray(currentCards);
				if (unmatchedPairs === 0) {
					gameWon();
				}
			} else {
				inTimeout = true;

				setTimeout(function() {
					for (let i = 0; i < currentCards.length; ++i) {
						currentCards[i].removeClass('up');
						currentCards[i].removeClass('show');
					}
					clearArray(currentCards);
					inTimeout = false;
				}, 1000);
			}
		}
	});

	restart.on('click', function() {
		startGame(Cards.baseCards);
	});
}


$(document).ready(playGame);
