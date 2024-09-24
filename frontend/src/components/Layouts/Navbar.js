import { Link } from "react-router-dom"
import { useContext } from "react"
import Logo from '../../assets/img/logo.png'
import styles from './Navbar.module.css'
import { Context } from "../../context/UserContext"
import { useState,useEffect } from "react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faHeart } from '@fortawesome/free-solid-svg-icons'

function Navbar() {
    const { authenticated, logout } = useContext(Context)

    const [showFavorites, setShowFavorites] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)

    const toggleFavorites = () => setShowFavorites(!showFavorites)
    const toggleNotifications = () => setShowNotifications(!showNotifications)

    const favorites = ["Pet 1", "Pet 2", "Pet 3", "Pet 4", "Pet 5", "Pet 6"]
    const notifications = ["Notificação 1", "Notificação 2", "Notificação 3", "Notificação 4", "Notificação 5", "Notificação 6"]


    return (
        <nav className={styles.navbar}>
            <div >
                <Link className={styles.navbar_logo} to='/1'>
                    <img src={Logo} alt="logo Get A Pet"></img>
                    <h2>Get A Pet</h2>
                </Link>
            </div>
            <ul className={styles.navbar_ul}>
                {authenticated ? (
                    <>
                        <li className={styles.dropdown_container}>
                            <div onClick={toggleNotifications}>
                                <FontAwesomeIcon icon={faBell} size="lg" />
                            </div>
                            {showNotifications && (
                                <div className={styles.dropdown_menu}>
                                    <ul>
                                        {notifications.slice(0, 5).map((notif, index) => (
                                            <li key={index}>{notif}</li>
                                        ))}
                                    </ul>
                                    <Link to='/notifications' className={styles.show_more}>
                                        Mostrar mais
                                    </Link>
                                </div>
                            )}
                        </li>
                        <li className={styles.dropdown_container}>
                            <div onClick={toggleFavorites}>
                                <FontAwesomeIcon icon={faHeart} size="lg" />
                            </div>
                            {showFavorites && (
                                <div className={styles.dropdown_menu}>
                                    <ul>
                                        {favorites.slice(0, 5).map((fav, index) => (
                                            <li key={index}>{fav}</li>
                                        ))}
                                    </ul>
                                    <Link to='/pets/favorites' className={styles.show_more}>
                                        Mostrar mais
                                    </Link>
                                </div>
                            )}
                        </li>
                        <li>
                            <Link to='/1'>Adotar</Link>
                        </li>
                        <li>
                            <Link to='/pets/mypets'>Meus Pets</Link>
                        </li>
                        <li>
                            <Link to='/pets/myadoptions'>Adoções</Link>
                        </li>
                        <li>
                            <Link to='/user/profile'>Perfil</Link>
                        </li>
                        {/* <li>
                            <Link to='/pets/favorites'>
                                <FontAwesomeIcon icon={faHeart} size="lg" />
                            </Link>
                        </li>
                        <li>
                            <Link to='/notifications'>
                                <FontAwesomeIcon icon={faBell} size="lg" />
                            </Link>
                        </li> */}
                    
                        <li onClick={logout}>
                            Sair
                        </li>
                    </>) : (
                    <>
                        <li>
                            <Link to='/login'>Entrar</Link>
                        </li>
                        <li>
                            <Link to='/register'>Cadastrar</Link>
                        </li>
                    </>)
                }

            </ul>
        </nav>
    )
}

export default Navbar