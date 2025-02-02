import styles from './Notifications.module.css'
import { useContext, useEffect, useState } from 'react'
import { Context } from '../../../context/UserContext'
import { Link, useParams, useNavigate, json } from 'react-router-dom'

function Notifications() {
    const { notifications, totalPagesNotifications, viewedNotifications, getAllNotifications, authenticated, unread } = useContext(Context)
    const [currentPage, setCurrentPage] = useState(1)

    const navigate = useNavigate()
    const { page } = useParams()

    async function changePage(page) {
        setCurrentPage(page)
        getAllNotifications(page)
        navigate(`/notifications/${page}`)
    }

    function viewNotifications(){
        viewedNotifications()
    }

    useEffect(() => {
        const pageNumber = page ? parseInt(page) : 1
        console.log(`valor unread : ${unread}`)
        getAllNotifications(pageNumber)
    }, [page])

    return (
        <>
            {authenticated ? (
                notifications && notifications.length > 0 ? (
                    <section className={styles.notificationbox}>
                        <h1>Notificações</h1>
                        <button className={styles.butonabout} onClick={viewNotifications}>Ler Notificações</button>
                        <article>
                            {notifications.map((notif, index) => (

                                <div className={styles.sectionnotification} key={index} >
                                    <Link to={`${notif.link}`} className={styles.linknotif}>
                                        <img src={notif.image} className={styles.imgnotification} alt="Notificação" />
                                        <div className={styles.divnotification}>
                                            <h2>{notif.type}</h2>
                                            <p>{notif.message}</p>
                                        </div>
                                    </Link>
                                </div>

                            ))}
                        </article>
                        {totalPagesNotifications > 1 && (
                            <footer className={styles.pagination}>
                                <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>{'<'}</button>
                                {/* {[...Array(totalPages).keys()].map(page => (
                                                <button key={page + 1} className={currentPage === page + 1 ? styles.active : ''} onClick={() => changePage(page + 1)}>
                                                    {page + 1}
                                                </button>
                                            ))} */}
                                {(() => {
                                    const startPage = Math.max(currentPage - 10, 1)
                                    const endPage = Math.min(currentPage + 10, totalPagesNotifications)
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
                                <button disabled={currentPage === totalPagesNotifications} onClick={() => changePage(currentPage + 1)}>{'>'}</button>
                            </footer>
                        )}
                    </section>
                ) : (
                    <section>
                        <h1>Você não tem notificações no momento</h1>
                    </section>
                )
            ) : (
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

export default Notifications
