
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


//class Game

function numPossibleVotes(all, maf){
  return Math.floor((all - maf*2)/2)
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