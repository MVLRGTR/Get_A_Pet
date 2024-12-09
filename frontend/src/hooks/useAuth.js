import api from '../utils/api'
import { useState, useEffect } from 'react'
import {  useNavigate } from 'react-router-dom'
import useFlashMessage from './useFlashMessage'

export default function useAuth(socketInstance) {

    const { setFlashMessage } = useFlashMessage()
    const [authenticated, setAuthenticated] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            try {
                api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
                setAuthenticated(true)
            } catch (error) {
                console.error("Erro ao analisar o token:", error)
                localStorage.removeItem('token')
            }
        }

    }, [])

    async function register(user) {

        let msgText = 'Cadastro Realizado com sucesso'
        let msgType = 'success'

        try {
            const data = await api.post('/users/register', user).then((response) => { return response.data })
            await authUser(data)
        } catch (erro) {
            msgText = erro.response.data.message
            msgType = 'error'
        }

        setFlashMessage(msgText, msgType)

    }

    async function authUser(data) {
        setAuthenticated(true)
        localStorage.setItem('token', JSON.stringify(data.token))
        localStorage.setItem('userId', JSON.stringify(data.userId))
        navigate('/1')
    }

    async function login(user) {
        let msgText = 'Login Realizado com sucesso !!!'
        let msgType = 'success'
        const msgErroPrimaryLogin = 'Por favor entre no seu e-mail e coloque o token infromado para validar a sua conta !'

        try {
            const data = await api.post('/users/login',user).then((response)=>{return response.data})
            await authUser(data)
        } catch (erro) {
            msgText = erro.response.data.message
            msgType = 'error'
            if(msgErroPrimaryLogin === erro.response.data.message){
                navigate('/login/primarylogin')
            }
        }
        setFlashMessage(msgText, msgType)
    }

    async function primaryLogin(user) {
        let msgText = 'Login Realizado com sucesso !!!'
        let msgType = 'success'
        const op = true

        try {
            const data = await api.post('/users/primarylogin',user).then((response)=>{return response.data})
            await authUser(data,op)
        } catch (erro) {
            msgText = erro.response.data.message
            msgType = 'error'
            console.log(erro)
        }
        setFlashMessage(msgText, msgType)
    }

    async function forgotPasswordLogin(user) {
        let msgText = 'Login Realizado com sucesso !!!'
        let msgType = 'success'
        const op = true

        try {
            const data = await api.post('/users/forgotpassword/login',user).then((response)=>{return response.data})
            await authUser(data,op)
        } catch (erro) {
            msgText = erro.response.data.message
            msgType = 'error'
            console.log(erro)
        }
        setFlashMessage(msgText, msgType)
    }

    async function ForgotPasswordUser(user) {
        let msgText = 'Email enviado com sucesso para o e-mail cadastrado !!!'
        let msgType = 'success'

        try {
            await api.post('/users/forgotpassword',user).then((response)=>{return response.data})
            navigate('/forgotpassword/login')
        } catch (erro) {
            msgText = erro.response.data.message
            msgType = 'error'
            console.log(erro)
        }
        setFlashMessage(msgText, msgType)
    }

    async function logout() {
        let msgText = 'Logout Realizado com sucesso !!!'
        let msgType = 'success'

        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined
        socketInstance.disconnect()

        navigate('/1')
        setFlashMessage(msgText, msgType)

    }

    return { authenticated, register, logout ,login ,primaryLogin,ForgotPasswordUser,forgotPasswordLogin}
}