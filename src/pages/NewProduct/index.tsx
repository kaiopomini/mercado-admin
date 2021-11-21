import { useState } from 'react';
import { Button, FormControlLabel, Switch, TextField } from '@mui/material';
import { UploadImages } from '../../components/UploadImages';

import './styles.scss';
import { CurrencyInput } from '../../components/CurrencyInput';

export function NewProduct() {
  const [barCode, setBarCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState<any>();
  const [description, setDescripiton] = useState('');
  const [isActive, setIsActive] = useState(false);

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
                  id="codeBar"
                  label="Código de barras"
                  fullWidth
                  autoFocus
                  value={barCode}
                  onChange={(e) => setBarCode(e.target.value)}
                  autoComplete='off'
                />
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
                  multiline
                  rows={4}
                  fullWidth
                  value={description}
                  autoComplete='off'
                  onChange={(e) => setDescripiton(e.target.value)}
                />
              </div>

            </div>
            <div className="upload-image-container">
              <UploadImages />
            </div>
          </div>
          <div className="more-info-container">
            <Button variant="contained">salvar</Button>
          </div>


        </form>
      </div>

    </div >
  )

}
