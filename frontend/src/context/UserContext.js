import { createContext, useState, useEffect, useRef } from "react"
import useAuth from "../hooks/useAuth"
import api from '../utils/api'
import io from 'socket.io-client'

const Context = createContext()

function UserProvider({ children }) {
    const { authenticated, register, logout, login, primaryLogin, ForgotPasswordUser, forgotPasswordLogin } = useAuth()
    const [messagesChats, setMessagesChats] = useState([{}]) //agrupo cada chat com suas mensagens
    const [notifications, setNotifications] = useState([])
    const [notificationsNew, setNotificationsNew] = useState([])
    const [unread, setUnRead] = useState(0)
    const [localUserId, setLocalUserId] = useState(() => {
        const storedUserId = localStorage.getItem('userId')
        return storedUserId ? storedUserId.replace(/"/g, '') : null
    })
    const [totalNotifications, setTotalNotifications] = useState(0)
    const [totalPagesNotifications, setTotalPagesNotifications] = useState(0)
    const [favoritepets, setFavoritePets] = useState([])
    const [totalPagesFavorite, setTotalPagesFavorite] = useState(1)
    const [favoritePetsNavbarShow,setFavoritePetsNavbarShow] = useState([])
    const [chatsActives, setChatsActives] = useState([])
    const [totalPagesActivesChats, setTotalPagesActivesChats] = useState(1)
    const socketInstance = useRef(null)

    async function getAllNotificationsNew(page) {
        console.log(`entrou getallnotificationNew com page : ${page}`)
        await api.get(`notifications/getallandto/${page}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((response) => {
            setNotificationsNew(response.data.notifications)
            setUnRead(response.data.unread)
        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })
    }

    async function getAllNotifications(page) {
        console.log(`entrou getallnotification com page : ${page}`)
        await api.get(`notifications/getallandto/${page}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((response) => {
            setNotifications(response.data.notifications)
            setTotalNotifications(response.data.totalNotifications)
            setTotalPagesNotifications(response.data.totalPages)
        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })
    }

    async function viewedNotificationAll(notification) {
        const data = await api.post(`notifications/viewedall/${notification._id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((response) => {
            return response.data
        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })
        console.log(`Notification all : ${JSON.stringify(data)}`)
    }

    async function viewedNotificationTo(notification) {
        console.log(`entrou em viewedto con notification id : ${JSON.stringify(notification._id).replace(/"/g, '')}`)
        const data = await api.post(`notifications/viewedto/${notification._id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((response) => {
            return response.data
        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })
        console.log(`response.data : ${JSON.stringify(data)}`)
    }

    async function viewedNotifications() {
        console.log(`entrou aqui com unread ${unread}  valor do localUserId ${localUserId}`)
        if (unread !== 0) {
            const updateNotification = notificationsNew.map(async (notification) => {
                if (notification.to === 'all') {

                    // A lógica aqui pode ser completada && notification.userviewed && notification.userviewed[0]

                    if (!notification.userviewed.includes(localUserId)) {
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
        getAllNotificationsNew(1)
    }

    async function getAllFavoritePets(page) {
        await api.get(`pets/favoritepets/${page}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((response) => {
            setFavoritePets(response.data.favoritePets)
            setTotalPagesFavorite(response.data.totalPages)
        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })
    }

    async function removeFavoritePet(id) {
        await api.patch(`/pets/removefavoritepet/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
            .then((response) => {
                setFavoritePets((prevPets) => prevPets.filter(pet => pet._id !== id))
                favoritePetsNavbar()
                console.log(`response : ${response.data.message}`)
            }).catch((Erro) => {
                return Erro.response.data
            })

    }

    async function favoritePetsNavbar(){
        await api.get(`pets/favoritepets/1`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((response) => {
            setFavoritePetsNavbarShow(response.data.favoritePets)
        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })
        
    }

    async function getAllActiveChats(page) {
        await api.get(`message/activechats/${page}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((response) => {
            setChatsActives(response.data.chats)
            setTotalPagesActivesChats(response.data.totalPages)
        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })
    }

    async function getMessagesChat(to, page) {
        await api.get(`message/getallmessagechat/${to}/${page}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((response) => {
            const newChat = {
                id: response.data.to,
                pages: [],
                messagesChat: response.data.messagesChat
            }

            setMessagesChats((prevMessagesChats) => {
                const existChat = prevMessagesChats.findIndex(chat => chat.id === newChat.id)

                if (existChat === -1) {
                    return [newChat, ...prevMessagesChats]
                }

                const updateChats = [...prevMessagesChats]
                const existingChatPages = updateChats[existChat] //obtenho referência do elemento dentro do array , como se fosse um ponteiro e que permiti eu modificar ele no array updateChats sem criar um novo array

                if (!existingChatPages.pages.includes(page)) {
                    existingChatPages.pages.push(page)
                    existingChatPages.messagesChat = [...existingChatPages.messagesChat, ...response.data.messagesChat]
                }

                return updateChats
            })

        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })

    }


    useEffect(() => {

        if (authenticated) {
            console.log(`valor do auth : ${authenticated}`)
            getAllNotificationsNew(1)
            getAllFavoritePets(1)
            getAllActiveChats(1)
            favoritePetsNavbar()

            socketInstance.current = io('http://localhost:5000') // Substituir pela URL do servidor
            socketInstance.current.emit('newUserCheck', localStorage.getItem('token').replace(/"/g, ''))
            socketInstance.current.on('newNotification', (newNotification) => {
                setNotificationsNew((prevNotifications) => [newNotification, ...prevNotifications]) //estrutura do react para calcular o novo valor com o append do anterior
                setUnRead((prevUnread) => prevUnread + 1)
            })
            socketInstance.current.on('newMessage', (newMessage) => {
                // setNewMessages((prevMessages)=>[newMessage,...prevMessages])
                // console.log(`enrtou aqui com newMessage : ${JSON.stringify(newMessage)}`)

            })

            return () => {
                if (socketInstance.current) {
                    socketInstance.current.disconnect()
                    socketInstance.current = null
                }
            }
        }

    }, [authenticated])

    return (
        <Context.Provider value={{ authenticated, register, logout, login, primaryLogin, ForgotPasswordUser, forgotPasswordLogin, viewedNotifications, getAllNotifications, getAllActiveChats, getMessagesChat, getAllFavoritePets,removeFavoritePet, totalPagesFavorite, favoritepets,favoritePetsNavbarShow, chatsActives, totalPagesActivesChats, notifications, notificationsNew, unread, totalNotifications, totalPagesNotifications, socketInstance: socketInstance.current }}>
            {children}
        </Context.Provider>
    )
}

export { Context, UserProvider }