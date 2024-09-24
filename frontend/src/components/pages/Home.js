import { useState, useEffect } from "react"
import api from "../../utils/api"
import { Link, useNavigate, useParams } from "react-router-dom"
import styles from './Home.module.css'


function Home() {
    const [pets, setPets] = useState([])
    const [searchPetDb, setSearchPet] = useState('')
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const navigate = useNavigate()
    const { page } = useParams()

    useEffect(() => {
        const pageNumber = page ? parseInt(page) : 1
        getAllPets(pageNumber)
    }, [page])

    function getAllPets(page) {
        api.get(`/pets/${page}`)
            .then((response) => {
                setPets(response.data.pets)
                console.log(`pets retornados : ${response.data.pets}`)
                setTotalPages(response.data.totalPages)
                setCurrentPage(page)
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
            navigate(`/${page}`)
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
                <form onSubmit={searchPet} className={styles.search_form}>
                    <div className={styles.search_label}>
                        <input type='text' name='search' placeholder='Busque por um pet' onChange={handleChange} value={searchPetDb}/>
                        <button type='submit' className={styles.search_button}>
                            🔍
                        </button>
                        {searchPetDb && (
                            <button type='button' className={styles.clear_button} onClick={clearSearch}>
                                ✖
                            </button>
                        )}
                    </div>
                </form>


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
                    <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>{'<'}</button>
                    {/* {[...Array(totalPages).keys()].map(page => (
                        <button key={page + 1} className={currentPage === page + 1 ? styles.active : ''} onClick={() => changePage(page + 1)}>
                            {page + 1}
                        </button>
                    ))} */}
                    {(() => {
                        const startPage = Math.max(currentPage - 10, 1)
                        const endPage = Math.min(currentPage + 10, totalPages)
                        return [...Array(endPage - startPage + 1).keys()].map(page => {
                            const pageNumber = startPage + page
                            return (
                                <button
                                    key={pageNumber}
                                    className={currentPage === pageNumber ? styles.active : ''}
                                    onClick={() => changePage(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            )
                        })
                    })()}
                    <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>{'>'}</button>
                </footer>
            )}
        </section>
    )
}

export default Home