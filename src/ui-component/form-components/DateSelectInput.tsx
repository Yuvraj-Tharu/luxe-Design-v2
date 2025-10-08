import * as React from 'react';
import { useFormikContext } from 'formik';
import { Grid, Typography, InputAdornment } from '@mui/material';
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DateRangeIcon from '@mui/icons-material/DateRange';
import dayjs from 'dayjs';

interface UnifiedDatePickerProps {
  formField: string; // Made required for Formik compatibility
  label?: string;
}

const DateSelectInput: React.FC<UnifiedDatePickerProps> = ({
  formField,
  label,
}) => {
  const formik = useFormikContext<any>();

  // Retrieve Formik field value
  const fieldValue =
    formField?.split('.').reduce((obj, key) => obj?.[key], formik.values) ||
    null;

  // Retrieve Formik error and touched status
  const errorValue = formField
    ?.split('.')
    ?.reduce((obj, key) => obj?.[key], formik.errors as any) as
    | string
    | undefined;

  const touchedValue = formField
    ?.split('.')
    ?.reduce((obj, key) => obj?.[key], formik.touched as any) as
    | boolean
    | undefined;

  // Handle Date Change
  const handleChange = (newValue: dayjs.Dayjs | null) => {
    formik.setFieldValue(formField, newValue?.toISOString() || '');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {label && (
            <Typography sx={{ textTransform: 'capitalize', mb: 1 }}>
              {label}
            </Typography>
          )}
          <MobileDateTimePicker
            value={fieldValue ? dayjs(fieldValue) : null} // Ensure value is a dayjs object
            onChange={handleChange}
            label={label || 'Select Date & Time'}
            format="YYYY/MM/DD hh:mm A"
            slotProps={{
              textField: {
                margin: 'normal',
                fullWidth: true,
                error: touchedValue && Boolean(errorValue),
                helperText: touchedValue && errorValue,
                InputProps: {
                  endAdornment: (
                    <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                      <DateRangeIcon />
                    </InputAdornment>
                  ),
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DateSelectInput;
