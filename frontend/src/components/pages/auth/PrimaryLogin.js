import {useState,useContext} from 'react'
import Input from '../../form/Input'
import styles from '../../form/Form.module.css'
import { Context } from '../../../context/UserContext'
import { Link } from 'react-router-dom'

function PrimaryLogin(){

    const [user,setUser] = useState({})
    const {primaryLogin} = useContext(Context)

    function handleChange(evt){
        setUser({...user,[evt.target.name]:evt.target.value})
    }

    function handleSubmit(evt){
        evt.preventDefault()
        primaryLogin(user)
    }

    return(
        <section className={styles.form_container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input type='email' name='email' text='E-mail' placeholder='Digite seu e-mail aqui' handleOnChange={handleChange} />
                <Input type='password' name='password' text='Senha' placeholder='Digite sea senha  aqui' handleOnChange={handleChange} />
                <Input type='text' name='token' text='Token' placeholder='Digite o token enviado para seu e-mail' handleOnChange={handleChange} />
                <input type='submit' value='Entrar'/>
            </form>
            <p>Não tem conta  ?<Link to='/register'> Clique aqui </Link> </p>
        </section>
    )
}

export default PrimaryLogin