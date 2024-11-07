import api from "../../../utils/api"
import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import PetForm from '../../../components/form/PetForm'
import styles from './AddPet.module.css'
import useFlashMessage from "../../../hooks/useFlashMessage"

function EditPet(){

    const [pet,setPet] =useState({})
    const [token] = useState(localStorage.getItem('token')||'')
    const {id} = useParams()
    const {setFlashMessage} = useFlashMessage()

    useEffect(()=>{
        api.get(`/pets/getpet/${id}`,{
            headers:{
                Authorization : `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((response)=>{
            setPet(response.data.pet)
        }).catch((Erro)=>{
            return Erro.response.data
        })
    },[])

    async function updatedPet(pet){
        let msgType = 'success'
        const formData = new FormData()

        Object.keys(pet).forEach((key)=>{
            if(key == 'images'){
                for(let i = 0 ; i < pet[key].length ; i++){
                    formData.append('images',pet[key][i])
                }
            }else{
                formData.append(key,pet[key])
            }
        })

        const data = await api.patch(`pets/${pet._id}`,formData,{
            headers:{
                Authorization:`Bearer ${JSON.parse(token)}`,
                'Content-Type':'multipart/form-data'
            }
        }).then((response)=>{
            return response.data
        }).catch((Erro)=>{
            msgType ='error'
            return Erro.response.data
        })

        setFlashMessage(JSON.stringify(data.message), msgType)

    }    

    return(
        <section>
            <div className={styles.addpet_header}>
                <h1>Editando o pet : {pet.name}</h1>
            </div>
            {pet.name && (
                <PetForm handleSubmit={updatedPet} btnText="Atualizar" petData={pet}/>
            )}
        </section>
    )
}

export default EditPet