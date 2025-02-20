import { Context } from "../../../context/UserContext"
import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import styles from './Chat.module.css'

function Chat() {

    const { authenticated } = useContext(Context)
    const { id } = useParams()
    const [currentPage, setCurrentPage] = useState(1)
    const [messagesChat, setMessagesChat] = useState([])

    async function getMessageChat(id,page){
            await api.get(`message/getallmessagechat/${id}/${page}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((response) => {
            setMessagesChat(response.data.messagesChat)

        }).catch((Erro) => {
            console.log(`Erro : ${Erro}`)
        })

    }

    async function changePage(page) {
        // setCurrentPage(page)
        // getAllFavoritePets(page)
        // navigate(`/favoritepets/${page}`)
    }

    
    useEffect(() => {
        getMessageChat(currentPage)
    }, [currentPage])

    return (
        <>
            {authenticated ? (
                <section>

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