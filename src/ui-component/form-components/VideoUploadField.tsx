import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, Stack } from '@mui/material';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { gridSpacing } from 'store/constant';
import { toSpacedPascalCaseFromCamelCase } from 'utils/convertToScreamingSnakeCase';
import { getNestedValue } from './image_upload';

const VideoUploadField = ({ formField }: { formField: string }) => {
  const { values, setFieldValue, touched, errors, setFieldError } =
    useFormikContext<any>();
  const [previewVideo, setPreviewVideo] = useState<string>('');

  useEffect(() => {
    if (getNestedValue(values, formField) instanceof File) {
      const previewUrl = URL.createObjectURL(getNestedValue(values, formField));
      setPreviewVideo(previewUrl);
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }
    if (typeof getNestedValue(values, formField) === 'string') {
      setPreviewVideo(getNestedValue(values, formField));
    }
  }, [getNestedValue(values, formField)]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      setFieldError(
        formField,
        'Only MP4, WebM, and OGG video files are allowed.'
      );
      return;
    }

    if (file.size > 200000000) {
      // 50MB size limit
      setFieldError(formField, 'File size exceeds 200MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFieldValue(formField, file);
    setPreviewVideo(previewUrl);
    setFieldError(formField, undefined);
  };

  const handleRemoveVideo = () => {
    if (previewVideo) {
      URL.revokeObjectURL(previewVideo);
    }
    setFieldValue(formField, undefined);
    setPreviewVideo('');
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
              accept=".mp4, .webm, .ogg"
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

        {previewVideo && (
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
              <video
                src={previewVideo}
                controls
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
                onClick={handleRemoveVideo}
              >
                <CloseIcon fontSize="small" />
              </Button>
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

      <Grid item xs={12} paddingX={2}>
        <Typography variant="caption">
          Only MP4, WebM, and OGG video files are allowed. Max size 50MB.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default VideoUploadField;
