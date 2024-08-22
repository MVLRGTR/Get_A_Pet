import {useState,useContext} from 'react'
import Input from '../../form/Input'
import styles from '../../form/Form.module.css'
import { Context } from '../../../context/UserContext'
import { Link } from 'react-router-dom'

function ForgotPassword(){

    const [user,setUser] = useState({})
    const {ForgotPasswordUser} = useContext(Context)

    function handleChange(evt){
        setUser({email:evt.target.value})
    }

    function handleSubmit(evt){
        evt.preventDefault()
        ForgotPasswordUser(user)
    }

    return(
        <section className={styles.form_container}>
            <h1>Recuperação de Senha</h1>
            <form onSubmit={handleSubmit}>
                <Input type='email' name='email' text='E-mail' placeholder='Digite seu e-mail aqui ' handleOnChange={handleChange} />
                <input type='submit' value='Enviar'/>
            </form>
            <p>Não tem conta  ?<Link to='/register'> Clique aqui </Link> </p>
        </section>
    )
}

export default ForgotPassword