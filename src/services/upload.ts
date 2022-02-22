import { api } from "./api";

export function uploadFile(file : File, onUploadProgress: (progressEvent: any) => void | undefined) {
    const data = new FormData();

    data.append("image", file);

    return api.post("/file/images", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });
}

export function getFilesImage() {
    return api.get("/files");
}
