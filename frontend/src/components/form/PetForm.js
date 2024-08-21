import { useState } from "react"
import formStyles from './Form.module.css'
import Input from './Input'
import Select from "./Select"


function PetForm({ petData, btnText, handleSubmit }) {
    const [pet, setPet] = useState(petData || {})
    const [preview, setPreview] = useState([])
    const colors = ['Branco', 'Preto', 'Cinza', 'Caramelo', 'Mesclado']

    function onFileChange(evt) {
        setPreview(Array.from(evt.target.files))
        setPet({ ...pet, images: [...evt.target.files] })
    }

    function handleChange(evt) {
        setPet({ ...pet, [evt.target.name]: evt.target.value })
    }

    function handleColor(evt) {
        setPet({ ...pet, color: evt.target.options[evt.target.selectedIndex].text })
    }

    function submit(evt) {
        evt.preventDefault()
        console.log(pet)
        handleSubmit(pet)
    }

    return (
        <form onSubmit={submit} className={formStyles.form_container}>
            <div className={formStyles.preview_pet_images}>
                {preview.length > 0 ?
                preview.map((image,index)=>(
                        <img src={URL.createObjectURL(image)} alt={pet.name} key={`${pet.name}+${index}`}/>
                ))
            :
                pet.images &&  pet.images.map((image,index)=>(
                        <img src={`${process.env.REACT_APP_API}/images/pets/${image}`} alt={pet.name} key={`${pet.name}+${index}`}/>
                ))
            }
            </div>
            <Input text='Imagens do Pet' type='file' name='images' handleOnChange={onFileChange} multiple={true} />
            <Input text='Nome do Pet' type='text' name='name' placeholder='Digite o nome do pet' handleOnChange={handleChange} value={pet.name || ''} />
            <Input text='Idade do Pet' type='text' name='age' placeholder='Digite a idade do pet em meses' handleOnChange={handleChange} value={pet.age || ''} />
            <Input text='Peso do Pet' type='text' name='weight' placeholder='Digite o peso do pet em  kg' handleOnChange={handleChange} value={pet.weight || ''} />
            <Select name='color' text='Selecione a cor' options={colors} handleOnChange={handleColor} value={pet.color || ''} />
            <textarea id='description' name='description' rows='20' cols='33' placeholder='Digite a descrição do pet ' handleChange={handleChange} value={pet.description || ''}></textarea>
            <input type="submit" value={btnText} />
        </form>
    )
}

export default PetForm

