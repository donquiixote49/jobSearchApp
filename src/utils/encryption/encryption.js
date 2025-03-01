import CryptoJS from "crypto-js";

export const encrypt = ({plainText , secretKay = process.env.SECRET_KEY})=>{
    return CryptoJS.AES.encrypt(plainText,secretKay).toString()
}


export const decrypt =({cypherText,secretKay=process.env.SECRET_KEY})=>{
    return CryptoJS.AES.decrypt(cypherText,secretKay).toString(CryptoJS.enc.Utf8)

}