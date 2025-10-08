import React from 'react';
import { FormikTouched, useFormikContext } from 'formik';
import { TextField, Box, IconButton, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface MissionPointsFieldProps {
    formField: string;
}

const MissionPointsField: React.FC<MissionPointsFieldProps> = ({ formField }) => {
    const { values, setFieldValue, touched, errors, handleChange, handleBlur } = useFormikContext<any>();

    // Function to add a new mission point
    const handleAddPoint = () => {
        const updatedPoints = [...values[formField], ''];
        setFieldValue(formField, updatedPoints);
    };

    // Function to remove a mission point
    const handleRemovePoint = (index: number) => {
        const updatedPoints = [...values[formField]];
        updatedPoints.splice(index, 1);
        setFieldValue(formField, updatedPoints);
    };

    return (
        <Box>
            {values[formField].map((point: string, index: number) => (
                <Box key={index} display="flex" alignItems="center" mb={2}>
                    <TextField
                        fullWidth
                        name={`${formField}[${index}]`}
                        value={point}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={`${formField} ${index + 1}`}
                        error={
                            (touched[formField] as FormikTouched<string[]> | undefined)?.[index] &&
                            Boolean((errors[formField] as string[] | undefined)?.[index])
                        }
                        helperText={
                            (touched[formField] as FormikTouched<string[]> | undefined)?.[index] &&
                            (errors[formField] as string[] | undefined)?.[index]
                        }
                    />
                    <IconButton
                        onClick={() => handleRemovePoint(index)}
                        color="error"
                        disabled={values[formField].length === 1}
                        sx={{ ml: 1 }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}

            <Button type="button" onClick={handleAddPoint} variant="outlined" startIcon={<AddIcon />}>
                Add {formField}
            </Button>
        </Box>
    );
};

export default MissionPointsField;
