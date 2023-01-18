const {getRandomInt} = require("./func.js");

//class Game

function numPossibleVotes(all, maf){
  return Math.ceil((all - 1 - maf*2)/2)
}

function getSomeRandomInt(max,nRand){
  /** 1 to max **/

  let arrNum      = [...Array(max).keys()]
  let arrRandNum  = []

  while(nRand){
    arrRandNum.push(arrNum.splice(getRandomInt(max--),1)[0]+1)
    nRand--
  }

  return arrRandNum
}





module.exports = {numPossibleVotes, getSomeRandomInt}