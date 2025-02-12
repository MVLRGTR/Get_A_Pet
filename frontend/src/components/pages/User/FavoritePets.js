import { useState, useEffect, useContext } from "react"
import { useCallback } from "react"
import api from "../../../utils/api"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Context } from "../../../context/UserContext"
import styles from './FavoritePets.module.css'


function FavoritePets() {

    const { authenticated } = useContext(Context)
    const [favoritePets, setFavoritePets] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const navigate = useNavigate()
    const { page } = useParams()

    const getFavoritPets = useCallback((page) => {
        api.get(`/pets/favoritepets/${page}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        .then((response) => {
            setFavoritePets(response.data.favoritePets);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
        }).catch((Erro) => {
            console.error("Erro ao buscar pets favoritos:", Erro.response?.data || Erro);
        });
    }, [])

    async function removePet(id) {
        await api.patch(`/pets/removefavoritepet/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
            .then((response) => {
                setFavoritePets((prevPets) => prevPets.filter(pet => pet._id !== id))
                console.log(`response : ${response.data.message}`)
            }).catch((Erro) => {
                return Erro.response.data
            })
        
            getFavoritPets(currentPage)
    }

    async function changePage(page) {
        setCurrentPage(page)
        getFavoritPets(page)
        navigate(`/favoritepets/${page}`)
    }

    useEffect(() => {
        const pageNumber = page ? parseInt(page) : 1
        getFavoritPets(pageNumber)

    }, [page,getFavoritPets])

    return (
        <>
            {authenticated ? (
                favoritePets && favoritePets.length > 0 ? (
                    <section className={styles.favoritebox}>
                        <h1>Favoritos</h1>
                        <article>
                            {favoritePets.map((pet, index) => (
                                <div key={index} className={styles.sectionfavorite}>
                                    <Link to={`/pets/getpet/${pet._id}`}>
                                        <div className={styles.divpet}>
                                            <img src={`${process.env.REACT_APP_API}images/pets/${pet.images[0]}`} alt='pet'></img>
                                            <p>{pet.name}</p>
                                        </div>
                                    </Link>
                                    <button onClick={() => removePet(pet._id)}>Remover Pet</button>
                                </div>
                            ))

                            }
                        </article>
                        {totalPages > 1 && (
                            <footer className={styles.pagination}>
                                <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>{'<'}</button>
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
                ) : (
                    <section>
                        <h1>Você não tem Pets Adicionados a sua lista</h1>
                    </section>
                )

            ) :
                (
                    <section>
                        <h1>Você precisa estar logado para ver suas notificações</h1>
                        <div>
                            <Link to='/login'>Ir para o Login</Link>
                        </div>
                    </section>
                )}
        </>
    )
}

export default FavoritePets