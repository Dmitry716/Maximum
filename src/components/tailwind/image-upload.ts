import { uploadFile } from "@/api/requests";
import { createImageUpload } from "novel";
import { toast } from "sonner";

const onUpload = async (file: File): Promise<string | File> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileType", "course_material");
  formData.append("entityId", "1");
  formData.append("entityType", "course");

  const uploadPromise = uploadFile(formData);

  return new Promise((resolve, reject) => {
    toast.promise(
      uploadPromise.then((res) => {
        const { path } = res;
        resolve(`${process.env.NEXT_PUBLIC_API_URL}/${path}`); 
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: (e: Error) => {
          reject(e);
          return e.message || "Image upload failed";
        },
      }
    );
  });
};


export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
