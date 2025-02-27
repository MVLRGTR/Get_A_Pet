import { useState, useEffect } from 'react'
import formStyles from '../../form/Form.module.css'
import styles from './Profile.module.css'
import api from '../../../utils/api'
import useFlashMessage from '../../../hooks/useFlashMessage'
import Input from '../../form/Input'
import RoundedImage from '../../Layouts/RoundedImage'


function Profile() {
    const [user, setUser] = useState({})
    const [preview,setPreview] = useState()
    const [token] = useState(localStorage.getItem('token') || '')
    const {setFlashMessage} =useFlashMessage()

    useEffect(()=>{
        api.get('/users/checkuser',{
            headers:{
                Authorization:`Bearer ${JSON.parse(token)}`
            }
        }).then((response)=>{
            setUser(response.data)
        })
    },[token])

    function onFileCHange(evt) {
        setPreview(evt.target.files[0])
        setUser({...user,[evt.target.name]:evt.target.files[0]})
    }

    function handleChange(evt) {
        setUser({...user,[evt.target.name]:evt.target.value})
    }

    async function handleSubmit(evt) {
        evt.preventDefault()

        let msgType = 'success'
        const formData = new FormData()
        Object.keys(user).forEach((key)=>{
            formData.append(key,user[key])
        })

        const data = await api.patch(`/users/edit/${user._id}`,formData ,{
            headers:{
                Authorization:`Bearer ${JSON.parse(token)}`,
                'Content-Type':'multipart/form-data'
            }
        }).then((response)=>{
           return response.data
        }).catch((erro)=>{
            msgType = 'erro'
            return erro.response.data
        })

        setFlashMessage(data.message,msgType)
    }

    return (
        <section >
            <div className={styles.profiler_header}>
                <h1>Perfil</h1>
                {(user.image || preview) && (
                    <RoundedImage src={preview ?URL.createObjectURL(preview) : `${process.evn.REACT_APP_API}/images/users/${user.image}`} alt={user.name}/>
                )}
            </div>
            <form className={formStyles.form_container} onSubmit={handleSubmit}>
                <Input text='image' type='file' name='image' handleOnChange={onFileCHange} />
                <Input text='E-mail' type='email' name='email' placeholder='Digite seu e-mail' value={user.email || ''} handleOnChange={handleChange} />
                <Input text='Nome' type='text' name='name' placeholder='Digite seu nome' value={user.name || ''} handleOnChange={handleChange} />
                <Input text='Telefone' type='text' name='phone' placeholder='Digite seu telefone' value={user.phone || ''} handleOnChange={handleChange} />
                <Input text='Senha' type='password' name='password' placeholder='Digite sua senha' handleOnChange={handleChange} />
                <Input text='Confirmação de Senha' type='password' name='confirmpassword' placeholder='Digite sua senha novamente' handleOnChange={handleChange} />
                <input type='submit' value='Editar' />
            </form>
        </section>
    )
}

export default Profile