// Return a randomly chosen set of entries from a array
export function randomSetFromList(source, count) {
	// Based on shuffle function from http://stackoverflow.com/a/2450976
	// with a modification to limit the number chosen

	const working = [...source];  // need a copy we can modify
	let lastAvail = working.length;
	let result = new Array(count);
	let randomIndex;

	for (let i=0; i<count; ++i) {
		// pick our next entry
		randomIndex = Math.floor(Math.random() * lastAvail);

		// save it
		result[i] = working[randomIndex];

		// move our end pointer and replace the one we used with the
		// unused one from the end
		lastAvail -= 1;
		working[randomIndex] = working[lastAvail];
	}

	return result;
}


// Shuffle function from http://stackoverflow.com/a/2450976
export function shuffle(source) {
	const working = [...source];  // need a copy we can modify

	let currentIndex = working.length,
		temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = working[currentIndex];
		working[currentIndex] = working[randomIndex];
		working[randomIndex] = temporaryValue;
	}

	return working;
}
