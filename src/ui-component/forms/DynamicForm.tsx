import React, { useState, useEffect, SyntheticEvent } from 'react';
import {
  Grid,
  TextField,
  Button,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import {
  FormikProvider,
  FormikTouched,
  FormikValues,
  useFormik,
  useFormikContext,
} from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import ImageUploadField from 'ui-component/form-components/image_upload';
import RichTextElement from 'ui-component/form-components/richText';
import AsyncAutoCompleteComponent from 'ui-component/form-components/AsyncAutoComplete';
import * as ENDPOINTS from '../../api/endPoints';
import {
  useCreateDataMutation,
  useGetDataByIdQuery,
  useUpdateDataMutation,
} from 'api/api';
import { gridSpacing } from 'utils/constant';
import {
  toHyphenatedStringFromPascalCase,
  toPascalCase,
  toPascalCaseFromHyphenedString,
  toScreamingSnakeCase,
  toSpacedPascalCaseFromCamelCase,
} from 'utils/convertToScreamingSnakeCase';
import handleErrors from 'api/apiError';
import { enqueueSnackbar } from 'notistack';
import MissionPointsFieldNested from 'ui-component/form-components/missionPointsFieldArrayInputsNested';
import MultiValuesInput from 'ui-component/form-components/multivalues_text_input';
import { FAQFieldArrayInput } from 'ui-component/form-components/faqFieldArrayInput';
import MultipleImageUploadField from 'ui-component/form-components/multiple-image-upload';
import EnumSelectInput from 'ui-component/form-components/EnumSelectInput';
import DateSelectInput from 'ui-component/form-components/DateSelectInput';
import VideoUploadField from 'ui-component/form-components/VideoUploadField';
import MissionPointsFieldNestedRichText from 'ui-component/form-components/MissionPointsFieldNestedRichText';

interface DynamicFormProps<T> {
  singleInstanceState: boolean;
  refetch: () => Promise<any>;
  rowId: string;
  modelName: string;
  initialValues: T;
  validationSchema: yup.ObjectSchema<any>;
  handleToggleAddDialog: (e: SyntheticEvent) => void;
}

export const getObjectDepth = (obj: any): number => {
  if (typeof obj !== 'object' || obj === null) return 0;
  let maxDepth = 0;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const depth = getObjectDepth(obj[key]);
      if (depth > maxDepth) {
        maxDepth = depth;
      }
    }
  }
  return maxDepth + 1;
};

const checkIfImageExists = (obj: Record<string, any>) => {
  let hasImage: boolean = false;
  let hasImages: boolean = false;

  const keys = Object.keys(obj);

  keys.forEach((key: any) => {
    if (!('componentType' in obj[key])) {
      const nestedResult = checkIfImageExists(obj[key]);
      hasImage = hasImage || nestedResult.hasImage;
      hasImages = hasImages || nestedResult.hasImages;
    } else if (obj[key].componentType === 'ImageUpload') {
      hasImage = true;
    } else if (obj[key].componentType === 'MultipleImageUpload') {
      hasImage = true;
      hasImages = true;
    } else if (obj[key].componentType === 'VideoUpload') {
      hasImage = true;
      hasImages = true;
    }
  });

  return { hasImage, hasImages };
};

