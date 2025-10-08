import React from 'react';
import { useFormikContext } from 'formik';
import { TextField, Box, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface MissionPointsFieldProps {
  formField: string; // Supports "our_mission.listItems" or any nested path
}

// Helper function to get a nested value
const getNestedValue = (obj: any, path: string) => {
  return path
    ?.split('.')
    ?.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj
    );
};

const MissionPointsFieldNested: React.FC<MissionPointsFieldProps> = ({
  formField,
}) => {
  const { values, touched, errors, handleChange, handleBlur, setFieldValue } =
    useFormikContext<any>();

  // Get the nested field value
  const fieldValues = getNestedValue(values, formField) || [];

  // Function to add a new mission point
  const handleAddPoint = () => {
    const updatedPoints = [...fieldValues, '']; // Add a new empty string
    setFieldValue(formField, updatedPoints); // Update the nested field using setFieldValue
  };

  // Function to remove a mission point
  const handleRemovePoint = (index: number) => {
    const updatedPoints = [...fieldValues];
    updatedPoints.splice(index, 1); // Remove the item at the specified index
    setFieldValue(formField, updatedPoints); // Update the nested field using setFieldValue
  };

  return (
    <Box>
      {fieldValues.map((point: string, index: number) => (
        <Box key={index} display="flex" alignItems="center" mb={2}>
          <TextField
            fullWidth
            name={`${formField}[${index}]`}
            value={point}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={`${formField} ${index + 1}`}
            error={
              Boolean(getNestedValue(touched, `${formField}[${index}]`)) &&
              Boolean(getNestedValue(errors, `${formField}[${index}]`))
            }
            helperText={
              getNestedValue(touched, `${formField}[${index}]`) &&
              getNestedValue(errors, `${formField}[${index}]`)
            }
          />
          <IconButton
            onClick={() => handleRemovePoint(index)}
            color="error"
            disabled={fieldValues.length === 1}
            sx={{ ml: 1 }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Button
        type="button"
        onClick={handleAddPoint}
        variant="outlined"
        startIcon={<AddIcon />}
      >
        Add {formField}
      </Button>
    </Box>
  );
};

export default MissionPointsFieldNested;
