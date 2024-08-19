import api from '../utils/api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useFlashMessage from './useFlashMessage'

export default function useAuth() {

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
        navigate('/')
    }

    async function login(user) {
        let msgText = 'Login Realizado com sucesso !!!'
        let msgType = 'success'

        try {
            const data = await api.post('/users/login',user).then((response)=>{return response.data})
            await authUser(data)
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

        navigate('/')
        setFlashMessage(msgText, msgType)

    }

    return { authenticated, register, logout ,login }
}