const DynamicForm = <T extends FormikValues>({
  rowId,
  modelName,
  singleInstanceState = false, // Default value added
  refetch,
  initialValues,
  validationSchema,
  handleToggleAddDialog,
}: DynamicFormProps<T>) => {
  const [activeTab, setActiveTab] = useState(0); // State for active tab

  const [formMetadata, setFormMetadata] = useState<any>(null);
  const { data, isLoading } = useGetDataByIdQuery(
    `${ENDPOINTS.endpointModelMetaData}?modelName=${toPascalCaseFromHyphenedString(modelName)}`
  );
  const markAllFieldsTouched = (fields: any): FormikTouched<T> => {
    const touchedFields: FormikTouched<T> = {};
    for (const key in fields) {
      if (typeof fields[key] === 'object' && fields[key] !== null) {
        (touchedFields as any)[key] = markAllFieldsTouched(fields[key]); // Recursively mark nested fields
      } else {
        (touchedFields as any)[key] = true; // Mark field as touched
      }
    }
    return touchedFields;
  };

  const touchAllFields = (values: any) => {
    const touched: any = {};

    const markTouched = (obj: any, path = '') => {
      Object.entries(obj).forEach(([key, val]) => {
        const fullPath = path ? `${path}.${key}` : key;
        if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
          markTouched(val, fullPath);
        } else {
          touched[fullPath] = true;
        }
      });
    };

    markTouched(values);
    return touched;
  };
  type MyFormValuesKeys = keyof T;
  const [createEntity, { isLoading: saveEntityLoading }] =
    useCreateDataMutation();

  const [updateEntity, { isLoading: updateEntityLoading }] =
    useUpdateDataMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formik = useFormik<T>({
    initialValues: initialValues,

    enableReinitialize: true,
    validationSchema,
    validateOnBlur: true,
    onSubmit: async (valuesUnsanitized, formikHelpers) => {
      // Mark all fields as touched
      await formik.setTouched(touchAllFields(formik.values), true);

      const errors = await formik.validateForm(); // Validate the form after marking fields as touched
      formik.setErrors(errors);
      setIsSubmitting(true);
      if (Object.keys(errors).length > 0) {
        return; // Stop submission if there are validation errors
      }

      const values = _.omitBy(
        valuesUnsanitized,
        (value) => value == '' || value == null || value == undefined
      );
      const { hasImage, hasImages } = checkIfImageExists(formMetadata);

      let formData: any = {};
      if (hasImage) {
        formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value && typeof value === 'object') {
            if (
              Array.isArray(value) &&
              formMetadata[key].componentType === 'MultipleImageUpload'
            ) {
              let formDataArray: string[] = [];
              value.forEach((item: File | string) => {
                if (typeof item === 'string') {
                  formDataArray.push(item); // Collect strings
                } else if (item instanceof File) {
                  formData.append(key, item); // Append files directly
                }
              });
              formData.append(key, JSON.stringify(formDataArray)); // Append JSON-stringified strings
            } else if (value instanceof File) {
              formData.append(key, value);
            } else {
              Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                if (Array.isArray(nestedValue)) {
                  nestedValue.forEach((item: File | string, index: number) => {
                    formData.append(`${key}[${nestedKey}][${index}]`, item);
                  });
                  return;
                }
                formData.append(`${key}[${nestedKey}]`, nestedValue);
              });
            }
          } else {
            if (value && value === '') {
              return;
            }
            formData.append(key, value as string | Blob);
          }
        });
      } else {
        formData = values; // Use values directly if no image fields are present
      }

      const mockEvent = {
        preventDefault: () => {},
        currentTarget: document.createElement('button'),
      } as unknown as SyntheticEvent;
      const endPointField = toScreamingSnakeCase(modelName);
      try {
        if ((!rowId && rowId.length === 0) || singleInstanceState === true) {
          try {
            const response = await createEntity({
              url: `${modelName}`,
              newData: formData,
            });
            handleErrors(response, formik.setErrors);

            if (
              response.data &&
              response.data.status &&
              response.data.status === 'success'
            ) {
              enqueueSnackbar(
                response.data.message || 'Authority created successfully!',
                { variant: 'success' }
              );
              handleToggleAddDialog(mockEvent);
              setIsSubmitting(false);
              refetch();
            } else {
              enqueueSnackbar('Error creating item', { variant: 'error' });
              setIsSubmitting(false);
            }
          } catch (error) {
            enqueueSnackbar('Error creating item', { variant: 'error' });
            handleToggleAddDialog(mockEvent);
          }
        } else {
          try {
            const response = await updateEntity({
              url: `${modelName}/${rowId}`,
              updateData: formData,
            });
            if (
              response.data &&
              response.data.status &&
              response.data.status === 'success'
            ) {
              enqueueSnackbar(
                response.data.message || 'Authority updated successfully!',
                { variant: 'success' }
              );
              handleToggleAddDialog(mockEvent);
              refetch();
            } else {
              if (response.error && 'data' in response.error) {
                if (
                  response.error &&
                  'data' in response.error &&
                  typeof response.error.data === 'object' &&
                  response.error.data &&
                  'errors' in response.error.data
                ) {
                  if (
                    Array.isArray(response.error.data.errors) &&
                    response.error.data.errors[0]?.msg
                  ) {
                    enqueueSnackbar(response.error.data.errors[0].msg, {
                      variant: 'error',
                    });
                  } else {
                    enqueueSnackbar('An error occurred', { variant: 'error' });
                  }
                } else {
                  enqueueSnackbar('An error occurred', { variant: 'error' });
                }
              } else {
                enqueueSnackbar('An error occurred', { variant: 'error' });
              }
            }
          } catch (error) {
            enqueueSnackbar('Error updating item', { variant: 'error' });
            handleToggleAddDialog(mockEvent);
          }
        }
      } catch (error) {
        alert('error');
        console.error('Error saving user:', error);
      }
      //else just send values to a route
    },
  });

  // Fetch form metadata from the backend
  useEffect(() => {
    if (data && data.metadata) {
      setFormMetadata(data.metadata);
    }
  }, [data]);

  // Helper function to get nested values
  const getNestedValue = (obj: any, path: string) => {
    return path?.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  // Helper function to set nested values
  const setNestedValue = (obj: any, path: string, value: any) => {
    const parts = path?.split('.');
    const last = parts.pop()!;
    const parent = parts.reduce((acc, part) => acc?.[part], obj);
    if (parent) {
      parent[last] = value;
    }
  };

  // Render a single field
  const renderField = (field: string, fieldMetadata: any) => {
    const componentType = fieldMetadata?.componentType;
    const required = fieldMetadata?.required;

    // Get the value for the field (supports nested fields)
    const value = getNestedValue(formik.values, field);

    // Handle change for nested fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      formik.setFieldValue(field, newValue); // Ensure Formik updates the value properly
      formik.setFieldTouched(field, true); // Mark the field as touched
    };

    switch (componentType) {
      case 'TextField':
        return (
          <Grid item key={field} xs={12} sx={{ px: 2, gap: gridSpacing }}>
            <TextField
              fullWidth
              id={field}
              name={field}
              label={toSpacedPascalCaseFromCamelCase(
                field?.split('.').pop() || ''
              )}
              placeholder={field?.split('.').pop()}
              value={value || ''}
              onChange={handleChange}
              error={(() => {
                const touchedValue = getNestedValue(formik.touched, field);
                const errorValue = getNestedValue(formik.errors, field);

                return touchedValue && Boolean(errorValue);
              })()}
              helperText={
                getNestedValue(formik.touched, field) &&
                typeof getNestedValue(formik.errors, field) === 'string'
                  ? getNestedValue(formik.errors, field)
                  : undefined
              }
            />
          </Grid>
        );
      case 'TextArea':
        return (
          <Grid item key={field} xs={12} sx={{ px: 2, gap: gridSpacing }}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              id={field}
              name={field}
              label={toSpacedPascalCaseFromCamelCase(
                field?.split('.').pop() || ''
              )}
              placeholder={field?.split('.').pop()}
              value={value || ''}
              onChange={handleChange}
              error={(() => {
                const touchedValue = getNestedValue(formik.touched, field);
                const errorValue = getNestedValue(formik.errors, field);
                return touchedValue && Boolean(errorValue);
              })()}
              helperText={
                getNestedValue(formik.touched, field) &&
                typeof getNestedValue(formik.errors, field) === 'string'
                  ? getNestedValue(formik.errors, field)
                  : undefined
              }
            />
          </Grid>
        );
      case 'NumberField':
        return (
          <Grid
            item
            key={field}
            xs={4}
            sx={{ px: gridSpacing, gap: gridSpacing }}
          >
            <TextField
              fullWidth
              id={field}
              type="number"
              name={field}
              label={toSpacedPascalCaseFromCamelCase(
                field?.split('.').pop() || ''
              )} // Use the last part of the field path as the label
              placeholder={field?.split('.').pop()} // Use the last part of the field path as the placeholder
              value={value || ''} // Use the nested value or fallback to ''
              onChange={handleChange} // Use the custom change handler
              // onBlur={formik.handleBlur}
              error={(() => {
                const touchedValue = getNestedValue(formik.touched, field);
                const errorValue = getNestedValue(formik.errors, field);

                return touchedValue && Boolean(errorValue);
              })()}
              helperText={
                getNestedValue(formik.touched, field) &&
                typeof getNestedValue(formik.errors, field) === 'string'
                  ? getNestedValue(formik.errors, field)
                  : undefined
              }
            />
          </Grid>
        );

      case 'RichTextEditor':
        return (
          <Grid xs={12}>
            <RichTextElement<Extract<MyFormValuesKeys, string>>
              {...{ formField: field as Extract<keyof T, string> }}
            />
          </Grid>
        );

      case 'MultipleImageUpload':
        return (
          <Grid
            item
            xs={12}
            key={field + Math.floor(Math.random() * 1000) + 1}
            px={2}
          >
            <MultipleImageUploadField formField={field} />
          </Grid>
        );

      case 'ArrayInputsObject':
        return (
          <Grid
            item
            key={field}
            xs={12}
            sx={{ px: gridSpacing, gap: gridSpacing }}
          >
            <FAQFieldArrayInput
              formFieldName={field}
              questionField={fieldMetadata?.questionField}
              descriptionField={fieldMetadata?.descriptionField}
            />
          </Grid>
        );

      case 'ImageUpload':
        return (
          <Grid item xs={12} key={field}>
            <ImageUploadField formField={field} />
          </Grid>
        );

      case 'VideoUpload':
        return (
          <Grid item xs={12} key={field}>
            <VideoUploadField formField={field} />
          </Grid>
        );
      case 'AutoComplete':
        const refStrField = fieldMetadata?.ref?.strField || '';
        const dependsOnClass = fieldMetadata?.dependsOn || '';
        const dynamicUrl = dependsOnClass
          ? `${toHyphenatedStringFromPascalCase(fieldMetadata?.ref?.model)}?${toHyphenatedStringFromPascalCase(dependsOnClass)}=`
          : toHyphenatedStringFromPascalCase(fieldMetadata?.ref?.model || '');
        // if (dependsOnClass) {
        //   toHyphenatedStringFromPascalCase(dependsOnClass);
        // } else {
        //   toHyphenatedStringFromPascalCase(fieldMetadata?.ref?.model || '');
        // }

        return (
          <Grid item xs={12} key={field} sx={{ px: 2, gap: gridSpacing }}>
            <AsyncAutoCompleteComponent
              formField={field}
              entityName={field}
              dependsOnClass={dependsOnClass}
              url={dynamicUrl}
              mapFunction={(item: any) => ({
                id: item.id,
                name: item[refStrField],
              })}
            />
          </Grid>
        );

      case 'AutoCompleteMultiple':
        const refStrFieldMultiple = fieldMetadata?.ref?.strField || '';
        const dynamicUrlMultiple = toHyphenatedStringFromPascalCase(
          fieldMetadata?.ref?.model || ''
        );

        return (
          <Grid item xs={12} key={field} sx={{ px: 2, gap: gridSpacing }}>
            <AsyncAutoCompleteComponent
              multiple={true}
              formField={field}
              entityName={field}
              url={dynamicUrlMultiple}
              mapFunction={(item: any) => ({
                id: item.id,
                name: item[refStrFieldMultiple],
              })}
            />
          </Grid>
        );

      case 'Password':
        return (
          <Grid item xs={12} sx={{ px: gridSpacing, gap: gridSpacing }}>
            <TextField
              type="password"
              name={field}
              value={formik.values?.[field]}
              onChange={formik.handleChange}
              error={formik.touched?.[field] && Boolean(formik.errors?.[field])}
              // helperText={formik.touched.currentPassword && formik.errors.currentPassword}
              id="outlined-basic7"
              fullWidth
              label="Current Password"
            />
          </Grid>
        );
      case 'Email':
        return (
          <Grid item xs={12} sx={{ px: gridSpacing, gap: gridSpacing }}>
            <TextField
              fullWidth
              id="email"
              name={field}
              label="Email"
              placeholder="Email"
              value={formik.values?.[field]}
              onChange={formik.handleChange}
              error={(() => {
                const touchedValue = getNestedValue(formik.touched, field);
                const errorValue = getNestedValue(formik.errors, field);

                return touchedValue && Boolean(errorValue);
              })()}
              helperText={
                getNestedValue(formik.touched, field) &&
                typeof getNestedValue(formik.errors, field) === 'string'
                  ? getNestedValue(formik.errors, field)
                  : undefined
              }
            />
          </Grid>
        );

      case 'ArrayInputsString':
        return (
          <Grid item xs={12} sx={{ px: gridSpacing, gap: gridSpacing }}>
            <MissionPointsFieldNested formField={field} />
          </Grid>
        );

      case 'ArrayInputsRichText':
        return (
          <Grid item xs={12} sx={{ px: gridSpacing, gap: gridSpacing }}>
            <MissionPointsFieldNestedRichText formField={field} />
          </Grid>
        );

      case 'MultiValuesInput':
        return (
          <Grid item xs={12}>
            <MultiValuesInput formField={field} />
          </Grid>
        );
      case 'EnumSelectInput':
        const options =
          fieldMetadata?.enumValues?.map((option: any) => ({
            label: toPascalCaseFromHyphenedString(option),
            value: option,
          })) || [];
        return (
          <Grid item xs={12} sx={{ px: gridSpacing, gap: gridSpacing }}>
            <EnumSelectInput formField={field} options={options} />
          </Grid>
        );

      case 'DateInput':
        return (
          <Grid item xs={12} sx={{ px: gridSpacing, gap: gridSpacing }}>
            <DateSelectInput formField={field} />
          </Grid>
        );
      default:
        return null;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  // Render fields recursively
  const renderFields = (metadata: any, parentField = '') => {
    return Object.keys(metadata).map((field) => {
      const fieldName = parentField ? `${parentField}.${field}` : field;
      const fieldMetadata = metadata[field];

      const isNestedObject =
        getObjectDepth(fieldMetadata) > 1 && !fieldMetadata.componentType;

      if (isNestedObject) {
        if (field === 'seo') return null;

        return (
          <Grid item xs={12} key={fieldName}>
            <Box
              sx={{
                border: '1px solid #ccc',
                padding: 2,
                paddingBottom: 3,
                marginTop: 2,
                width: 630,
              }}
            >
              <Typography variant="h6" gutterBottom>
                {toSpacedPascalCaseFromCamelCase(field)}
              </Typography>
              <Grid container direction="column" sx={{ gap: 1.5, width: 620 }}>
                {renderFields(fieldMetadata, fieldName)}
              </Grid>
            </Box>
          </Grid>
        );
      }

      return (
        <React.Fragment key={fieldName}>
          {renderField(fieldName, fieldMetadata)}
        </React.Fragment>
      );
    });
  };

  console.log(formik.errors, 'Errors');

  return (
    <CardContent sx={{ px: 2, py: 3 }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ marginBottom: 2 }}
      >
        <Tab label="General" />
        {formMetadata?.seo && <Tab label="SEO" />}
      </Tabs>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormikProvider value={formik}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await formik.setTouched(touchAllFields(formik.values), true);
                const errors = await formik.validateForm();
                formik.setErrors(errors);
                formik.handleSubmit(e);
              }}
            >
              <Grid container spacing={gridSpacing}>
                {formMetadata ? (
                  activeTab === 0 ? (
                    renderFields(formMetadata || {})
                  ) : (
                    renderFields(formMetadata.seo || {}, 'seo')
                  )
                ) : (
                  <p>Loading...</p>
                )}
              </Grid>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'left',
                  paddingLeft: 16,
                }}
              >
                <Button
                  sx={{
                    paddingX: 2,
                    marginTop: 2,
                    minWidth: 100,
                    backgroundColor: '#0a1018',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#263646',
                    },
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            </form>
          </FormikProvider>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default DynamicForm;
