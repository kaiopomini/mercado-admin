import { api } from "./api";

export function uploadFile(file : string | Blob, onUploadProgress: (progressEvent: any) => void | undefined) {
    let formData = new FormData();

    formData.append("file", file);

    return api.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });
}

export function getFilesImage() {
    return api.get("/files");
}
