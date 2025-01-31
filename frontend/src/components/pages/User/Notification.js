import styles from './Notifications.module.css'
import { useContext, useEffect } from 'react'
import { Context } from '../../../context/UserContext'
import { Link } from 'react-router-dom'

function Notifications() {
    const { notifications, authenticated , viewedNotifications,unread} = useContext(Context)

    console.log(`valor do notifications ${JSON.stringify(notifications)}`)
    useEffect(() => {
        viewedNotifications()
    }, [unread])

    return (
        <>
            {authenticated ? (
                notifications && notifications.length > 0 ? (
                    <section className={styles.notificationbox}>
                        <h1>Notificações</h1>
                        <article>
                            {notifications.map((notif, index) => (
                                
                                    <div className={styles.sectionnotification}>
                                        <Link to={`${notif.link}`} key={index} className={styles.linknotif}>
                                        <img src={notif.image} className={styles.imgnotification} alt="Notificação" />
                                        <div className={styles.divnotification}>
                                            <h2>{notif.type}</h2>
                                            <p>{notif.message}</p>
                                        </div>
                                        </Link>
                                    </div>
                               
                            ))}
                        </article>
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
