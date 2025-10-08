import * as yup from "yup";

// Create a function that takes maxImages as a parameter
export const createImageValidationSchema = (maxImages: number) => 
  yup
    .array()
    .of(
      yup
        .mixed()
        .required("Image is required")
        .test(
          "valid-image",
          "Image size should be 5MB Max or valid URL",
          (item) => {
            if (typeof item === "string") {
              return true; // Treat string as a valid image URL
            }
            if (item instanceof File) {
              const validTypes = [
                "image/png",
                "image/jpeg",
                "image/jpg",
                "image/svg+xml",
                "image/webp",
              ];
              return item.size <= 5000000 && validTypes.includes(item.type); // Max size 5MB
            }
            return false;
          }
        )
    )
    .max(maxImages, `You can upload up to ${maxImages} images`);


     export const SingleImageValidationSchema = yup
    .mixed()
    .required("Section One Image is required")
    .test(
      "valid-image",
      "Image size should be 5MB Max or valid URL",
      (item) => {
        if (typeof item === "string") {
          // Allow valid URLs
          return true;
        }
        if (item instanceof File) {
          const validTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/svg+xml",
            "image/webp",
          ];
          return item.size <= 5000000 && validTypes.includes(item.type); // Max size 5MB
        }
        return false;
      }
    )