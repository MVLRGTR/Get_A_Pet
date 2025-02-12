import { useState, useEffect, useContext } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Context } from "../../../context/UserContext"


function ActivesChats() {

    const { authenticated } = useContext(Context)

    return (
        <>
            {authenticated ?
                (
                    <section>

                    </section>
                ) :
                (
                    <section>
                        <h1>Você precisa estar logado para ver suas Mensagens</h1>
                        <div>
                            <Link to='/login'>Ir para o Login</Link>
                        </div>
                    </section>
                )}
        </>
    )

}

export default ActivesChats