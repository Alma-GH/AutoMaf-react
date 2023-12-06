import {LOCAL_BASE_URL, S_ACCESS_TOKEN} from "../const";


class API {

    async register(username, password){
        try{
            const options = {
                method: "POST",
                headers:{ "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            }
            return fetch(`${LOCAL_BASE_URL}/register`, options)
        }catch (err){
            console.error(err)
        }
    }

    async login(username, password){
        try{
            const options = {
                method: "POST",
                headers:{ "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            }
            return fetch(`${LOCAL_BASE_URL}/login`, options)
        }catch (err){
            console.error(err)
        }
    }

    async getMe(){
        try{
            const token = localStorage.getItem(S_ACCESS_TOKEN)
            const options = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
            return fetch(`${LOCAL_BASE_URL}/me`, options)
        }catch (err){
            console.error(err)
        }
    }

}


export default new API();