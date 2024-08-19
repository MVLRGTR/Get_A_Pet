import { useState,useEffect } from "react"
import api from "../../utils/api"
import { Link } from "react-router-dom"
import styles from './Home.module.css'

function Home(){
    const [pets,setPets] = useState([])

    useEffect(()=>{
        api.get('/pets')
        .then((response)=>{
            setPets(response.data.pets)
            console.log(pets)
        }).catch((Erro)=>{
            return Erro.response.data
        })
    },[])


    return(
        <section>
            <div className={styles.pet_home_header}>
                <h1>Adote um Pet</h1>
                <p>Veja os detalhes de cada um e conheça o tutor deles</p>
            </div>
            <div className={styles.pet_container}>
                {pets.length > 0 && (
                    pets.map((pet,index)=>(
                        <div className={styles.pet_card} key={index}>
                            <img src={`${process.env.REACT_APP_API}images/pets/${pet.images[0]}`} className={styles.pet_card_image}></img>
                            <h3>{pet.name}</h3>
                            <p>
                                <span className="bold">Peso :</span>{pet.weight}kg
                            </p>
                            {pet.available === true ? (
                                <Link to={`pets/${pet._id}`}>Mais Detalhes</Link>
                            ) : 
                            (
                                <p className={styles.adopted_text }>Adotado</p>
                            ) }
                        </div>
                    ))
                )}
                {pets.length === 0 && (
                    <p>Não existem pets cadastrados ou disponíveis para adoção no momento !</p>
                )}
            </div>
        </section>
    )
}

export default Home