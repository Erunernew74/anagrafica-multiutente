import React, {useState, useEffect, useRef} from 'react'
import './imageUpload.css'

const ImageUpload = ({setValidImage, file, setFile}) => {
    const [urlPreview, setUrlPreview] = useState()
    const inputFile = useRef()

    const handleInputImage = (e) => {
        let fileselezionato;
        if(e.target.files && e.target.files.length === 1) {
            fileselezionato = e.target.files[0]
            setFile(fileselezionato)
            setValidImage(true)
        }else {
            setValidImage(false)
        }
    }

    useEffect(() => {
        if(!file){
            return;
        }
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file)
        fileReader.onload = () => setUrlPreview(fileReader.result)
    }, [file])

  return (
    <div className='itemsImageUpload'>
        {urlPreview && (
            <img src={urlPreview}
                 alt="Preview"
                 className='imageRegister'
             />
        )}

        {!urlPreview && <h3>Anteprima immagine</h3>}
        <input 
            type="file" 
            accept='.png, .jpg, .jpeg'
            style={{ display: "none" }}
            ref={inputFile}
            onChange={handleInputImage}
        />
        <input 
            type="button" 
            value="SELEZIONA UN'IMMAGINE"
            onClick={() => inputFile.current.click()}
            className='btnSelectImage'
        />
    </div>
  )
}

export default ImageUpload
