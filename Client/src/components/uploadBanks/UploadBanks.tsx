import { JSX } from "react"
import { useFileProcessor } from "../../hooks/useFileProcessor"
import { FaCircleCheck } from "react-icons/fa6"
import { IoCloudUploadOutline } from "react-icons/io5"
import './UploadBanks.css'

export const UploadBanks = (): JSX.Element => {
  const { successUpload, errorMessage, handleOnChange } = useFileProcessor()

  return (
    <section className="upload-container">
      <div className="upload-items">
        {successUpload
          ? (<FaCircleCheck color="#73ba69" />)
          : (<IoCloudUploadOutline color="#848484a5" />)}
        <h1 style={{ color: successUpload ? '#73ba69' : '#848484a5' }}>
          { successUpload ? 'Archivo subido con éxito' : 'Subir Archivo .CSV' }
        </h1>
        { errorMessage && <p className="error-message">{ errorMessage }</p> }
      </div>
      <input
        id="file-banks"
        name="file-banks"
        type="file"
        accept=".csv"
        onChange={ (e) => handleOnChange(e, 'http://localhost:5239/api/Bank/csv') }
      />
    </section>
  )
}