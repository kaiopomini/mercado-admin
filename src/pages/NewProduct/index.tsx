import { Button, CircularProgress, FormControlLabel, Switch, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Edit } from "@material-ui/icons";

import { CurrencyInput } from '../../components/CurrencyInput';
import { UploadImages } from '../../components/UploadImages';
import { createProduct, deleteProduct, getProduct, updateProduct } from '../../services/products';

import './styles.scss';

export function NewProduct() {

  const [barCode, setBarCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState<any>();
  const [description, setDescripiton] = useState<any>('');
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editBarCode, setEditBarCode] = useState(false);
  const [clicked, setClicked] = useState('');
  const [errorsValidation, setErrorsValidation] = useState<any>({})
  const { productId } = useParams();
  const navigate = useNavigate()
  
  function resetErrors(nameField: string) {
    const errors = {...errorsValidation};
    errors[nameField] = {}
    setErrorsValidation(errors)
  }

  async function handlePostData() {
    setIsLoading(true)
    setClicked('save')
    const hasErrors = validateFields()
    
    if(!hasErrors) {
      console.log('entrou')
      if (editMode && productId) {
        const res = await updateProduct(productId, barCode, name, price, description, isActive);
        if (res?.success) {
          console.log('att com sucesso')
        }
      } else {
        const res = await createProduct(barCode, name, price, description, isActive);
        if (res?.success) {
          navigate('/products')
        }
      }
    }
    
    setIsLoading(false)
  }

  async function handleDelete() {
    setClicked('delete')
    setIsLoading(true)
    if (productId) {
      const response = await deleteProduct(productId);

      if(response?.success) {
        navigate('/products')
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (productId) {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadData() {
    setIsLoading(true)
    if (productId) {
      const data = await getProduct(productId)
      const product = data?.payload
      if (product) {
        setBarCode(product.gtin_code)
        setName(product.name)
        setPrice(product.price)
        setDescripiton(product.description)
        setIsActive(product.active)
        setEditMode(true)
      }

    }
    setIsLoading(false)
  }

  function validateFields() {
    const errors = {} as any
    let hasErrors = false
    if (!barCode) {
      hasErrors = true
      errors.barCode = {
        error: true,
        msg: "valor inválido"
      }
    }

    if (!name) {
      hasErrors = true
      errors.name = {
        error: true,
        msg: "valor inválido"
      }
    }

    if (!price || price < 0) {
      hasErrors = true
      errors.price = {
        error: true,
        msg: "valor inválido"
      }
    }
    setErrorsValidation(errors)

    return hasErrors
  }


  return (
    <div id="new-product">
      <h2>Novo Produto</h2>
      <div className="form-container">
        <form>
          <div className="top-content">
            <div className="main-input-container">
              <div className="line-input">
                <TextField
                  size="small"
                  id="barCode"
                  label="Código de barras"
                  fullWidth
                  autoFocus={!editMode}
                  value={barCode}
                  onChange={(e) => setBarCode(e.target.value)}
                  autoComplete='off'
                  disabled={editMode && !editBarCode}
                  error={errorsValidation['barCode']?.error}
                  helperText={errorsValidation['barCode']?.msg}
                  onFocus={(e) => resetErrors(e.target.id)}
                />
                {
                  editMode &&
                  <button className={editBarCode ? 'edit red' : 'edit'} onClick={() => setEditBarCode(!editBarCode)} type="button"> <Edit /> </button>
                }

              </div>

              <div className="line-input">
                <TextField
                  size="small"
                  id="name"
                  label="Nome"
                  fullWidth
                  value={name}
                  autoComplete='off'
                  onChange={(e) => setName(e.target.value)}
                  error={errorsValidation['name']?.error}
                  helperText={errorsValidation['name']?.msg}
                  onFocus={(e) => resetErrors(e.target.id)}
                />
              </div>

              <div className="line-input">

                <CurrencyInput
                  label="Preço"
                  id="price"
                  autoComplete='off'
                  fullWidth={true}
                  onChangeInput={value => {
                    setPrice(
                      value ? parseFloat(value) : undefined
                    );
                  }}
                  currentValue={price}
                  error={errorsValidation['price']?.error}
                  helperText={errorsValidation['price']?.msg}
                  onFocus={(e) => resetErrors(e.target.id)}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={isActive}
                      onChange={(event) => setIsActive(event.target.checked)}
                    />} label="Ativo" />

              </div>

              <div className="line-input">
                <TextField
                  size="small"
                  id="description"
                  label="Descrição"
                  multiline={true}

                  rows={4}
                  fullWidth
                  value={description}
                  autoComplete='off'
                  onChange={(e) => setDescripiton(e.target.value)}
                  error={errorsValidation['description']?.error}
                  helperText={errorsValidation['description']?.msg}
                />
              </div>

            </div>
            <div className="upload-image-container">
              <UploadImages />
            </div>
          </div>
          <div className="more-info-container">
            {editMode &&
              <Button variant="outlined" onClick={handleDelete} color="error" disabled={isLoading} className="delete-button" >
                {isLoading && clicked === 'delete' ? <CircularProgress color="inherit" size={16} /> : 'excluir'}
              </Button>
            }
            <Button variant="contained" onClick={handlePostData} disabled={isLoading} >
              {isLoading && clicked === 'save' ? <CircularProgress color="inherit" size={16} /> : 'salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div >
  )

}
