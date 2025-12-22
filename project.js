//1 deposit some money
// 2 determine number of lines to bet on
// 3 collect a bet amount
// 4 spin the slot machine
// 5 check if the user won
// 6 give user their winnings
// 7 play again

// package to (input) 
const prompt = require("prompt-sync")();




//4 spin
const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT ={
    A:2,
    B:4,
    C:6,
    D:8
}

const SYMBOLS_VALUES ={
    A:5,
    B:4,
    C:3,
    D:2
}


// 1 deopsit  //what user have to put
const deposit = ()=>{
    while(true){
    const deopsit_amount = prompt("Enter a deposit amount: ")
    const deopsit_amount_float = parseFloat(deopsit_amount);
    // console.log(deopsit_amount_float)
    if(isNaN(deopsit_amount_float)||deopsit_amount_float<=0){
        console.log("invalid deposit. please try again");
        }
    else{
        return deopsit_amount_float
    }
    }
}
// 2 the lines number that user bet on 
const getNumberOfLines = ()=>{
    while(true){
    const lines = prompt("Enter number of lines to bet on (1-3): ")
    const numbersOfLines = parseInt(lines)
    // console.log(deopsit_amount_float)
    if(isNaN(numbersOfLines)||numbersOfLines<=0||numbersOfLines>3){
        console.log("invalid deposit. please try again");
        }
    else{
        return numbersOfLines
    }
    }
}

// 3 the amount that user bet with should be less then his deposit
const getBet = (deposit_value,linesCount)=>{
    while(true){
    const bet = prompt("Enter Total bet per lines: ")
    const betValue = parseFloat(bet)
    // console.log(deopsit_amount_float)
    if(isNaN(betValue)||betValue<=0||betValue>deposit_value/linesCount){
        console.log("invalid bet. please try again");
        }
    else{
        return betValue
    }
    }
}

//4 spin
const spin = ()=>{
let symbols=[]

for(const [symbol,count] of Object.entries(SYMBOLS_COUNT)){
    for(let i =0;i<count;i++){
        symbols.push(symbol);
    }
}
// console.log(symbols);
const reels=[[],[],[]] // the spin 
for(let i =0 ; i<COLS;i++)
{
    const reelSymbols=[...symbols]; // after each column stop we remove the its values
    for(let j =0 ; j<ROWS;j++){
        const randomIndex = Math.floor(Math.random()*reelSymbols.length)
        // console.log(randomIndex);
        const selectedIndex=reelSymbols[randomIndex];
        reels[i].push(selectedIndex); // column by column
        reelSymbols.splice(randomIndex,1); // remove the value that appeared after each column
    }
}
return reels;
}

let spin_result = spin();
console.log(spin_result);

let deposit_value = deposit();
let lines_count = getNumberOfLines();
let totalBet = getBet(deposit_value,lines_count);


console.log(deposit_value , lines_count , totalBet);