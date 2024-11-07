import styles from './Input.module.css'

{/* <Input text='Imagens do Pet' type='file' name='images' handleOnChange={onFileChange} multiple={true} /> */}

function Input({type,text ,name,placeholder,handleOnChange,value,multiple}){
    return(
        <div className={styles.form_control}> 
            <label htmlFor={name}>{text} :</label>
            <input type={type} name={name} id={name} placeholder={placeholder} onChange={handleOnChange} value={value} {...(multiple)?{multiple} : ''}></input>
        </div>
    )
}

export default Input