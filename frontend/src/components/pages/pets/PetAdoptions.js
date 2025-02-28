import api from '../../../utils/api'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useFlashMessage from '../../../hooks/useFlashMessage'
import styles from './PetAdoptions.module.css'
import RoundedImage from '../../Layouts/RoundedImage'
import { useNavigate } from 'react-router-dom'



function PetAdoptions() {

  const [pet, setPet] = useState({})
  const { id } = useParams()
  const [adopters, setAdopters] = useState()
  const navigate = useNavigate()
  const apiUrl = process.env.REACT_APP_API
  const { setFlashMessage } = useFlashMessage()

async function getPet() {
    api.get(`/pets/getpet/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
    }).then((response) => {
      setPet(response.data.pet)
      setAdopters(response.data.adopters)
      // console.log(`response : ${JSON.stringify(response.data.pet)}`)
    }).catch((Erro) => {
      return Erro.response.data
    })
  }

async function CompleteAdoption(idAdoption) {

    api.patch(`/pets/concludeadopter/${id}`,
      {
        idadoption: idAdoption
      },
      {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
    }).then((response) => {
      console.log(`response : ${JSON.stringify(response.data)}`)
      let msgText = response.data.message
      let msgType = 'success'
      setFlashMessage(msgText, msgType)
      navigate('/pets/mypets')
    }).catch((Erro) => {
      let msgText = Erro.response.data.message
      let msgType = 'error'
      setFlashMessage(msgText, msgType)
      console.log(`response : ${JSON.stringify(Erro.response.data)}`)
      return Erro.response.data
    })

  }

  useEffect(() => {
    getPet()
  }, [])

  // console.log(`pet adopter > ${JSON.stringify(pet.adopter)}`)

  return (
    <>
      {pet.name && (
        <section className={styles.pet_details_container}>
          <div className={styles.petdetails_header}>
            <h1>Adotantes para o pet : {pet.name}</h1>

          </div>
          <div className={styles.pet_images}>
            {pet.images.map((image, index) => (
              <img
                key={index}
                src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                alt={pet.name}
              />
            ))}
          </div>
          <p>
            <span className="bold">Peso:</span> {pet.weight}kg
          </p>
          <p>
            <span className="bold">Idade:</span> {pet.age} meses
          </p>
          <p>
            <span className="bold">Descrição:</span> {pet.description}
          </p>
          {adopters.length > 0 ? (
            adopters.map((adopter) => (
              <div className={styles.petlist_row} key={adopter._id}>
                <RoundedImage src={`${apiUrl}images/users/${adopter.img}`} alt={adopter.name} width='px75' />
                <span className="bold">{adopter.name}</span>
                <section className={styles.actions}>
                  {pet.available === true ?
                    (<>
                      <button onClick={() => CompleteAdoption(adopter._id)} className={styles.conclude_btn}>Concluir adoção</button>
                      <Link to={`/pets/edit/${pet._id}`}>Editar</Link>

                    </>) :
                    (<p>Pet já adotado por este tutor</p>)}
                </section>
              </div>

            ))
          ) : (
            <p>
              <h2>Infelizmente esse pet não tem ainda tutores interessados</h2>
            </p>
          )}
        </section>
      )}
    </>
  )

}

export default PetAdoptions