import React from 'react';
import { useFormikContext } from 'formik';
import { Box, IconButton, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactQuill from 'react-quill'; // Simple direct import
import 'react-quill/dist/quill.snow.css'; // Quill styles
import { toFormattedTitle } from 'utils/convertToScreamingSnakeCase';

interface MissionPointsFieldProps {
  formField: string;
}

const getNestedValue = (obj: any, path: string) => {
  return path
    ?.split('.')
    ?.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj
    );
};

const MissionPointsFieldNestedRichText: React.FC<MissionPointsFieldProps> = ({
  formField,
}) => {
  const { values, touched, errors, setFieldValue } = useFormikContext<any>();

  const fieldValues = getNestedValue(values, formField) || [];

  const handleAddPoint = () => {
    const updatedPoints = [...fieldValues, ''];
    setFieldValue(formField, updatedPoints);
  };

  const handleRemovePoint = (index: number) => {
    const updatedPoints = [...fieldValues];
    updatedPoints.splice(index, 1);
    setFieldValue(formField, updatedPoints);
  };

  const handleChange = (value: string, index: number) => {
    const updatedPoints = [...fieldValues];
    updatedPoints[index] = value;
    setFieldValue(formField, updatedPoints);
  };

  return (
    <Box>
      {fieldValues.map((point: string, index: number) => (
        <Box key={index} mb={3}>
          <Typography variant="subtitle2" mb={1}>
            {`${toFormattedTitle(formField)} ${index + 1}`}
          </Typography>

          <ReactQuill
            theme="snow"
            value={point}
            onChange={(content) => handleChange(content, index)}
            style={{ marginBottom: 8 }}
          />

          {getNestedValue(touched, `${formField}[${index}]`) &&
            getNestedValue(errors, `${formField}[${index}]`) && (
              <Typography variant="caption" color="error">
                {getNestedValue(errors, `${formField}[${index}]`)}
              </Typography>
            )}

          <IconButton
            onClick={() => handleRemovePoint(index)}
            color="error"
            disabled={fieldValues.length === 1}
            sx={{ mt: 1 }}
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

export default MissionPointsFieldNestedRichText;
