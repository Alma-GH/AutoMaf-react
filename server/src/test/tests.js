
let arr = [0,1]

try {
  arr.push(3)
  throw new Error("mess")
}catch (e){
  console.log(e.message)
}

console.log(arr)