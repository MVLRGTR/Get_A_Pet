import { Context } from "../../../context/UserContext"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import styles from './Chat.module.css'
import api from "../../../utils/api"
import useFlashMessage from "../../../hooks/useFlashMessage"
import { Link } from "react-router-dom"


function Chat() {

    const { authenticated ,socketInstance} = useContext(Context)
    const { id } = useParams()
    const [currentPage, setCurrentPage] = useState(1)
    const [messagesChat, setMessagesChat] = useState([])
    const [messageSend, setMessageSend] = useState('')
    const [userTo, setUserTo] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()

    async function getMessageChat(id, page) {
        await api.get(`message/getallmessagechat/${id}/${page}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setMessagesChat(response.data.messagesChat)
            setUserTo(response.data.userToChat)
        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })

    }

    async function changePage(shift) {
        setCurrentPage(currentPage + shift)
        getMessageChat(id, currentPage + shift)

    }

    async function sendMessage() {
        if (!messageSend.trim()) return
        const message = { message: messageSend, to: userTo._id }
        const msgText = 'Erro interno no Servidor , por favor tente mais tarde'

        if (messageSend.length > 0) {
            const data = await api.post(`/message/create`,message,{
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            }).then((response) => {
                setMessagesChat((prevMessages)=>[
                    ...prevMessages,response.data.NewMessageSend
                ])
                setMessageSend('')
                return response.data
            }).catch((erro) => {
                const msgType = 'erro'
                setFlashMessage(msgText, msgType)
                return erro.response.data
            })
        }

    }

    useEffect(() => {

        if (socketInstance) {
            socketInstance.on('newMessage', (newMessage) => {
                // console.log(`Nova mensagem recebida: ${JSON.stringify(newMessage)}`)
                setMessagesChat((prevMessages) => [
                    ...prevMessages, newMessage
                ])
            })
        }

        getMessageChat(id,currentPage)

        return () => {
            if (socketInstance) {
                socketInstance.off('newMessage')
            }
        }

    }, [currentPage])


    return (
        <>
            {authenticated ? (
                <section className={styles.chatContainer}>
                    <div className={styles.chatHeader}>
                        <img src={`${process.env.REACT_APP_API}images/users/${userTo.img}`} className={styles.imgchat}/>
                        <h2>{userTo.name || "Usuário"}</h2>
                    </div>

                    <div className={styles.chatMessages}>
                        {messagesChat.map((msg, index) => (
                            <div
                                key={index}
                                className={`${styles.message} ${msg.to !== userTo._id ? styles.otherMessage : styles.myMessage 
                                    }`}
                            >
                                <p>{msg.message}</p>
                                {/* <span>{new Date(msg.createdAt).toLocaleTimeString()}</span> */}
                                <span>{new Date(msg.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.chatInput}>
                        <input
                            type="text"
                            placeholder="Digite uma mensagem..."
                            value={messageSend}
                            onChange={(e) => setMessageSend(e.target.value)}
                        />
                        <button onClick={sendMessage}>Enviar</button>
                    </div>
                </section>
            ) :
                (
                    <section>
                        <h1>Você precisa estar logado para ver suas notificações</h1>
                        <div>
                            <Link to='/login'>Ir para o Login</Link>
                        </div>
                    </section>

                )}
        </>
    )
}

export default Chat