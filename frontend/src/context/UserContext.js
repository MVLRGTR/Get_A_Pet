import { createContext, useState, useEffect } from "react"
import useAuth from "../hooks/useAuth"
import api from '../utils/api'

const Context = createContext()

function UserProvider({ children }) {
    const { authenticated, register, logout, login, primaryLogin, ForgotPasswordUser, forgotPasswordLogin } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [unread, setUnRead] = useState(0)

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
        await api.get(`notifications/viewedall/${notification.id}`, {
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
        await api.get(`notifications/viewedto/${notification}`, {
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
        notifications.map((notification) => {
            if (notification.to === 'all') {
                viewedNotificationAll(notification)
            }
            else {
                viewedNotificationTo(notification)
            }
        })
        getAllNotifications(1)
    }

    useEffect(() => { 
        getAllNotifications(1)
        const intervalId = setInterval(() => {
            getAllNotifications(1)
            return () => clearInterval(intervalId)
        }, 300000)
    }, [])

    return (
        <Context.Provider value={{ authenticated, register, logout, login, primaryLogin, ForgotPasswordUser, forgotPasswordLogin, notifications, unread, viewedNotifications }}>
            {children}
        </Context.Provider>
    )
}

export { Context, UserProvider }