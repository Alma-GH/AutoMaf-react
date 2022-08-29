
let time = Date.now()

const tm = setInterval(()=>{
  const dif = Date.now() - time
  console.log(`ms = ${dif}`)
  if(dif>10000) clearInterval(tm)
},1000)