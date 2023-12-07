import {LOCAL_BASE_URL, PROD, S_ACCESS_TOKEN, SERVER_BASE_URL} from "../const";


class API {

    getAuthHeaders(){
        const token = localStorage.getItem(S_ACCESS_TOKEN)
        return {
            "Authorization": `Bearer ${token}`
        }
    }

    async register(username, password){
        try{
            const options = {
                method: "POST",
                headers:{ "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            }
            return fetch(`${PROD ? SERVER_BASE_URL : LOCAL_BASE_URL}/register`, options)
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
            return fetch(`${PROD ? SERVER_BASE_URL : LOCAL_BASE_URL}/login`, options)
        }catch (err){
            console.error(err)
        }
    }

    async getMe(){
        try{
            const options = { headers: { ...this.getAuthHeaders() } }
            return fetch(`${PROD ? SERVER_BASE_URL : LOCAL_BASE_URL}/me`, options)
        }catch (err){
            console.error(err)
        }
    }

    async getStatistic(){
        try{
            const options = { headers: { ...this.getAuthHeaders() } }
            return fetch(`${PROD ? SERVER_BASE_URL : LOCAL_BASE_URL}/statistic`, options)
        }catch (err){
            console.error(err)
        }
    }

}


export default new API();