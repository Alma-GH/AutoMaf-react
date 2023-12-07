export const shortWord = (word, length)=>{
  return word.length<=length ? word : word.slice(0,length) + "..."
}

export const nonTypeComparisonFlatObjects = (obj1, obj2)=>{

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if(keys1.length !== keys2.length)
    return false

  for(let key of keys1){
    if(!(key in obj2))
      return false
    if(obj1[key] != obj2[key])
      return false
  }

  return true
}