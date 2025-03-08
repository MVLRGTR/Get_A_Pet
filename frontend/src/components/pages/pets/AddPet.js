import styles from './AddPet.module.css'
import { useState } from 'react'
import api from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import useFlashMessage from '../../../hooks/useFlashMessage'
import PetForm from '../../form/PetForm'

function AddPet() {

  const [token] = useState(localStorage.getItem('token') || '')
  const { setFlashMessage } = useFlashMessage()
  const navigate = useNavigate()

  async function registerPet(pet) {
    let msgType = 'success'
    const formData = new FormData()

    const petFormData = await Object.keys(pet).forEach((key) => {
      if (key === 'images') {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append(`images`, pet[key][i])
        }
      } else {
        formData.append(key, pet[key])
      }
    })

    console.log(`formData ${formData}`)

    formData.append('pet', petFormData)

    console.log(`token :${JSON.parse(token)}}`)

    const data = await api.post('/pets/create', formData, {
      headers:{
        Authorization: `Bearer ${JSON.parse(token)}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        console.log(`then response : ${response.data}`)
        return response.data
      })
      .catch((Erro) => {
        msgType = 'error'
        return Erro.response.data
      })

    const erros = `${data.message} ${data.returnErros}`
    setFlashMessage(erros, msgType)

    if (msgType != 'error') {
      navigate('/pets/mypets')
    }
  }

  return (
    <section className={styles.addpet_header}>
      <div>
        <h1>Cadastre um Pet</h1>
        <p>Depois ele ficará disponivél para adoção</p>
      </div>
      <PetForm handleSubmit={registerPet} btnText='Cadastar Pet' />
    </section>
  )
}

export default AddPet


