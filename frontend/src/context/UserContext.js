import { createContext, useState, useEffect } from "react"
import useAuth from "../hooks/useAuth"
import api from '../utils/api'
import io from 'socket.io-client'
import { json } from "react-router-dom"

const Context = createContext()

function UserProvider({ children }) {
    const { authenticated, register, logout, login, primaryLogin, ForgotPasswordUser, forgotPasswordLogin } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [unread, setUnRead] = useState(0)
    const [userId,serUserId] = useState(localStorage.getItem('userId').replace(/"/g, ''))

    async function getAllNotifications(page) {
        await api.get(`notifications/getallandto/${page}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((response) => {
            setNotifications(response.data.notifications)
            setUnRead(response.data.unread)
        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })
    }

    async function viewedNotificationAll(notification) {
        await api.post(`notifications/viewedall/${notification._id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((response) => {
            console.log(`Notification all : ${response.data.message}`)
        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })
    }

    async function viewedNotificationTo(notification) {
        await api.post(`notifications/viewedto/${notification._id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((response) => {
            console.log(`Notification to : ${response.data.message}`)
        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })

    }

    async function viewedNotifications() {
        if (unread !== 0) {
            console.log(`Notifications total : ${JSON.stringify(notifications)}`)
            
            const updateNotification = notifications.map(async (notification) => {
                if (notification.to === 'all') {
                    
                    // A lógica aqui pode ser completada && notification.userviewed && notification.userviewed[0]
                    if (!notification.userviewed.includes(userId)) {
                        console.log('userId:', userId, 'typeof userId:', typeof userId)
                        console.log('userviewed:', notification.userviewed, 'typeof elements:', notification.userviewed.map(v => typeof v))
                        console.log(`entrou em all com Notification ${JSON.stringify(notification)}`)
                        return viewedNotificationAll(notification)
                    }
                    
                } else {
                    if (notification.viewed === false) {
                        console.log(`entrou em to`)
                        return viewedNotificationTo(notification)
                    }
                }
            })
            // Espera todas as promessas serem resolvidas
            await Promise.all(updateNotification)
        }
        // Chama a função para pegar todas as notificações
        getAllNotifications(1)
    }
    

    useEffect(() => { 
        getAllNotifications(1)

        const socketInstance = io('http://localhost:5000') // Substitua pela URL do seu servidor
        
        socketInstance.on('newNotification', (newNotification) => {
            setNotifications((prevNotifications) => [newNotification, ...prevNotifications]) //estrutura do react para calcular o novo valor com o append do anterior
            setUnRead((prevUnread) => prevUnread + 1)
        })

        // const intervalId = setInterval(() => {
        //     getAllNotifications(1)
        //     return () => clearInterval(intervalId)
        // }, 300000)

        return () => {
            socketInstance.disconnect() // Desconectar o socket quando o componente for desmontado
        }
        
    }, [])

    return (
        <Context.Provider value={{ authenticated, register, logout, login, primaryLogin, ForgotPasswordUser, forgotPasswordLogin, notifications, unread, viewedNotifications }}>
            {children}
        </Context.Provider>
    )
}

export { Context, UserProvider }