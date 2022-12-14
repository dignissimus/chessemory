import { Chessground } from 'chessground';

enum Role {
    Rook = 'rook',
    Knight = 'knight',
    Bishop = 'bishop',
    Queen = 'queen',
    King = 'king',
    Pawn = 'pawn'
}

enum Colour {
    White = 'white',
    Black = 'black'
}

interface Piece {
    role: Role,
    colour: Colour
}

interface AmericanPiece {
    role: Role,
    color: Colour
}

const EMPTY_BOARD_FEN: string = '8/8/8/8/8/8/8/8 w KQkq - 0 1';
const DEFAULT_NUMBER_OF_PIECES: number = 3;

let currentPiece: Piece | undefined = { colour: Colour.White, role: Role.Pawn };
let canEdit: boolean = false;

const roleLookup: Map<string, Role> = new Map(
  [
    ['r', Role.Rook],
    ['n', Role.Knight],
    ['b', Role.Bishop],
    ['q', Role.Queen],
    ['k', Role.King],
    ['p', Role.Pawn],
  ],
);

const config = {
  viewOnly: true,
};

const chessground = Chessground(document.getElementById('board'), config);
let queue: string[] = [];

function toChessgroundPiece(piece: Piece): AmericanPiece {
  if (piece === undefined) {
    return undefined;
  }
  return {
    role: piece.role,
    color: piece.colour,
  };
}

function fetchPositions(numberOfPieces: number | string) {
  fetch(`/${numberOfPieces}`).then(
    (data) => data.text().then((fen) => { queue = fen.split('\n').slice(0, -1); }),
  );
}

function startCountdown() {

}

function showNextPosition() {
  canEdit = false;
  chessground.set({ fen: queue[0] });
  startCountdown();
  setTimeout(
    () => {
      chessground.set({ fen: EMPTY_BOARD_FEN });
      canEdit = true;
      document.getElementById('memory-box').style.visibility = 'visible';
    },
    3000,
  );
}

function compareFen(left: string, right: string) {
  return left.split(' ')[0] === right.split(' ')[0];
}

fetchPositions(DEFAULT_NUMBER_OF_PIECES);

window.addEventListener(
  'DOMContentLoaded',
  () => {
    document.getElementById('start-game').addEventListener(
      'click',
      () => {
        // sort takes a function that returns the difference between two numbers
        // Math.random() - 0.5 returns a negative number half the time
        //   and a positive number the other half of the time
        // This shuffles the array
        queue.sort((_left, _right) => Math.random() - 0.5);
        document.getElementById('introduction-box').style.visibility = 'hidden';
        showNextPosition();
      },
    );

    document.getElementById('check-answer').addEventListener(
      'click',
      () => {
        canEdit = false;

        const correctAnswer = queue[0];
        const userAnswer = chessground.getFen();
        document.getElementById('memory-box').style.visibility = 'hidden';
        if (compareFen(correctAnswer, userAnswer)) {
          document.getElementById('response-text').innerText = 'You were correct';
        } else {
          document.getElementById('response-text').innerText = 'You were not correct';
          chessground.set({ fen: correctAnswer });
        }
        document.getElementById('reveal-box').style.visibility = 'visible';
      },
    );

    document.getElementById('give-up').addEventListener(
      'click',
      () => {
        canEdit = false;

        document.getElementById('memory-box').style.visibility = 'hidden';
        document.getElementById('response-text').innerText = '';
        document.getElementById('reveal-box').style.visibility = 'visible';
        chessground.set({ fen: queue[0] });
      },
    );

    document.getElementById('give-up').addEventListener(
      'click',
      () => {

      },
    );

    document.getElementById('next-position').addEventListener(
      'click',
      () => {
        document.getElementById('reveal-box').style.visibility = 'hidden';
        queue.shift();
        showNextPosition();
      },
    );

    document.getElementById('number-of-pieces-slider').addEventListener(
      'input',
      (event: InputEvent) => {
        document.getElementById('number-of-pieces-text').innerText = (<HTMLInputElement>event.target).value;
      },
    );

    document.getElementById('save-settings').addEventListener(
      'click',
      () => {
        fetchPositions((<HTMLInputElement>document.getElementById('number-of-pieces-slider')).value);
        document.getElementById('settings-modal').style.display = 'none';
      },
    );

    document.getElementById('settings-icon').addEventListener(
      'click',
      () => {
        const settingsModal = document.getElementById('settings-modal');
        const settingsModalIsVisible = settingsModal.style.display !== 'none';
        settingsModal.style.display = settingsModalIsVisible ? 'none' : 'block';
      },
    );

    document.addEventListener(
      'keypress',
      (event: KeyboardEvent) => {
        if (event.key.toLowerCase() !== 'h') return;
        const helpModal = document.getElementById('help-modal');
        const helpModalIsVisible = helpModal.style.display !== 'none';
        helpModal.style.display = helpModalIsVisible ? 'none' : 'block';
      },
    );
  },
);

window.addEventListener(
  'keypress',
  (event: KeyboardEvent) => {
    const { key } = event;
    if (key.toLowerCase() === 'x') {
      currentPiece = undefined;
    }
    if (roleLookup.has(key.toLowerCase())) {
      const role: Role = roleLookup.get(key.toLowerCase());
      const colour: Colour = event.shiftKey ? Colour.White : Colour.Black;
      currentPiece = { colour, role };
    }
  },
);

window.addEventListener(
  'click',
  (event: MouseEvent) => {
    if (!canEdit) return;
    const coordinates: [number, number] = [event.clientX, event.clientY];
    const squareName = chessground.getKeyAtDomPos(coordinates);
    chessground.setPieces(new Map([[squareName, toChessgroundPiece(currentPiece)]]));
  },
);
