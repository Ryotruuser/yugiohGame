const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"), 
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
}

const pathImages = "./src/assets/icons/";

const cardData =[
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        Winof: [1],
        LoseOf: [2]
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        Winof: [2],
        LoseOf: [0]
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        Winof: [0],
        LoseOf: [1]
    }
]

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1){
        cardImage.addEventListener("mouseover", ()=>{
            drawSelectCard(idCard);
         });

        cardImage.addEventListener("click", ()=>{
            setCardField(cardImage.getAttribute("data-id"));
        });
        
    }


    return cardImage;
}

async function hiddenCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function setCardField(cardId){

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await hiddenCardDetails();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);

}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Draw";
    let playerCard= cardData[playerCardId];

    if(playerCard.Winof.includes(computerCardId)){
        duelResults = "Win";
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "Lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);
    return duelResults;
}

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function removeAllCardsImages(){
    let cards = state.playerSides.computerBox;
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img)=> img.remove());

    cards = state.playerSides.player1Box;
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img)=> img.remove());
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards (cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();

}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init(){
    drawCards(5,state.playerSides.player1);
    drawCards(5,state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();

    

}

init();