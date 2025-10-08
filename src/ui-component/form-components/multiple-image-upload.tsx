import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, Stack } from '@mui/material';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { gridSpacing } from 'store/constant';
import Add from '@mui/icons-material/Add';
import {
  toScreamingSnakeCase,
  toSpacedPascalCaseFromCamelCase,
} from 'utils/convertToScreamingSnakeCase';

const MultipleImageUploadField = ({ formField }: { formField: string }) => {
  const { values, setFieldValue, touched, errors, setFieldError } =
    useFormikContext<any>();
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (Array.isArray(values[formField])) {
      const urls = values[formField].map((file: File | string) =>
        file instanceof File ? URL.createObjectURL(file) : file
      );
      setPreviewImages(urls);

      return () => {
        urls.forEach((url: any) => URL.revokeObjectURL(url));
      };
    }
  }, [values[formField]]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/svg+xml',
      'image/webp',
    ];
    const maxSize = 5000000; // 1MB
    const newFiles: File[] = [];

    for (const file of Array.from(files)) {
      if (!validTypes.includes(file.type)) {
        setFieldError(
          formField,
          'Only PNG, JPG, JPEG, and SVG files are allowed.'
        );
        return;
      }

      if (file.size > maxSize) {
        setFieldError(formField, 'Each file must not exceed 1MB.');
        return;
      }

      newFiles.push(file);
    }

    const updatedFiles = [...(values[formField] || []), ...newFiles];
    setFieldValue(formField, updatedFiles);
    setFieldError(formField, undefined);
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = [...values[formField]];
    updatedFiles.splice(index, 1);
    setFieldValue(formField, updatedFiles);

    const updatedPreviews = [...previewImages];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };

  return (
    <Grid
      spacing={gridSpacing}
      key={Math.floor(Math.random() * (1000 - 1 + 1)) + 1}
    >
      <Stack direction="row" alignItems="center" spacing={gridSpacing}>
        <Grid item xs={12}>
          <Typography>{toSpacedPascalCaseFromCamelCase(formField)}</Typography>

          <label htmlFor={`containedButtonFile${formField}`}>
            <input
              accept=".png, .jpg, .jpeg, .svg"
              style={{ display: 'none' }}
              id={`containedButtonFile${formField}`}
              type="file"
              multiple
              key={Math.floor(Math.random() * (1000 - 1 + 1)) + 1}
              onChange={handleFileChange}
            />

            <div
              style={{
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 1,
                width: '50%',
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                marginTop: 10,
              }}
            >
              <Add fontSize="large" sx={{ color: 'text.secondary' }} />
            </div>
          </label>
        </Grid>

        {previewImages.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="subtitle2">Previews:</Typography>
            <Box
              sx={{
                display: 'flex',
                gap: '1rem',
                marginTop: 2,
                flexWrap: 'wrap',
              }}
            >
              {previewImages.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                    marginBottom: 2,
                    '&:hover .remove-button': { display: 'block' },
                  }}
                >
                  <img
                    key={Math.floor(Math.random() * (1000 - 1 + 1)) + 1}
                    src={image}
                    // crossOrigin="anonymous"
                    alt={`preview-${index}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 4,
                    }}
                  />
                  <Button
                    className="remove-button"
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{
                      display: 'none',
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      minWidth: 'auto',
                      p: 0.5,
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <CloseIcon fontSize="small" />
                  </Button>
                </Box>
              ))}
            </Box>
          </Grid>
        )}
      </Stack>

      {touched[formField] && errors[formField] && (
        <Grid item xs={12}>
          <Typography variant="caption" color="error">
            {
              (errors[formField]
                ? typeof errors[formField] === 'string'
                  ? errors[formField]
                  : Array.isArray(errors[formField])
                    ? (errors[formField] as string[]).join(', ')
                    : JSON.stringify(errors[formField])
                : '') as string
            }
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} style={{ paddingTop: 10 }}>
        <Typography variant="caption">
          Only PNG, JPG, JPEG, and SVG files are allowed. Max size 1MB per file.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default MultipleImageUploadField;
