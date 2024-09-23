import { useState, useEffect } from "react"
import api from "../../utils/api"
import { Link } from "react-router-dom"
import styles from './Home.module.css'
import Input from '../form/Input'

function Home() {
    const [pets, setPets] = useState([])
    const [searchPetDb, setSearchPet] = useState('')
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        getAllPets(1)
    }, [])

    function getAllPets(page) {
        console.log('entrou aqui')
        api.get(`/pets/${page}`)
            .then((response) => {
                setPets(response.data.pets)
                setTotalPages(response.data.totalPages)
                setCurrentPage(page)
                console.log(pets)
            }).catch((Erro) => {
                return Erro.response.data
            })
    }

    function searchPet(evt) {
        evt.preventDefault()
        api.get(`/pets/search/${searchPetDb}/1`)
            .then((response) => {
                setPets(response.data.pets)
                setTotalPages(response.data.totalPages)
                setCurrentPage(1)
                console.log(pets)
            }).catch((Erro) => {
                return Erro.response.data
            })
    }

    function changePage(page) {
        console.log(`entrou aqui com page ${page}`)
        if (searchPetDb) {
            api.get(`/pets/search/${searchPetDb}/${page}`)
                .then((response) => {
                    setPets(response.data.pets)
                    setCurrentPage(page)
                }).catch((Erro) => {
                    return Erro.response.data
                })
        } else {
            getAllPets(page)
        }
    }

    function handleChange(evt) {
        setSearchPet(evt.target.value)
    }

    function clearSearch() {
        setSearchPet('')
        getAllPets(1)
    }


    return (
        <section>
            <div className={styles.pet_home_header}>
                <h1>Adote um Pet</h1>
                <p>Veja os detalhes de cada um e conheça o tutor deles</p>
                <form onSubmit={searchPet}>
                    <Input text='Busque por um pet' type='text' name='search' placeholder='Digite o nome do pet' handleOnChange={handleChange} value={searchPetDb} />
                    <input type='submit' value='Buscar' />
                </form>
                <input type="submit" value="Limpar" onClick={clearSearch} />
            </div>
            <div className={styles.pet_container}>
                {pets.length > 0 && (
                    pets.map((pet, index) => (
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
                                    <p className={styles.adopted_text}>Adotado</p>
                                )}
                        </div>
                    ))
                )}
                {pets.length === 0 && (
                    <p>Não existem pets cadastrados ou disponíveis para adoção no momento !</p>
                )}
            </div>
            {totalPages > 1 && (
                <footer className={styles.pagination}>
                    {/* Paginação */}
                    <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>{'<'}</button>
                    {[...Array(totalPages).keys()].map(page => (
                        <button key={page + 1} className={currentPage === page + 1 ? styles.active : ''} onClick={() => changePage(page + 1)}>
                            {page + 1}
                        </button>
                    ))}
                    <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>{'>'}</button>
                </footer>
            )}
        </section>
    )
}

export default Home