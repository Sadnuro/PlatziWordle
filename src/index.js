/**
 * Aplicación de fromEvent en PlatziWordle:
 * fromEvent nos ayuda a atrapar eventos generados por elementos en el DOM.
 */

import { fromEvent, Subject } from "rxjs";
import WORDS_LIST from './wordsList.json';

const letterRows = document.getElementsByClassName('letter-row');
const messageText = document.getElementById('message-text')
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer = [];
const getRandomWord = () => WORDS_LIST[ Math.floor(Math.random() * WORDS_LIST.length) ]
const rightWord = getRandomWord();
console.log(rightWord)

// Declare Observable
const onKeyDown$ = new fromEvent(document, 'keydown');
const userWinOrLoose$ = new Subject();

// Declare Observer
const insertLetter = {
    next: (event) => {
        const pressedKey = event.key.toUpperCase();
        if (pressedKey.length === 1 && pressedKey.match(/[a-z]/i)){
            let letterBox = Array.from(letterRows)[letterRowIndex].children[letterIndex];
            letterBox.textContent = pressedKey;
            letterBox.classList.add("filled-letter");
            letterIndex++;
            userAnswer.push(pressedKey);
        } /*else if(pressedKey === "BACKSPACE"){
            letterIndex--;
            let letterBox =
            Array.from(letterRows)[letterRowIndex].children[letterIndex];
            
            letterBox.textContent = ""
            letterBox.classList.remove("filled-letter")
        }*/
    }
}

const deleteLetter = {
    next: (event) => {
        const pressedKey = event.key;
        if (pressedKey === 'Backspace' && letterIndex !== 0) {
            let currentRow = letterRows[letterRowIndex];
            let letterBox = currentRow.children[letterIndex -1];
            letterBox.textContent = '';
            letterBox.classList.remove("filled-letter");
            letterIndex--;
            userAnswer.pop();
        }
    }
}

const checkWord = {
    next: (event) => {
        if (event.key === 'Enter') {
            if (userAnswer.length < 5) {
                messageText.textContent = '¡Te faltan alguanas letras!';
                return;
            }
            
            for (let i = 0; i < 5; i++) {
                let letterColor = "";
                let letterBox = Array.from(letterRows)[letterRowIndex].children[i];
                console.log('letterBox', letterBox)
                let letterPosition = Array.from(rightWord).indexOf(userAnswer[i]);
                console.log(letterPosition)

                if(letterPosition === -1) {
                    letterColor = "letter-grey";
                } else if (letterPosition === i) {
                    letterColor = "letter-green";
                } else {
                    letterColor = "letter-yellow";
                }
                letterBox.classList.add(letterColor);

            }
            
            letterIndex = 0;
            userAnswer = [];
            letterRowIndex++;

            if(userAnswer.join("") === rightWord){
                userWinOrLoose$.next();
            }
        } else {
        }
    }
}


onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(checkWord);
onKeyDown$.subscribe(deleteLetter);

userWinOrLoose$.subscribe( () => {
    let letterRowsWinned = Array.from(letterRows)[letterRowIndex];
    console.log(letterRowsWinned)

    for (let i = 0; i < 5; i++) {
        letterRowsWinned.children[i].classList.add('letter-green');

    }
} )