import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, Stack } from '@mui/material';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { gridSpacing } from 'store/constant';
import { toSpacedPascalCaseFromCamelCase } from 'utils/convertToScreamingSnakeCase';

export const getNestedValue = (obj: any, path: string) => {
  return path
    ?.split('.')
    ?.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj
    );
};

const ImageUploadField = ({ formField }: { formField: string }) => {
  const { values, setFieldValue, touched, errors, setFieldError } =
    useFormikContext<any>();
  const [previewImage, setPreviewImage] = useState<string>('');
  useEffect(() => {
    if (getNestedValue(values, formField) instanceof File) {
      const previewUrl = URL.createObjectURL(getNestedValue(values, formField));
      setPreviewImage(previewUrl);
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }
    if (typeof getNestedValue(values, formField) === 'string') {
      setPreviewImage(getNestedValue(values, formField));
    }

    if (values.previewImage) {
      URL.revokeObjectURL(values.previewImage);
    }
  }, [getNestedValue(values, formField)]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/svg+xml',
      'image/webp',
    ];
    if (!validTypes.includes(file.type)) {
      setFieldError('image', 'Only PNG, JPG, JPEG, and SVG files are allowed.');
      return;
    }

    if (file.size > 5000000) {
      setFieldError('image', 'File size exceeds 1MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFieldValue(formField, file);
    setPreviewImage(previewUrl);
    setFieldError(formField, undefined);
  };

  const handleRemoveImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setFieldValue(formField, undefined);
    setPreviewImage('');
  };

  return (
    <Grid spacing={gridSpacing}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={gridSpacing}
        sx={{ width: '100%' }}
      >
        <Grid
          item
          xs={6}
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Typography>{toSpacedPascalCaseFromCamelCase(formField)}</Typography>
          <label
            htmlFor={`containedButtonFile${formField}`}
            style={{ cursor: 'pointer' }}
          >
            <input
              accept=".png, .jpg, .jpeg, .svg"
              style={{ display: 'none' }}
              id={`containedButtonFile${formField}`}
              type="file"
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
        {previewImage && (
          <Grid item xs={6}>
            <Typography variant="subtitle2">Preview:</Typography>
            <Box
              sx={{
                position: 'relative',
                bgcolor: 'black',
                boxShadow: 24,
                width: 100,
                height: 100,
                '&:hover .remove-button': { display: 'block' },
              }}
            >
              <img
                src={previewImage}
                // crossOrigin='anonymous'
                alt="preview"
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
                onClick={handleRemoveImage}
              >
                <CloseIcon fontSize="small" />
              </Button>
            </Box>
          </Grid>
        )}
      </Stack>

      {getNestedValue(touched, formField) &&
        getNestedValue(errors, formField) && (
          <Grid item xs={12}>
            <Typography variant="caption" color="error">
              {
                <Typography>
                  {
                    (getNestedValue(errors, formField)
                      ? typeof getNestedValue(errors, formField) === 'string'
                        ? getNestedValue(errors, formField)
                        : Array.isArray(getNestedValue(errors, formField))
                          ? (
                              getNestedValue(errors, formField) as string[]
                            ).join(', ')
                          : JSON.stringify(getNestedValue(errors, formField))
                      : '') as string
                  }
                </Typography>
              }
            </Typography>
          </Grid>
        )}

      <Grid item xs={12} paddingX={2}>
        <Typography variant="caption">
          Only PNG, JPG, JPEG, and SVG files are allowed. Max size 5MB.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ImageUploadField;
