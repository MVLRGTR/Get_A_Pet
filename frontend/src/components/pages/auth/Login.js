import {useState,useContext} from 'react'
import Input from '../../form/Input'
import styles from '../../form/Form.module.css'
import { Context } from '../../../context/UserContext'
import { Link } from 'react-router-dom'

function Login(){

    const [user,setUser] = useState({})
    const {login} = useContext(Context)

    function handleChange(evt){
        setUser({...user,[evt.target.name]:evt.target.value})
    }

    function handleSubmit(evt){
        evt.preventDefault()
        login(user)
    }

    return(
        <section className={styles.form_container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input type='email' name='email' text='E-mail' placeholder='Digite seu e-mail aqui' handleOnChange={handleChange} />
                <Input type='password' name='password' text='Senha' placeholder='Digite sua senha  aqui' handleOnChange={handleChange} />
                <input type='submit' value='Entrar'/>
            </form>
            <p>Não tem conta  ?<Link to='/register'> Clique aqui </Link> </p>
            <p>Precisa recuperar sua conta ?<Link to='/forgotpassword'> Clique aqui</Link> </p>
        </section>
        
    )
}

export default Login