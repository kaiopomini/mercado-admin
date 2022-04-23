import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, LinearProgress } from "@material-ui/core";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import { Delete } from "@material-ui/icons";

import noImage from "../../../assets/img/product-no-image.png";
import "./styles.scss";
import { uploadProductImage } from "../../../services/upload";

interface Props {
  setValue: (url: string) => void;
  imageUrl: any;
}

export const UploadProductsImages = ({ setValue, imageUrl }: Props) => {
  const [selectPreviewFileUrl, setSelectPreviewFileUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<File>();
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(" ");

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length <= 0) {
      return;
    }

    setError(false);
    setMessage(" ");
    setProgress(0);

    const file = acceptedFiles[0];
    setCurrentFile(file);
    const fileUrl = URL.createObjectURL(file);
    setSelectPreviewFileUrl(fileUrl);

    setProgress(0);
    try {
      const res = await uploadProductImage(file, (event) => {
        setProgress(Math.round((90 * event.loaded) / event.total));
      });
      setProgress(100)

      setValue(res.data.payload?.url);
    } catch (error) {
      setValue("");
      setCurrentFile(undefined);
      setError(true);
      setMessage("Não foi possível carregar a imagem");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDropRejected = () => {
    setError(true);
    setMessage("Formato inválido! Escolha uma imagem com no máximo 2mb");
    return;
  };

  const handleClearImage = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setValue("");
    setCurrentFile(undefined);
    setSelectPreviewFileUrl("");
    setProgress(0);
    setError(false);
    setMessage(" ");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    accept: "image/*",
    multiple: false,
    maxSize: 2000000,
  });

  const setDefaultSrc = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = noImage;
  }

  const renderPreviewImage = () => {
    if (imageUrl && imageUrl !== "default" && !selectPreviewFileUrl) {
      return (
        <div className="image-preview-container">
          <img
            className="image-preview"
            src={imageUrl}
            alt="preview da imagem de upload"
            onError={setDefaultSrc}
          />
        </div>
      );
    } else if (selectPreviewFileUrl && progress === 100) {
      return (
        <div className="image-preview-container">
          <img
            className="image-preview"
            src={selectPreviewFileUrl}
            alt="preview da imagem de upload"
          />
        </div>
      );
    } else {
      return (
        <div className="image-preview-container">
          <img
            className="image-preview"
            src={noImage}
            alt="sem imagem do produto"
          />
        </div>
      );
    }
  };

  return (
    <div id="upload-producs-images" {...getRootProps()}>
      {renderPreviewImage()}
      {imageUrl && imageUrl !== "default" && (
        <button
          className={"delete-btn"}
          onClick={(event) => handleClearImage(event)}
          type="button"
        >
          {" "}
          <Delete />{" "}
        </button>
      )}

      <div className="info-container">
        {currentFile && currentFile?.size > 0 && (
          <Box className="progress" display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
            <Box minWidth={35}>
              <Typography
                variant="body2"
                color="textSecondary"
              >{`${progress}%`}</Typography>
            </Box>
          </Box>
        )}
        {message && (
          <Typography
            variant="subtitle2"
            className={`upload-message ${error ? "error" : ""}`}
          >
            {message}
          </Typography>
        )}
      </div>

      <input {...getInputProps()} accept="image/*" />
      <div className="actions">
        <FileUploadOutlinedIcon fontSize={"large"} />
        <p>Clique ou arraste uma imagem </p>
      </div>
    </div>
  );
};
