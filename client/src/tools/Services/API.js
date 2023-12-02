import {LOCAL_BASE_URL, S_ACCESS_TOKEN} from "../const";


class API {

    async register(username, password){
        try{
            const body = JSON.stringify({ username, password })
            const res = await fetch(`${LOCAL_BASE_URL}/register`, {
                method: "POST",
                headers:{
                  "Content-Type": "application/json"
                },
                body
            })
            const json = await res.json()
            const token = json.accessToken
            token && localStorage.setItem(S_ACCESS_TOKEN, token)
            return json
        }catch (err){
            console.error(err)
        }
    }

    async login(username, password){
        try{
            const body = JSON.stringify({ username, password })
            const res = await fetch(`${LOCAL_BASE_URL}/login`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body
            })
            const json = await res.json()
            const token = json.accessToken
            token && localStorage.setItem(S_ACCESS_TOKEN, token)
            return json
        }catch (err){
            console.error(err)
        }
    }

    async getMe(){
        try{
            const token = localStorage.getItem(S_ACCESS_TOKEN)
            const res = await fetch(`${LOCAL_BASE_URL}/me`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const json = await res.json()
            return json
        }catch (err){
            console.error(err)
        }
    }

}


export default new API();