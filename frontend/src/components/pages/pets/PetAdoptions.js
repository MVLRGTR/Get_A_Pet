import api from '../../../utils/api'
import { useState,useEffect } from 'react'
import { useParams,Link } from 'react-router-dom'
import useFlashMessage from '../../../hooks/useFlashMessage'
import styles from './PetAdoptions.module.css'
import RoundedImage from '../../Layouts/RoundedImage'


function PetAdoptions(){
    const [pet, setPet] = useState({})
    const { id } = useParams()
    const apiUrl = process.env.REACT_APP_API
    const { setFlashMessage } = useFlashMessage()

    async function getPet() {
        api.get(`/pets/getpet/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            },
        }).then((response) => {
            setPet(response.data.pet)
            console.log(`response : ${JSON.stringify(response.data.pet)}`)
        }).catch((Erro) => {
            return Erro.response.data
        })
    }

    async function CompleteAdoption(){

    }

    useEffect(()=>{
        getPet()
    },[])

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
              {pet.adopter.length > 0 ? (
                pet.adopter.map((adopter) => (
                    <div className={styles.petlist_row} key={pet._id}>
                        <RoundedImage src={`${apiUrl}images/users/${adopter.img}`} alt={adopter.name} width='px75' />
                        <span className="bold">{adopter.name}</span>
                        <section className={styles.actions}>
                            {pet.available === true ?
                                (<>
                                    <button onClick={()=>CompleteAdoption(pet._id)} className={styles.conclude_btn}>Concluir adoção</button>
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