const defaultState = {
  count: 0,

  func: ()=>false
}

const ADD = "ADD"
const GET = "GET"

const SET_FUNC = "SET_FUNC"

export const testReducer = (state=defaultState,action)=>{

  switch (action.type){
    case ADD:
      return {...state, count: state.count + action.payload}
    case GET:
      return {...state, count: state.count - action.payload}

    case SET_FUNC:
      return {...state, func: action.payload}

    default:
      return state
  }
}

export const getAddCountAction = (add)=>{return {type:ADD, payload:add}}
export const getGetCountAction = (get)=>{return {type:GET, payload:get}}
export const getSetFuncAction = (func)=>{return {type:SET_FUNC, payload:func}}