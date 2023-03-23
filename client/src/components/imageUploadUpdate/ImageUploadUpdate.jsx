import React, { useState, useEffect, useRef } from "react";
import "./imageUploadUpdate.css";

const ImageUploadUpdate = ({ setValidImage, file, setFile }) => {
  const [urlPreview, setUrlPreview] = useState();
  const inputFile = useRef();

  const handleInputImage = (e) => {
    let fileselezionato;
    if (e.target.files && e.target.files.length === 1) {
      fileselezionato = e.target.files[0];
      setFile(fileselezionato);
      setValidImage(true);
    } else {
      setValidImage(false);
    }
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => setUrlPreview(fileReader.result);
  }, [file]);

  return (
    <div className="itemsImageUpload">
      {urlPreview && (
        <img src={urlPreview} alt="Preview" className="imageRegister" />
      )}

      {!urlPreview && (
        <h5 style={{ marginTop: "30px", textAlign: "center" }}>
          Anteprima immagine
        </h5>
      )}
      <input
        type="file"
        accept=".png, .jpg, .jpeg"
        style={{ display: "none" }}
        ref={inputFile}
        onChange={handleInputImage}
      />
      <input
        type="button"
        value="+"
        onClick={() => inputFile.current.click()}
        className="btnSelectImageUpdate"
      />
    </div>
  );
};

export default ImageUploadUpdate;
