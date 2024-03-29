console.log('Start');

const game = {
	word: '',
	lang: '',

	init(gameType) {
		console.info('Init.');
		if( ! this.lang ) {
			this.lang = 'all';
		}
		if( gameType == 'custom' ) {
			this.word = prompt("Enter a word", "");
			this.word = this.word.trim();
			this.gameType = gameType;
		} else {
			this.gameType = 'random';
		}
		if( ! this.word ) {
			this.word = this.randomWord();
		}
		this.vizStep = 0;
		this.death = 16;
		let old = document.getElementsByTagName('section');
		if( old && old[0] ) {
			old[0].remove();
		}
		let board = document.createElement('section');
		let game = document.getElementsByTagName('article')[0];
		game.appendChild(board);
		this.game = game;
		this.header = document.getElementsByTagName('header')[0];
		this.board = board;
		this.mask();
		this.letters = this.setLetters();
		this.populateLetters();
		this.vizInit();
		this.initToolBar();
		this.score = 0;
	},

	initToolBar() {
		let toolBar = document.createElement('div');
		toolBar.classList.add('toolbar');
		let customGame = document.createElement('button');
		customGame.type = 'button';
		customGame.textContent = '✍︎';
		customGame.addEventListener('click', function() {
			this.init('custom');
		}.bind(this));
		toolBar.appendChild(customGame);
		this.header.appendChild(toolBar);
		this.toolBar = toolBar;
	},

	mask() {
		let word = this.word;
		let masker = document.createElement('ol');
		masker.classList.add('mask');
		for( var i=0; i<word.length; i++ ) {
			let letter = document.createElement('li');
			console.log(word[i]);
			if( word[i] == ' ' ) {
				letter.classList.add('space');
			}
			masker.appendChild(letter);
		}
		this.masker = masker;
		this.fullScore = word.split(' ').join('').length;
		this.board.appendChild(masker);
	},

	populateLetters() {
		let letters = document.createElement('ol');
		letters.classList.add('letters');
		for( var i=0; i<this.letters.length; i++ ) {
			let letter = document.createElement('button');
			letter.type = 'button';
			letter.textContent = this.letters[i];
			letter.classList.add('letter-' + this.letters[i]);
			let letterHold = document.createElement('li');
			letterHold.appendChild(letter);
			letters.appendChild(letterHold);
		}
		this.board.appendChild(letters);
		letters.addEventListener('click',this.letterClick.bind(this));
	},

	setLetters() {
		var alphabets = [];
		var start = 'A'.charCodeAt(0);
		var last  = 'Z'.charCodeAt(0);
		for (var i = start; i <= last; ++i) {
			alphabets.push(String.fromCharCode(i));
		}
		if( this.lang == 'fi' || this.lang == 'all' ) {
			alphabets.push('Å');
			alphabets.push('Ä');
			alphabets.push('Ö');
		}
		if( this.lang == 'es' || this.lang == 'all' ) {
			alphabets.push('Ñ');
		}
		return alphabets;
	},

	letterClick(e) {
		let t = e.target;
		let word = this.word;
		word = word.toUpperCase();
		console.log(this);
		if( t.tagName == 'BUTTON' ) {
			t.disabled = true;
			let letter = t.textContent;
			console.log(word,letter);
			let pos = 0;
			let posses = [];
			console.log(word,letter,pos);
			let wordArray = word.split('');
			while( pos < word.length ) {
				if( wordArray[pos] == letter ) {
					posses.push(pos);
				}
				pos++;
			}
			if( posses.length ) {
				for( let i=0; i<posses.length; i++ ) {
					this.masker.children[posses[i]].textContent = letter;
					this.score++;
				}
				if( this.score == this.fullScore ) {
					this.win();
				}
			} else {
				this.visualize();
			}
		}
	},

	vizInit() {
		let viz = document.getElementsByTagName('svg')[0];
		let prog = viz.getElementsByClassName('progress')[0];
		let progLength = prog.children.length;
		for( var i=0; i<progLength; i++ ) {
			prog.children[i].removeAttribute('style');
		}
		this.death = progLength;
		this.viz = viz;
	},

	visualize() {
		this.vizStep++;
		if( this.vizStep < this.death ) {
			this.game.setAttribute('data-step',this.vizStep);

		} else {
			window.setTimeout( function() {
				this.die();
			}.bind(this),500);
		}
		let progress = this.viz.getElementsByClassName('progress')[0];
		progress.children[this.vizStep-1].setAttribute('style','opacity:1');
	},

	addWord(element) {
		let word = document.createElement('div');
		word.classList.add('word-repeat');
		word.textContent = this.word;
		element.appendChild(word);
	},

	die() {
		document.body.classList.add('death');
		let deathScreen = document.createElement('div');
		deathScreen.classList.add('death-screen');
		deathScreen.classList.add('screen');
		let heading = document.createElement('h1');
		heading.textContent = '☠';
		deathScreen.appendChild(heading);
		this.addWord(deathScreen);
		let reset = document.createElement('button');
		reset.textContent = 'New Game';
		reset.type = 'button';
		reset.addEventListener('click',function() {
			deathScreen.remove();
			this.init();
		}.bind(this));
		deathScreen.appendChild(reset);
		document.body.appendChild(deathScreen);
	},

	win() {
		document.body.classList.add('win');
		let winScreen = document.createElement('div');
		winScreen.classList.add('win-screen');
		winScreen.classList.add('screen');
		let heading = document.createElement('h1');
		heading.textContent = '✌︎';
		winScreen.appendChild(heading);
		this.addWord(winScreen);
		let reset = document.createElement('button');
		reset.textContent = 'New Game';
		reset.type = 'button';
		reset.addEventListener('click',function() {
			winScreen.remove();
			this.init();
		}.bind(this));
		winScreen.appendChild(reset);
		document.body.appendChild(winScreen);
	},

	randomWord() {
		let wordList = this.wordList();
		let random = Math.floor(Math.random() * wordList.length);
		return wordList[random];
	},

	wordList() {
		let list = [
			'koira',
			'kissa',
			'omena',
			'sydän',
			'apina',
			'sukset',
			'laskettelu',
			'koti',
			'krokotiili',
			'alligaattori',
			'leijona',
			'taiteilija',
			'kirahvi',
			'seepra',
			'matto',
			'televisio',
			'kerrostalo',
			'pallo',
			'manzana',
			'gato',
			'perro',
			'corazon',
			'naranja',
		];
		return list;
	}
}
game.init('random');
