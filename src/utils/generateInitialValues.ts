import { getObjectDepth } from "ui-component/forms/DynamicForm";

const generateInitialValues = <T extends Record<string, any>>(
  metadata: any,
  row?: T,
  parent = ""
): any => {
  const values: any = {};

  for (const key in metadata) {
    if (
      parent.length <= 0 &&
      (metadata[key].componentType === "TextField" ||
        metadata[key].componentType === "ImageUpload" ||
        metadata[key].componentType === "RichTextEditor")
    ) {
      // Handle simple fields (e.g., title, subtitle, image)
      values[key] = row?.[key] || "";
    } else {
      // Handle nested objects (e.g., faq)

      values[key] = row?.[parent]?.[key] || "";
    }

    if (getObjectDepth(metadata[key]) > 1 && !metadata[key].componentType) {
      // Handle nested objects
      values[key] = generateInitialValues(metadata[key], row?.[key], key);
    }
  }

  return values;
};

export default generateInitialValues;
