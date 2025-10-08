import { Grid, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useFormikContext } from 'formik';
import { useFetchOptions } from 'hooks/useFetchAndCreateOptions';
import { useEffect, useState } from 'react';
import { OptionType } from 'types/entities';
import {
  toHyphenatedStringFromPascalCase,
  toSpacedPascalCaseFromCamelCase,
  toSpacedPascalCaseFromHyphenated,
} from 'utils/convertToScreamingSnakeCase';

interface ServiceOption {
  id: string;
  name: string;
}

const AsyncAutoCompleteComponent = ({
  dependsOnClass = '',
  url,
  formField,
  entityName,
  mapFunction,
  multiple = false,
}: {
  dependsOnClass?: string;
  formField: string;
  entityName: string;
  url: string;
  mapFunction: (item: OptionType) => { id: string; name: string };
  multiple?: boolean;
}) => {
  const { values, setFieldValue, touched, errors } = useFormikContext<any>();
  const [urlState, setUrlState] = useState('');
  const [entitiesOptions, setEntitiesOptions] = useState<ServiceOption[]>([]);

  const { options } = useFetchOptions(urlState, mapFunction);

  const [filteredServiceOptions, setFilteredServiceOptions] = useState<
    ServiceOption[]
  >([]);

  const isServiceOption = (value: any): value is ServiceOption => {
    return (
      value && typeof value === 'object' && 'id' in value && 'name' in value
    );
  };

  useEffect(() => {
    if (options && options.length > 0) {
      setEntitiesOptions(options);
      setFilteredServiceOptions(options);
    }
  }, [options]);
  useEffect(() => {
    setUrlState(url)
    if (dependsOnClass !== '' && values[toHyphenatedStringFromPascalCase(dependsOnClass)] !== undefined) {

      setUrlState(
        `${url}${values[toHyphenatedStringFromPascalCase(dependsOnClass)]}`
      );
    }
  }, [
    values[toHyphenatedStringFromPascalCase(dependsOnClass)],
    dependsOnClass,
    values,
  ]);

  const handleChange = (
    event: any,
    newValue: ServiceOption | ServiceOption[] | null
  ) => {
    if (multiple && Array.isArray(newValue)) {
      setFieldValue(
        formField,
        newValue.map((item) => item.id)
      );
    } else if (isServiceOption(newValue)) {
      setFieldValue(formField, newValue.id);
    } else {
      setFieldValue(formField, multiple ? [] : null); // Handle empty selection
    }
  };

  return (
    <Grid item xs={12}>
      <Autocomplete
        multiple={multiple}
        options={filteredServiceOptions}
        getOptionLabel={(option: ServiceOption) => option.name}
        filterOptions={(options, { inputValue }) =>
          options.filter((option) =>
            option.name.toLowerCase().includes(inputValue.toLowerCase())
          )
        }
        onInputChange={(event, newInputValue) => {
          setFilteredServiceOptions(
            entitiesOptions.filter((option) =>
              option.name.toLowerCase().includes(newInputValue.toLowerCase())
            )
          );
        }}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        value={
          multiple
            ? entitiesOptions.filter((option) =>
              values?.[formField]?.includes(option.id)
            ) // ✅ For multiple selections
            : entitiesOptions.find(
              (option) => option.id === values?.[formField]
            ) || null // ✅ For single selection
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={toSpacedPascalCaseFromCamelCase(entityName)}
            placeholder={`Enter ${toSpacedPascalCaseFromCamelCase(entityName)}`}
            variant="outlined"
            error={touched[formField] && Boolean(errors[formField])}
            helperText={touched[formField] && (errors[formField] as string)}
          />
        )}
      />
    </Grid>
  );
};

export default AsyncAutoCompleteComponent;
