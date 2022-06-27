import { api } from "./api.service";

export function uploadImage(
  file: File,
  endpointPath: string,
  onUploadProgress: (progressEvent: any) => void | undefined
) {
  const data = new FormData();

  data.append("image", file);

  return api.post(`/admin/files/images/${endpointPath}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
}

export function uploadUserImage(
  file: File,
  onUploadProgress: (progressEvent: any) => void | undefined
) {
  const data = new FormData();

  data.append("image", file);

  return api.post("/admin/files/images/users", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
}

export function getFilesImage() {
  return api.get("/files");
}
