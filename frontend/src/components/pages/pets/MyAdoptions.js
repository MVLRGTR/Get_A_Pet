import styles from './DashBoard.module.css'
import api from '../../../utils/api'
import { useEffect, useState } from 'react'
import RoundedImage from '../../Layouts/RoundedImage'

function MyAdoptions() {

    const [pets, setPets] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const apiUrl = process.env.REACT_APP_API

    useEffect(() => {

        api.get('/pets/myadoptions', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((reponse) => {
            setPets(reponse.data.pets)
        }).catch((Erro) => {
            return Erro.reponse.data
        })

    }, [token])

    console.log(`pets :${JSON.stringify(pets)}`)

    return (
        <section>
            <div className={styles.petlist_header}>
                <h1>Minhas Adoções</h1>
            </div>
            <div className={styles.petlist_container}>
                {pets.length > 0 ?
                    (
                        pets.map((pet) => (
                            <div className={styles.petlist_row} key={pet._id}>
                                <RoundedImage src={`${apiUrl}images/pets/${pet.images[0]}`} alt={pet.name} width='px75' />
                                <span className="bold">{pet.name}</span>
                                <div className={styles.contacts}>
                                    <p>
                                        <span className='bold'>Ligue para :</span> {pet.user.phone} 
                                    </p>
                                    <p>
                                        <span className='bold'>Fale com :</span> {pet.user.name} 
                                    </p>
                                </div>
                                <section className={styles.actions}>
                                    {pet.available === true ?
                                        (
                                        <p>Adoção em Processo</p>
                                        ) :
                                        (<p>Parabéns por concluir a sua adoção</p>)}
                                </section>
                            </div>
                        ))
                    ) :
                    (
                        <p>Ainda não há adoçoes de pets</p>
                    )}
            </div>
        </section>
    )
}

export default MyAdoptions

