import { useGetDataByIdQuery } from 'api/api';
import { useState, useEffect } from 'react';
import { getNestedValue } from 'ui-component/form-components/image_upload';
import { getObjectDepth } from 'ui-component/forms/DynamicForm';
import * as yup from 'yup';

const generateValidationSchema = (obj: any): yup.ObjectSchema<any> => {
  return yup.object(
    Object.keys(obj).reduce(
      (acc, key) => {
        const field = obj[key];

        if (typeof field === 'object' && !field.componentType) {
          // Nested object (like seo)
          acc[key] = generateValidationSchema(field);
        } else if (
          field.componentType === 'ArrayInputsRichText' ||
          field.componentType === 'ArrayInputsString'
        ) {
          // Array of strings
          acc[key] = field.required
            ? (
                yup
                  .array()
                  .of(
                    yup.string().required(`${key} is required`)
                  ) as unknown as yup.ArraySchema<
                  yup.StringSchema<
                    string | undefined,
                    yup.AnyObject,
                    undefined,
                    ''
                  >[],
                  yup.AnyObject
                >
              ).required(`${key} is required`)
            : (yup.array().of(yup.string()) as unknown as yup.ArraySchema<
                yup.StringSchema<
                  string | undefined,
                  yup.AnyObject,
                  undefined,
                  ''
                >[],
                yup.AnyObject
              >);
        } else if (
          field.componentType === 'MultiValuesInput' ||
          field.componentType === 'AutoCompleteMultiple'
        ) {
          // Array of strings
          acc[key] = field.required
            ? (
                yup
                  .array()
                  .of(
                    yup.string().required(`${key} is required`)
                  ) as unknown as yup.ArraySchema<
                  yup.StringSchema<
                    string | undefined,
                    yup.AnyObject,
                    undefined,
                    ''
                  >[],
                  yup.AnyObject
                >
              ).required(
                `${key === 'url' ? 'Media File' : `${key}`} is required`
              )
            : (yup.array().of(yup.string()) as unknown as yup.ArraySchema<
                yup.StringSchema<
                  string | undefined,
                  yup.AnyObject,
                  undefined,
                  ''
                >[],
                yup.AnyObject
              >);
        } else if (field.componentType === 'ArrayInputsObject') {
          const questionField = field.questionField || 'question'; // Default to "question" if undefined
          const descriptionField = field.descriptionField || 'description'; // Default to "description" if undefined

          acc[key] = field.required
            ? (
                yup.array().of(
                  yup.object().shape({
                    [questionField]: yup
                      .string()
                      .required(`${questionField} is required`),
                    [descriptionField]: yup
                      .string()
                      .required(`${descriptionField} is required`),
                  })
                ) as unknown as yup.ObjectSchema<any>
              ).required(`${key} is required`)
            : (yup.array().of(
                yup.object().shape({
                  [questionField]: yup.string(),
                  [descriptionField]: yup.string(),
                })
              ) as unknown as yup.ObjectSchema<any>);
        } else if (field.componentType === 'MultipleImageUpload') {
          const questionField = field.questionField || 'question'; // Default to "question" if undefined
          const descriptionField = field.descriptionField || 'description'; // Default to "description" if undefined

          acc[key] = field.required
            ? (
                yup.array().of(
                  yup
                    .mixed()
                    .required('Image is required')
                    .test(
                      'valid-image',
                      'Image size should be 5MB Max or valid URL',
                      (item) => {
                        if (typeof item === 'string') {
                          return true; // Treat string as a valid image URL
                        }
                        if (item instanceof File) {
                          const validTypes = [
                            'image/png',
                            'image/jpeg',
                            'image/jpg',
                            'image/svg+xml',
                            'image/webp',
                          ];
                          return (
                            item.size <= 5000000 &&
                            validTypes.includes(item.type)
                          ); // Max size 5MB
                        }
                        return false;
                      }
                    )
                ) as unknown as yup.ObjectSchema<any>
              ).required(`${key} is required`)
            : (yup.array().of(
                yup
                  .mixed()
                  .required('Image is required')
                  .test(
                    'valid-image',
                    'Image size should be 5MB Max or valid URL',
                    (item) => {
                      if (typeof item === 'string') {
                        return true; // Treat string as a valid image URL
                      }
                      if (item instanceof File) {
                        const validTypes = [
                          'image/png',
                          'image/jpeg',
                          'image/jpg',
                          'image/svg+xml',
                          'image/webp',
                        ];
                        return (
                          item.size <= 5000000 && validTypes.includes(item.type)
                        ); // Max size 5MB
                      }
                      return false;
                    }
                  )
              ) as unknown as yup.ObjectSchema<any>);
        } else {
          // Default to string validation
          acc[key] = field.required
            ? yup
                .string()
                .required(
                  `${key === 'url' ? 'Media File' : `${key}`} is required`
                )
            : yup.string();
        }

        return acc;
      },
      {} as Record<
        string,
        | yup.StringSchema
        | yup.ObjectSchema<any>
        | yup.ArraySchema<yup.StringSchema<string | undefined>[], yup.AnyObject>
      >
    )
  );
};

