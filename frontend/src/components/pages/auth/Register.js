import Input from "../../form/Input"
import styles from '../../../components/form/Form.module.css'
import { Link } from "react-router-dom"
import { useContext, useState } from "react"

/*context*/
import { Context } from "../../../context/UserContext"

function Register(){

    const [user,setUser] = useState({})
    const {register} = useContext(Context)

    function handleChange(event){
        setUser({...user,[event.target.name]:event.target.value})
    }

    function handleSubmit(event){
        event.preventDefault() //para e execução do formulario
        console.log(user)
        register(user)
    }
    return(
        <section className={styles.form_container}>
            <h1>Registrar</h1>
            <form onSubmit={handleSubmit}>
                <Input text='Nome' type='text' name='name' placeholder='Digite seu nome' handleOnChange={handleChange}></Input>
                <Input text='Telefone' type='text' name='phone' placeholder='Digite seu telefone' handleOnChange={handleChange}></Input>
                <Input text='E-mail' type='email' name='email' placeholder='Digite seu E-mail' handleOnChange={handleChange}></Input>
                <Input text='Senha' type='password' name='password' placeholder='Digite sua Senha' handleOnChange={handleChange}></Input>
                <Input text='Confirmação de Senha' type='password' name='confirmpassword' placeholder='Digite sua Senha novamente' handleOnChange={handleChange}></Input>
                <input type='submit' value='Cadastrar'/>
            </form>
            <p>
                Já tem conta ? <Link to='/login'>Clique aqui</Link>
            </p>
        </section>
    )
}

export default Register