import { createContext, useState, useEffect, useRef } from "react"
import useAuth from "../hooks/useAuth"
import api from '../utils/api'
import io from 'socket.io-client'

const Context = createContext()

function UserProvider({ children }) {
    const { authenticated, register, logout, login, primaryLogin, ForgotPasswordUser, forgotPasswordLogin } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [unread, setUnRead] = useState(0)
    const [userId, setUserId] = useState(localStorage.getItem('userId').replace(/"/g, ''))
    const [favoritepets,setFavoritePets] = useState([])
    const socketInstance = useRef(null)

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

    async function getAllUserFavoritePets(page) {
        await api.get(`pets/favoritepets/${page}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((response) => {
            setFavoritePets(response.data.favoritePets)
        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })
    }


    useEffect(() => {

        if (authenticated) {
            console.log(`valor do auth : ${authenticated}`)
            getAllNotifications(1)
            getAllUserFavoritePets(1)

            socketInstance.current = io('http://localhost:5000') // Substitua pela URL do seu servidor

            socketInstance.current.on('newNotification', (newNotification) => {
                setNotifications((prevNotifications) => [newNotification, ...prevNotifications]) //estrutura do react para calcular o novo valor com o append do anterior
                setUnRead((prevUnread) => prevUnread + 1)
            })

            return () => {
                socketInstance.current.disconnect() // Desconectar o socket quando o componente for desmontado
            }
        }
        

        // getAllNotifications(1)

        // socketInstance.current = io('http://localhost:5000') // Substitua pela URL do seu servidor

        // socketInstance.current.on('newNotification', (newNotification) => {
        //     setNotifications((prevNotifications) => [newNotification, ...prevNotifications]) //estrutura do react para calcular o novo valor com o append do anterior
        //     setUnRead((prevUnread) => prevUnread + 1)
        // })

        // const intervalId = setInterval(() => {
        //     getAllNotifications(1)
        //     return () => clearInterval(intervalId)
        // }, 300000)

    }, [])

    return (
        <Context.Provider value={{ authenticated, register, logout, login, primaryLogin, ForgotPasswordUser, forgotPasswordLogin, notifications, unread, viewedNotifications, socketInstance: socketInstance.current ,favoritepets}}>
            {children}
        </Context.Provider>
    )
}

export { Context, UserProvider }