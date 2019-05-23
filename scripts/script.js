var ALPHABET = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
var LINE_LENGTH = 8;
var DEBUG_MODE = 0;
var startTime = new Date();
var definition, word, imageState = 0, mainState;
var score = 0.0;

function pressLetter(e) {
	if (imageState > 5)
		return;

	if (e.classList.contains("btn-letter-inactive"))
		return;

	var letter = e.innerHTML.toLowerCase();
	e.classList.remove("btn-letter-active");
	e.classList.add("btn-letter-inactive");

	if (word.search(letter) == -1) { 
		imageState++; // letter doesn't exist
		document.getElementById("image-state").children[0].src = "img/" + imageState + ".png";

		if (imageState == 6)
			mainState = 0;
	} else {
		var gameState = document.getElementById("game-state"); // letter exists
		var needStop = true;

		for (var i = 0; i < word.length; i++) {
			if (word[i] == letter) {
				gameState.children[i].innerHTML = letter;
				gameState.children[i].classList.add("lime");
			}

			if (gameState.children[i].innerHTML == "*")
				needStop = false;
		}

		if (needStop == true)
			mainState = 1;
	}

	if (mainState != -1) { // game was stopped
		document.getElementById("image-state").style.display = "none";
		document.getElementById("text-state").style.display = "none";
		document.getElementById("text-message").style.display = "inline-block";

		var result = document.getElementById("text-message").children[1];
		let now = new Date();
    	let t = now - startTime;
    	var delta = 0;

    	if (mainState == 1) {
    		delta = Math.max(0.5, 1 - Math.floor(t / 1000) / 45);
    	}

    	score += delta;
    	document.getElementById("game-score").children[0].innerHTML = "Счёт: " + Math.floor(score * 100) / 100;	

    	var newRow = document.createElement("tr");
    	var dataWord = document.createElement("td");
    	var dataStatus = document.createElement("td"); 
    	var dataTime = document.createElement("td");
    	var dataScore = document.createElement("td");

    	dataWord.innerHTML = word;
    	dataTime.innerHTML = Math.floor(t / 100) / 10;
    	dataScore.innerHTML = "+" + Math.floor(delta * 100) / 100;

    	if (mainState == 1) {
    		dataStatus.innerHTML = "Выигрыш";
    		className = "bgactive";
    	} else {
    		dataStatus.innerHTML = "Проигрыш";
    		className = "bginactive";
    	}

    	dataStatus.classList = className;

    	newRow.appendChild(dataWord);
    	newRow.appendChild(dataStatus);
    	newRow.appendChild(dataTime);
    	newRow.appendChild(dataScore);

    	result.insertBefore(newRow, result.children[1]);

		result.style.textAlign = "center";
	}
}

function clearGameState() {
	document.getElementById("description").innerHTML = definition;

	var keyboard = document.getElementById("game-keyboard");
	var countOfKeyboardLayers = Math.floor((ALPHABET.length + LINE_LENGTH - 1) / LINE_LENGTH);

	keyboard.innerHTML = "";

	for (var i = 0; i < countOfKeyboardLayers; i++) { // adding keyboard layers
		var curTag = document.createElement("DIV");
		curTag.id = "keyboard-layer-" + i;

		keyboard.appendChild(curTag);
	}

	for (var i = 0; i < ALPHABET.length; i++) { // adding keyboard buttons with letters
		var curTag = document.createElement("DIV");
		curTag.classList.add("btn-letter");
		curTag.classList.add("btn-letter-active");
		curTag.innerHTML = ALPHABET[i];

		curTag.addEventListener("click", function() {
			pressLetter(this);
		});

		document.getElementById("keyboard-layer-" + Math.floor(i / LINE_LENGTH)).appendChild(curTag);
	}

	var gameState = document.getElementById("game-state"); // adding information about the word
	gameState.innerHTML = "";

	for (var i = 0; i < word.length; i++) {
		var curTag = document.createElement("BUTTON");
		curTag.classList.add("btn-word-letter");
		curTag.innerHTML = "*";

		gameState.appendChild(curTag);
	}
}

function checkWordDefinitionState() {
	if (document.getElementById("game-definition-checkbox").checked) {
		document.getElementById("word-description").style.display = "block"; // show word definition
	} else {
		document.getElementById("word-description").style.display = "none"; // hide word definition
	}
}

function startGame() { // starting game (picking random word and definition)
	var index = Math.floor(Math.random() * data.length);
	definition = data[index]["definition"];
	definition = definition.charAt(0).toUpperCase() + definition.slice(1);
	word = data[index]["word"];

	document.getElementById("game-start").children[0].innerHTML = "Начать заново";
	document.getElementById("timer").style.display = "block";

	startTime = new Date();
	imageState = 0;
	mainState = -1;
	document.getElementById("image-state").children[0].src = "img/0.png";

	document.getElementById("image-state").style.display = "inline-block";
	document.getElementById("text-state").style.display = "inline-block";
	document.getElementById("text-message").style.display = "none";

	checkWordDefinitionState();
	clearGameState();
}

function onReady() {
	document.getElementById("game-start").addEventListener("click", startGame);
	document.getElementById("game-definition-checkbox").addEventListener("change", checkWordDefinitionState);
	
	if (DEBUG_MODE == 1) {
		startGame();
	}
}

function keyPress(e) {
	var charCode = (typeof e.which == "number") ? e.which : e.keyCode;

	if ((charCode >= 1072) && (charCode <= 1103)) { // letter
		pressLetter(document.getElementsByClassName("btn-letter")[charCode - 1072]);
	}
	
	if (charCode == 13) { // enter
		startGame();
	}
}

document.addEventListener("DOMContentLoaded", onReady);
document.onkeypress = keyPress

var timer = setInterval(function() {
    let now = new Date();
    let t = now - startTime;

    document.getElementById("timer-header").innerHTML = "Прошло с начала (секунд): " + Math.floor(t / 100) / 10;
}, 100);
