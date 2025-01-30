import styles from  './Notifications.module.css'
import { useState,useEffect ,useContext} from 'react'
import { Context } from '../../../context/UserContext'
import { Link } from 'react-router-dom'

function Notifications(){

    const {notifications,totalNotifications,unread,totalPages,viewedNotifications,authenticated,} = useContext(Context)

    console.log(`valor do notifications ${JSON.stringify(notifications)} valor totalNotifications ${totalNotifications} e total pages ${totalPages}`)

    return(
        <>
            {authenticated ? (
            <section>
                <h1>Notificações</h1>
                <article>
                    {notifications.map((notif,index)=>(
                        <Link to={`${notif.link}`} key={index}>
                            <div>
                                <img src={notif.image}></img>
                                <div>
                                    <h2>{notif.type}</h2>
                                    <p>{notif.message}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </article>
            </section>) 
            :(
            <section>
                <h1>Você precisa está logado para ver notificações</h1>
                <div>
                    <Link to='/login'>Ir para o Login</Link>
                </div>
            </section>
            )
        }
        </>
    )
}

export default Notifications