var cards = [];   //An empty array to store all the memory card elements.
var openedCards = []; // An empty array to store the currently opened cards.
var player1Score = 0; // A variable to store the score of player 1.
var player2Score = 0; // A variable to store the score of player 2.
var turn = 1; // A variable to keep track of the current player's turn.
var score1Div = document.getElementById("score1");  //A reference to the HTML element with the ID "score1".
var score2Div = document.getElementById("score2");  //A reference to the HTML element with the ID "score1".
var timerID; // Store the timer interval ID

//  adds an event listener to the form with the ID "myForm" for the "submit" event.
document.getElementById("myForm").addEventListener("submit", function(event) {
  event.preventDefault();
  var form = document.getElementById("myForm");
  var submittedNumber = parseInt(form.inputNumber.value);
  if (submittedNumber > 30) {
    alert("Input must be less than 30");
    return;
  }
  removeElementAndHisChildren(form);
  updateScores(); //init scores of both players

  var memoryCardsDiv = document.getElementById("memory-cards");
  
  for (var i = 0; i < submittedNumber; i++) {
    for (var j = 0; j < 2; j++) {
      var newCard = document.createElement("div");
      newCard.className = "image"+i;
      setImageToCardBack(newCard);
      cards.push(newCard); //adds newly created cards to 'cards' array.
    }
    cards = shuffleCards(cards);
    cards.forEach(element => {
      memoryCardsDiv.appendChild(element); // appends card element to container of cards in HTML.
      element.addEventListener("click", flipCardLogic); // adds event listener. card clicked--->flipCardLogic() method
    });
  }
});

//sets the background image of card element to the card back image.
function setImageToCardBack(newCard) {
  var cardBackUrl = "cards/card-back.png";
  newCard.style.backgroundImage = "url('" + cardBackUrl + "')"; //inline CSS
}

//handles the logic when a card is clicked or flipped.
 function flipCardLogic(event){
  var targetElement = event.target; 
  var className = targetElement.classList;
  var id = targetElement.id;  
  var cardFrontUrl = "cards/"+className+".jpg"; 
  var remainingTime = 30; 

  targetElement.style.backgroundImage = "url('" + cardFrontUrl + "')"; // sets background image of clicked card to front.
  //This effectively flips the card to reveal its front image.
  openedCards.push(targetElement);

  //start the timer when first card is clicked or when new turn begins
  if(openedCards.length===1 || timerID === null){
    clearInterval(timerID);
    timerID = setInterval(function(){
      remainingTime--;
      if(remainingTime === 0){
        clearInterval(timerID);
        //alternate the turn to the next player
        turn = turn === 1? 2 : 1;
        //reset the remaining time for the next player
        remainingTime=30;
        //update the turn display
        document.getElementById("turn").textContent = "Player "+turn+" turn";
        timerID = null; // Reset the timerID variable
      }
      //update the remaintin time display
      document.getElementById("timer").textContent = "Remaining Time: " +remainingTime+" seconds";
    }, 1000);
  }

  if(openedCards.length == 2){  //if 2 cards opened
    if(openedCards[0].className == openedCards[1].className){ //if player found a pair
      if(turn == 1) player1Score++;
      else player2Score++;

      updateScores(); 
    }else{
      //if pair is not found, flip card to back after 1.5 seconds.
      openedCards.forEach(card => {
        setTimeout(() => {
          setImageToCardBack(card);
        }, 1250);
      });
    } 

    //alternate turns between players
    turn = turn === 1 ? 2 : 1;
    
    openedCards = []; //reseting opened cards for the next turn.
    checkGameEnd();
  }

  //update HTML element to display whose turn it is.
  document.getElementById("turn").textContent = "player "+turn+" turn";
 }


function updateScores(){
  score1Div.textContent = "Player 1: "+player1Score;
  score2Div.textContent = "Player 2: "+player2Score;
}

// Remove the form element and its children from the DOM. 
// This removes the form from the page after it has been submitted.
function removeElementAndHisChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  element.remove();
}


function shuffleCards(cards) {
  var currentIndex = cards.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap it with the current element
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }

  return cards;
}

//checks if game has ended and who won
function checkGameEnd(){
  var totalPairs = cards.length /2;
  if(player1Score + player2Score === totalPairs){
    var result;
    if (player1Score > player2Score) {
      result = "Player 1 wins!";
    } else if (player2Score > player1Score) {
      result = "Player 2 wins!";
    }else{
      result = "It's a tie!";
    }

    //display the result to the user(alert).
    document.getElementById("result").textContent = result;
    clearInterval(timerID); //clear timer interval when game ended.
  }
}
 
