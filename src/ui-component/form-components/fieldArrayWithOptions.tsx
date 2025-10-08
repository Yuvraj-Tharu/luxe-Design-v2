import { Button, Card, Grid, TextField, Typography, MenuItem, Autocomplete } from '@mui/material';
import { Field, FieldArray, FieldProps, useFormikContext } from 'formik';
import React from 'react';
import * as Yup from 'yup';

interface IQuestion {
    question: string;
    type: string;
    options?: string[];
}

export const FieldArrayInputWithOptions: React.FC = () => {
    const { values } = useFormikContext<{ questions: IQuestion[] }>();

    return (
        <FieldArray name="questions">
            {({ push, remove }) => (
                <Grid container spacing={2}>
                    {values.questions.map((questionObj, index) => (
                        <Grid item key={index} xs={12}>
                            <Card className="mb-4 p-2 border rounded">
                                <Typography variant="h6" gutterBottom>
                                    Question
                                </Typography>
                                <Field name={`questions[${index}].question`}>
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            label="Enter question"
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            placeholder="Enter question"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                        />
                                    )}
                                </Field>

                                <Typography variant="h6" gutterBottom>
                                    Type
                                </Typography>
                                <Field name={`questions[${index}].type`}>
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Select type"
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                        >
                                            <MenuItem value="text">Text</MenuItem>

                                            <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                                        </TextField>
                                    )}
                                </Field>

                                {questionObj.type === 'multiple-choice' && (
                                    <>
                                        <Typography variant="h6" gutterBottom>
                                            Options (Multi-Select)
                                        </Typography>
                                        <Field name={`questions[${index}].options`}>
                                            {({ field, meta }: FieldProps) => (
                                                <Autocomplete
                                                    multiple
                                                    freeSolo
                                                    options={[]}
                                                    value={questionObj.options || []}
                                                    onChange={(event, newValue) => {
                                                        field.onChange({
                                                            target: {
                                                                name: `questions[${index}].options`,
                                                                value: newValue
                                                            }
                                                        });
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Enter options"
                                                            variant="outlined"
                                                            error={meta.touched && Boolean(meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                        />
                                                    )}
                                                />
                                            )}
                                        </Field>
                                    </>
                                )}

                                <Button type="button" variant="contained" color="error" onClick={() => remove(index)}>
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
                            onClick={() => push({ question: '', answer: '', type: 'text', options: [] })}
                        >
                            Add Inquiry
                        </Button>
                    </Grid>
                </Grid>
            )}
        </FieldArray>
    );
};
