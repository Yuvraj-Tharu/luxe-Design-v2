import { useFormikContext } from 'formik';
import { Autocomplete, TextField, Typography } from '@mui/material';

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  formField: string;
  options: Option[];
}

export default function EnumSelectInput({
  formField,
  options,
}: SelectInputProps) {
  const { values, setFieldValue, touched, errors } = useFormikContext<any>();

  // Extract field values safely from nested form structure
  const fieldValue =
    formField?.split('.').reduce((obj, key) => obj?.[key], values) || null;
  const errorValue = formField
    ?.split('.')
    ?.reduce((obj, key) => obj?.[key], errors as any) as string | undefined;
  const touchedValue = formField
    ?.split('.')
    ?.reduce((obj, key) => obj?.[key], touched as any) as boolean | undefined;

  return (
    <>
      {
        <Typography sx={{ textTransform: 'capitalize', mb: 1 }}>
          {formField}
        </Typography>
      }
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label}
        value={options.find((opt) => opt.value === fieldValue) || null}
        onChange={(_, newValue) =>
          setFieldValue(formField, newValue ? newValue.value : '')
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={`Select ${formField}`}
            error={touchedValue && Boolean(errorValue)}
            helperText={touchedValue && errorValue}
            fullWidth
          />
        )}
      />
    </>
  );
}
