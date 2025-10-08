import get from 'lodash/get';

import { useFormikContext } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { toSpacedPascalCaseFromCamelCase } from 'utils/convertToScreamingSnakeCase';
const RichTextElement = <T extends string>({ formField }: { formField: T }) => {
  const { values, setFieldValue, touched, errors, handleBlur } =
    useFormikContext<any>();
  const value = get(values, formField) || '';
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'], // remove formatting
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'bullet',
    'indent',
    'direction',
    'align',
    'link',
    'image',
    'video',
  ];

  return (
    <Box maxWidth="xl">
      <Paper sx={{ p: 3, mb: 2 }} style={{ height: 250 }}>
        {/* Title Input */}

        {/* Rich Text Editor */}
        <Typography variant="body1" sx={{ mb: 1 }}>
          {toSpacedPascalCaseFromCamelCase(formField)}
        </Typography>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={(value) => setFieldValue(formField, value)}
          onBlur={() => handleBlur({ target: { name: formField } })}
          style={{ height: 150 }}
          modules={modules}
          formats={formats}
        />
        {touched[formField] && errors[formField] && (
          <Typography color="error" variant="body2">
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
        )}

        {/* Submit Button */}
      </Paper>
    </Box>
  );
};

export default RichTextElement;
