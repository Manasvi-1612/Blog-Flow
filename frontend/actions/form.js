import fetch from "isomorphic-fetch";
const host = "http://localhost:8000/api"

export const emailContactForm = async (data) => {
    
    let url 
    if(data.authorMail){
        console.log(data.authorMail)
        url = `${host}/user/contact`
    }else{
        url = `${host}/contact`
    }

    try {
        const response = await fetch(`${url}`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)  //sending form-data
            })
        const res = await response.json()
        return res

    } catch (err) {
        console.log(err)
    }

}