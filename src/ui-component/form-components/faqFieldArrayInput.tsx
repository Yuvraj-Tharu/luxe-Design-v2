import { Button, Card, Grid, TextField, Typography } from '@mui/material';
import { Field, FieldArray, FieldProps, useFormikContext } from 'formik';
import React from 'react';
import { toSpacedPascalCaseFromCamelCase } from 'utils/convertToScreamingSnakeCase';
import * as Yup from 'yup';
import RichTextElement from './richText';

interface FAQFieldArrayInputProps {
  formFieldName: string;
  questionField: string;
  descriptionField: string;
}

export const FAQFieldArrayInput: React.FC<FAQFieldArrayInputProps> = ({
  formFieldName,
  questionField = '',
  descriptionField = '',
}) => {
  const { values, errors, touched } = useFormikContext<any>();

  return (
    <>
      <FieldArray name={formFieldName}>
        {({ push, remove }) => (
          <Grid container spacing={2}>
            {values[formFieldName]?.map((item: any, index: number) => (
              <Grid item key={index} xs={12}>
                <Card className="mb-4 p-2 border rounded">
                  <Typography variant="h6" gutterBottom>
                    {toSpacedPascalCaseFromCamelCase(questionField)}
                  </Typography>
                  <Field name={`${formFieldName}[${index}].${questionField}`}>
                    {({ field, meta }: FieldProps) => (
                      <TextField
                        {...field}
                        label={`${toSpacedPascalCaseFromCamelCase(questionField)}`}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        placeholder={`Enter ${questionField}`}
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched && meta.error}
                      />
                    )}
                  </Field>

                  <Typography variant="h6" gutterBottom>
                    {toSpacedPascalCaseFromCamelCase(descriptionField)}
                  </Typography>
                  {/* <Field
                    name={`${formFieldName}[${index}].${descriptionField}`}
                  >
                    {({ field, meta }: FieldProps) => (
                      <TextField
                        {...field}
                        label={`${toSpacedPascalCaseFromCamelCase(descriptionField)}`}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        placeholder={`Enter ${descriptionField}`}
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched && meta.error}
                      />
                    )}
                  </Field> */}

                  <RichTextElement formField={`${formFieldName}[${index}].${descriptionField}`} />
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    onClick={() => remove(index)}
                    sx={{ mt: 2 }}
                  >
                    Remove
                  </Button>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={() =>
                  push({ [questionField]: '', [descriptionField]: '' })
                }
              >
                Add {formFieldName}
              </Button>
            </Grid>
          </Grid>
        )}
      </FieldArray>
    </>
  );
};
