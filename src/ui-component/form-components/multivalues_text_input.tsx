import React, { KeyboardEventHandler } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useFormikContext } from 'formik';
import { Typography } from '@mui/material';

const components = {
  DropdownIndicator: null,
};

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

interface MultiValueInputProps {
  formField: string;
}

export default function MultiValuesInput({ formField }: MultiValueInputProps) {
  const { values, setFieldValue, touched, errors } = useFormikContext<any>(); // Use 'any' if form values have a flexible structure
  const [inputValue, setInputValue] = React.useState('');

  // Safely access nested values using lodash `get` (alternative: split keys and reduce)
  const fieldValue =
    formField?.split('.').reduce((obj, key) => obj?.[key], values) || [];
  const errorValue = formField
    ?.split('.')
    .reduce((obj, key) => obj?.[key], errors as any) as string | undefined;
  const touchedValue = formField
    ?.split('.')
    .reduce((obj, key) => obj?.[key], touched as any) as boolean | undefined;

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;

    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      setFieldValue(formField, [...fieldValue, inputValue]);
      setInputValue('');
    }
  };

  return (
    <>
      <Typography sx={{ textTransform: 'capitalize' }}>{formField}</Typography>
      <CreatableSelect
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={(newValue) => {
          const newKeywords = newValue.map((option) => option.value);
          setFieldValue(formField, newKeywords);
        }}
        onInputChange={(newValue) => setInputValue(newValue)}
        onKeyDown={handleKeyDown}
        placeholder="Type  and press enter..."
        value={fieldValue.map((keyword: string) => createOption(keyword))}
      />
      {touchedValue && errorValue && (
        <div style={{ color: 'red', marginTop: '5px' }}>
          {
            (errors[formField]
              ? typeof errors[formField] === 'string'
                ? errors[formField]
                : Array.isArray(errors[formField])
                  ? (errors[formField] as string[]).join(', ')
                  : JSON.stringify(errors[formField])
              : '') as string
          }
        </div>
      )}
    </>
  );
}
