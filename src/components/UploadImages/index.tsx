import { ChangeEvent, useState } from 'react';
import { Box, Typography, Button, LinearProgress } from '@material-ui/core';

import { uploadFile } from '../../services/upload';

import noImage from '../../assets/img/product-no-image.png'

import './styles.scss';

export function UploadImages() {

    const [currentFile, setCurrentFile] = useState({} as File);
    const [previewImage, setPreviewImage] = useState('');
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList) return;

        setCurrentFile(fileList[0]);
        setPreviewImage(fileList[0] ? URL.createObjectURL(fileList[0]) : '');
        setProgress(0);
        setMessage('');

        upload();

    }

    const upload = () => {

        setProgress(0);
        uploadFile(currentFile, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        }).then((response) => {

            setMessage(response.data.message)
            setIsError(false)

        }).catch((err) => {

            setProgress(0)
            setMessage("Houve um erro ao carregar a imagem no servidor")
            setIsError(true)

        });
    }



    return (
        <div id="upload-image">
            {previewImage ?
                <div className="image-preview-container">
                    <img className="image-preview" src={previewImage} alt="preview da imagem de upload" />
                </div>
                :
                <div className="image-preview-container">
                    <img className="image-preview" src={noImage} alt="sem imagem do produto" />
                </div>
            }


            <div className="info-container">
                {currentFile?.size > 0 && (
                    <Box className="progress" display="flex" alignItems="center">
                        <Box width="100%" mr={1}>
                            <LinearProgress variant="determinate" value={progress} />
                        </Box>
                        <Box minWidth={35}>
                            <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
                        </Box>
                    </Box>)
                }
                {message && (
                    <Typography variant="subtitle2" className={`upload-message ${isError ? "error" : ""}`}>
                        {message}
                    </Typography>
                )}
            </div>
            <div className="actions">
                <label htmlFor="btn-upload">
                    <input
                        id="btn-upload"
                        name="btn-upload"
                        style={{ display: 'none' }}
                        type="file"
                        accept="image/*"
                        onChange={selectFile} />
                    <Button
                        className="btn-choose"
                        variant="outlined"
                        component="span" >
                        Selecionar
                    </Button>
                </label>
                <div className="file-name">
                    {currentFile ? currentFile.name : null}
                </div>
            </div>

        </div >
    );
}