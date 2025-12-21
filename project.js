//1 deposit some money
// 2 determine number of lines to bet on
// 3 collect a bet amount
// 4 spin the slot machine
// 5 check if the user won
// 6 give user their winnings
// 7 play again

// package to (input) 
const prompt = require("prompt-sync")();

// 1 deopsit
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

const deposit_value = deposit();

console.log(deposit_value);