// Utility function to generate the interface as a string
const generateInterface = (metadata: any, interfaceName: string): string => {
  const generateType = (obj: any): string => {
    let result = '';
    for (const key in obj) {
      if (
        obj[key].componentType === 'TextInput' ||
        obj[key].componentType === 'ImageUpload'
      ) {
        result += `${key}: ${obj[key].componentType === 'ImageUpload' ? 'string | File' : 'string'};\n`;
      } else if (typeof obj[key] === 'object' && !obj[key].componentType) {
        result += `${key}: {\n${generateType(obj[key])}};\n`;
      }
    }
    return result;
  };

  return `interface ${interfaceName} {\n${generateType(metadata)}}`;
};

const generateTableFieldsWithType = (data: any) => {
  const tableFields: any = [];
  data.tableFields.forEach((key: string) => {
    if (key.includes('.')) {
      tableFields[key] = getNestedValue(data.metadata, key).componentType;
    } else {
      tableFields[key] = data.metadata[key].componentType;
    }
  });

  return tableFields;
};

const generateInitialValues = <T extends Record<string, any>>(
  metadata: any,
  row?: T,
  parent = ''
): any => {
  const values: any = {};

  for (const key in metadata) {
    if (
      getObjectDepth(metadata[key]) > 2 &&
      metadata[key].componentType !== 'ImageUpload' &&
      metadata[key].componentType !== 'MultipleImageUpload'
    ) {
      values[key] = generateInitialValues(metadata[key], row, key);
    } else {
      if (row) {
        values[key] = parent
          ? row?.[parent]?.[key] || ''
          : row?.[key] !== undefined
            ? row[key]?.id || row[key]
            : ''; // Ensure key is initialized with an empty value if row is not provided
      } else {
        // Set default values based on metadata type
        const type = metadata[key]?.type || 'string'; // Default to string if type is not defined
        values[key] = type === 'Number' ? 0 : ''; // Default to 0 for Number, empty string for others
      }
    }
    // Handle simple fields
  }

  return values;
};

const useFormMetadata = <T extends Record<string, any>>(
  url: string,
  interfaceName: string,
  row?: T
) => {
  const [validationSchema, setValidationSchema] =
    useState<yup.ObjectSchema<any> | null>(null);
  const [headCells, setHeadCells] = useState<
    { id: string; numeric: boolean; label: string }[]
  >([]);
  const [initialValues, setInitialValues] = useState<any>({});
  const [interfaceDefinition, setInterfaceDefinition] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tableFields, setTableFields] = useState([]);
  const [singleInstanceState, setSingleInstanceState] = useState(false);
  const { data, isLoading } = useGetDataByIdQuery(url); // Fetch metadata
  const [viewonlyState, setviewonlyState] = useState(false);
  const [reorderState, setReorderState] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        if (!data) return; // Ensure data is available

        const tableFields = generateTableFieldsWithType(data);
        setTableFields(tableFields);
        // Generate validation schema
        const schema = generateValidationSchema(data.metadata);

        setValidationSchema(schema);
        setSingleInstanceState(data.singleInstanceState);

        setviewonlyState(data.viewOnly);
        setReorderState(data.reOrder);
        //getheadcells
        const headCellsNew = [
          {
            id: 'sn',
            numeric: true,
            label: 'SN',
          },
        ];
        data.tableFields.forEach((key: string, index: number) => {
          headCellsNew.push({
            id: key + Math.floor(Math.random() * 1000) + 1, // Generate random number between 1 and 1000
            numeric: false,
            label: key,
          });
        });
        headCellsNew.push({
          id: 'actions',
          numeric: false,
          label: 'Actions',
        });
        setHeadCells(headCellsNew);

        // Generate interface
        const interfaceString = generateInterface(data.metadata, interfaceName);
        setInterfaceDefinition(interfaceString);
        if (url.includes('ServiceDetailsListSection') && row === undefined) {
          console.log('herecon');
        } else {
          const initialValues = generateInitialValues(data.metadata, row);
          setInitialValues(initialValues);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch metadata');
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [url, interfaceName, row, data]); // Add `data` as a dependency
  return {
    validationSchema,
    interfaceDefinition,
    initialValues,
    loading,
    error,
    rowId: row ? row.id : '',
    headCells,
    tableFields,
    singleInstanceState,
    viewonlyState,
    reorderState,
  };
};

export default useFormMetadata;
