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
// const reels=[[],[],[]] // the spin // if columns number change the code is over 
const reels=[] // the spin // we make it dynamic
for(let i =0 ; i<COLS;i++)
{
    reels.push([])//after each column so we make it dynamic depend on colmuns number 
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

const transpose = (reels)=>{
    const rows =[];
    for(let i = 0 ; i<ROWS; i++){
        rows.push([]);
        for(let j = 0 ; j<COLS; j++){
            rows[i].push(reels[j][i])
        }
    }
    return rows;
}

const printRows = (rows)=>{

    for(const row of rows){
        let rowString = "";
        for(let i=0 ; i<row.length;i++){
            rowString += row[i];
            if(i != row.length-1){
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

const getWinnings=(rows , lines , bet)=>{
    let winnings = 0;

    for(let row=0; row<lines; row++){
        const symbols = rows[row];
        let allSsame=true;
        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSsame= false;
                break;
            }
        }
        if(allSsame){
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winnings;
}

const game=()=>{
let deposit_value = deposit();
while(true){
    console.log(`Your balance is : ${deposit_value} $`  ) ;

    let lines_count = getNumberOfLines();
    let totalBet = getBet(deposit_value,lines_count);
    let tmpBalance= deposit_value-totalBet;
    let spin_result = spin();
    let rowsToCol = transpose(spin_result);
    printRows(rowsToCol);

    let win_value = getWinnings(rowsToCol , lines_count , totalBet);
    tmpBalance += win_value;
    deposit_value = tmpBalance;
    console.log(`Your balance now is : ${deposit_value} $`  ) ;

    
    const playAgain = prompt("Do u want to continue playing ? (y/n)");
    if(playAgain != "y" || playAgain !="Y" || playAgain!= "yes" || playAgain!= "YES")
        break;
    }

}
