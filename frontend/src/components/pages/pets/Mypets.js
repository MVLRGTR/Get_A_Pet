import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import useFlashMessage from "../../../hooks/useFlashMessage"
import api from "../../../utils/api"
import RoundedImage from '../../Layouts/RoundedImage'
import styles from '../pets/DashBoard.module.css'


function Mypets() {
    const [pets, setPets] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()
    const apiUrl = process.env.REACT_APP_API

    useEffect(() => {
        console.log(`apiUrl : ${apiUrl}`)
        getMyPets(1)
    }, [token])

    async function getMyPets(page) {
        api.get('/pets/mypets/1', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
        }).then((response) => {
            setPets(response.data.pets)
        }).catch((Erro) => {
            return Erro.response.data
        })
    }

    async function removePet(id) {
        let msgType = 'success'

        const data = await api.delete(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            const updatedPets = pets.filter((pet) => pet._id !== id)
            setPets(updatedPets)
            return response.data
        }).catch((Erro) => {
            msgType = 'error'
            return Erro.response.data
        })

        setFlashMessage(JSON.stringify(data.message), msgType)
    }

    async function concludeAdoption(id){
        let msgType = 'success'

        const data = await api.patch(`/pets/concludeadopter/${id}`,{},{
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response)=>{
            return response.data
        }).catch((Erro)=>{
            msgType = 'error'
            return Erro.response.data
        })

        setFlashMessage(JSON.stringify(data.message), msgType)
    }

    return (
        <section>
            <div className={styles.petlist_header}>
                <h1>Meus Pets</h1>
                <Link to='/pets/addpet'>Cadastrar Pet</Link>
            </div>
            <div className={styles.petlist_container}>
                {pets.length > 0 ?
                    (pets.map((pet) => (
                        <div className={styles.petlist_row} key={pet._id}>
                            <RoundedImage src={`${apiUrl}images/pets/${pet.images[0]}`} alt={pet.name} width='px75' />
                            <span className="bold">{pet.name}</span>
                            <section className={styles.actions}>
                                {pet.available === true ?
                                    (<>

                                        {pet.adopter &&
                                            <button onClick={()=>concludeAdoption(pet._id)} className={styles.conclude_btn}>Concluir adoção</button>
                                        }
                                        <Link to={`/pets/edit/${pet._id}`}>Editar</Link>
                                        <button onClick={() => {
                                            removePet(pet._id) //o código é escrito assim para que o código espere a execução do comando onClick para executar a ação 
                                        }}>Excluir</button>
                                    </>) :
                                    (<p>Pet já adotado</p>)}
                            </section>
                        </div>

                    )))
                    : <p>Você ainda não tem pets cadastrados</p>}</div>
        </section>
    )
}

export default Mypets