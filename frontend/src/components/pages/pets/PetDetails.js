import styles from './PetDetails.module.css'
import api from '../../../utils/api'
import { useState,useEffect } from 'react'
import { useParams,Link } from 'react-router-dom'
import useFlashMessage from '../../../hooks/useFlashMessage'


function PetDetails() {
  const [pet, setPet] = useState({})
  const { id } = useParams()
  const { setFlashMessage } = useFlashMessage()
  const [token] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    petById(id)
  }, [id])

  async function petById(id){
    api.get(`/pets/getpet/${id}`).then((response) => {
      // console.log(`response : ${JSON.stringify(response)}`)
      setPet(response.data.pet)
    }).catch((Erro)=>{
      console.log(`erro : ${Erro}`)
    })
  }
  
  async function adoptionRequest(){
    let msgType = 'success'
    const data = await api.patch(`pets/adoptionrequest/${pet._id}`,{
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response)=>{
      return response.data
    }).catch((Erro)=>{
      console.log(`Erro : ${Erro}`)
      msgType = 'error'
      return Erro.response.data
    })

    setFlashMessage(data.message, msgType)
    console.log(`data :${JSON.stringify(data)}`)
  }


  return (
    <>
      {pet.name && (
        <section className={styles.pet_details_container}>
          <div className={styles.petdetails_header}>
            <h1>Conhecendo o Pet: {pet.name}</h1>
            <p>Se tiver interesse, marque uma visita para conhecê-lo!</p>
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
            <span className="bold">Idade:</span> {pet.age} anos
          </p>
          {token ? (
            <button onClick={adoptionRequest}>Solicitar Processo de Adoção</button>
          ) : (
            <p>
              Você precisa <Link to="/register">criar uma conta</Link> para
              solicitar a visita.
            </p>
          )}
        </section>
      )}
    </>
  )
}

export default PetDetails


