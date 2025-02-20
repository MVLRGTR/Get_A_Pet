import { useState, useEffect, useContext } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Context } from "../../../context/UserContext"
import styles from './FavoritePets.module.css'


function FavoritePets() {

    const { authenticated,getAllFavoritePets,totalPagesFavorite, favoritepets,removeFavoritePet} = useContext(Context)
    const [currentPage, setCurrentPage] = useState(1)

    const navigate = useNavigate()
    const { page } = useParams()

    async function changePage(page) {
        setCurrentPage(page)
        getAllFavoritePets(page)
        navigate(`/favoritepets/${page}`)
    }

    useEffect(() => {
        const pageNumber = page ? parseInt(page) : 1
        getAllFavoritePets(pageNumber)

    }, [page])

    return (
        <>
            {authenticated ? (
                favoritepets && favoritepets.length > 0 ? (
                    <section className={styles.favoritebox}>
                        <h1>Favoritos</h1>
                        <article>
                            {favoritepets.map((pet, index) => (
                                <div key={index} className={styles.sectionfavorite}>
                                    <Link to={`/pets/getpet/${pet._id}`}>
                                        <div className={styles.divpet}>
                                            <img src={`${process.env.REACT_APP_API}images/pets/${pet.images[0]}`} alt='pet'></img>
                                            <p>{pet.name}</p>
                                        </div>
                                    </Link>
                                    <button onClick={() => removeFavoritePet(pet._id)}>Remover Pet</button>
                                </div>
                            ))

                            }
                        </article>
                        {totalPagesFavorite > 1 && (
                            <footer className={styles.pagination}>
                                <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>{'<'}</button>
                                {(() => {
                                    const startPage = Math.max(currentPage - 10, 1)
                                    const endPage = Math.min(currentPage + 10, totalPagesFavorite)
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
                                <button disabled={currentPage === totalPagesFavorite} onClick={() => changePage(currentPage + 1)}>{'>'}</button>
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