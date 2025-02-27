import { Context } from "../../../context/UserContext"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import styles from './Chat.module.css'
import api from "../../../utils/api"
import useFlashMessage from "../../../hooks/useFlashMessage"
import { Link } from "react-router-dom"


function Chat() {

    const { authenticated, socketInstance } = useContext(Context)
    const { id } = useParams()
    const [currentPage, setCurrentPage] = useState(1)
    const [messagesChat, setMessagesChat] = useState([])
    const [messageSend, setMessageSend] = useState('')
    const [limitMessages,setLimitMessages] =useState()
    const [userTo, setUserTo] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()

    async function getMessageChat(id, page) {
        const data = await api.get(`message/getallmessagechat/${id}/${page}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            if (response.data.messagesChat.length !== 0) {
                setMessagesChat(response.data.messagesChat)
                setUserTo(response.data.userToChat)
                setLimitMessages(response.data.limitMessagesPage)
            }
            return response.data.messagesChat
        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })
        return data
    }

    function sizeControl(){
        if(messagesChat.length > limitMessages){
            setMessagesChat((prevMessages)=>{
                let messages = [...prevMessages]
                messages.pop()
                return messages
            })
        }
    }

    async function changePage(shift) {
        const changeChat = await getMessageChat(id,currentPage + shift)
        if(changeChat && changeChat.length !== 0 ){
            setCurrentPage(currentPage + shift)
        }else{
            console.log(`entrou aqui no else`)
            let msgText = 'Não existem mais menssagens para serem carregadas'
            let msgType = 'error'
            setFlashMessage(msgText, msgType)
        }

    }

    async function sendMessage() {
        if (!messageSend.trim()) return
        const message = { message: messageSend, to: userTo._id }
        const msgText = 'Erro interno no Servidor , por favor tente mais tarde'

        if (messageSend.length > 0) {
            const data = await api.post(`/message/create`, message, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            }).then((response) => {
                setMessagesChat((prevMessages) => [
                    ...prevMessages, response.data.NewMessageSend
                ])
                setMessageSend('')
                return response.data
            }).catch((erro) => {
                const msgType = 'erro'
                setFlashMessage(msgText, msgType)
                return erro.response.data
            })
        }
        sizeControl()
    }

    useEffect(() => {

        getMessageChat(id, currentPage)

        if (socketInstance) {
            socketInstance.on('newMessage', (newMessage) => {
                // console.log(`Nova mensagem recebida: ${JSON.stringify(newMessage)}`)
                setMessagesChat((prevMessages) => [
                    ...prevMessages, newMessage
                ])
            })
        }

        return () => {
            if (socketInstance) {
                socketInstance.off('newMessage')
            }
        }

    }, [currentPage,messagesChat])


    return (
        <>
            {authenticated ? (
                <section className={styles.chatContainer}>
                    <div className={styles.chatHeader}>
                        {/* <img src={`${process.env.REACT_APP_API}images/users/${userTo.img}`} className={styles.imgchat}/> */}
                        {userTo.img ? (
                            <img src={`${process.env.REACT_APP_API}images/users/${userTo.img}`} className={styles.imgchat} />
                        ) : (
                            <img src="/default-profile.png" className={styles.imgchat} alt="Imagem padrão" />
                        )}
                        <h2>{userTo.name || "Usuário"}</h2>
                    </div>

                    <div className={styles.chatMessages}>
                        <button className={styles.shiftmore} onClick={()=>changePage(1)}>Mostrar mais antiga</button>
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
                        {currentPage > 1 && 
                    (<button className={styles.shiftmore} onClick={()=>changePage(-1)}>Mostrar mais recente</button>) }
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