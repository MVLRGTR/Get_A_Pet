import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Context } from "../../../context/UserContext"
import styles from './ChatsActives.module.css'


function ActivesChats() {

    const { authenticated, chatsActives, totalPagesActivesChats, getAllActiveChats } = useContext(Context)

    const [currentPage, setCurrentPage] = useState(1)

    const navigate = useNavigate()
    // const { page } = useParams()

    async function changePage(page) {
        setCurrentPage(page)
        getAllActiveChats(page)
        navigate(`/activechats/${page}`)
    }

    return (
        <>
            {authenticated ?
                (
                    (chatsActives && chatsActives.length > 0 ?
                        (
                            <section className={styles.activechatbox}>
                                <h1>Chats</h1>
                                <section>
                                    {chatsActives.map((chat, index) => (
                                        <article key={index} className={styles.articlechat}>
                                            <Link to={`/chat/${chat.contact._id}`} className={styles.linkchat}>
                                                <img src={`${process.env.REACT_APP_API}/images/users/${chat.contact.img}`} alt={chat.contact.name} />
                                                <div className={styles.divchat}>
                                                    <h2>{chat.contact.name}</h2>
                                                    <div className={styles.boxmessage}>
                                                        <p>{chat.lastMessage}</p>
                                                        {chat.lastMessageFrom === chat.contact._id ?
                                                            <p className={styles.messageFrom}>Enviado de : {chat.contact.name}</p>
                                                            : null}
                                                    </div>
                                                </div>
                                            </Link>
                                        </article>
                                    ))
                                    }

                                </section>
                                {totalPagesActivesChats > 1 && (
                                    <footer className={styles.pagination}>
                                        <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>{'<'}</button>
                                        {(() => {
                                            const startPage = Math.max(currentPage - 10, 1)
                                            const endPage = Math.min(currentPage + 10, totalPagesActivesChats)
                                            return [...Array(endPage - startPage + 1).keys()].map(page => {
                                                const pageNumber = startPage + page
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        className={currentPage === pageNumber ? styles.active : ''}
                                                        onClick={() => changePage(pageNumber)}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                )
                                            })
                                        })()}
                                        <button disabled={currentPage === totalPagesActivesChats} onClick={() => changePage(currentPage + 1)}>{'>'}</button>
                                    </footer>
                                )}
                            </section>

                        ) :
                        (
                            <section>
                                <h1>Chats</h1>
                                <p>Você ainda não tem nenhuma conversa , caso queira inciar um nova conversar vá até o pet e mande uma mensagem para seu tutor</p>
                            </section>
                        ))
                ) :
                (
                    <section>
                        <h1>Você precisa estar logado para ver suas Mensagens</h1>
                        <div>
                            <Link to='/login'>Ir para o Login</Link>
                        </div>
                    </section>
                )}
        </>
    )

}

export default ActivesChats