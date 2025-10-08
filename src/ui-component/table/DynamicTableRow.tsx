import { useState } from 'react';

// mui
import * as ENDPOINTS from '../../api/endPoints';
import IconButton from '@mui/material/IconButton';
import EditTwoTone from '@mui/icons-material/EditTwoTone';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// third-party
import { Chance } from 'chance';

// project imports
import useConfig from 'hooks/useConfig';
import * as yup from 'yup';
// assets

// types

import AddLeadDialog from 'ui-component/reusable-table-components/AddLeadDialog';
import DynamicForm from 'ui-component/forms/DynamicForm';
import { Avatar, Checkbox } from '@mui/material';
import { endpointModelMetaData } from 'api/endPoints';
import { toPascalCaseFromHyphenedString } from 'utils/convertToScreamingSnakeCase';
import DeletePopUp from 'ui-component/extended/deletePopUp';
import useFormMetadata from 'hooks/useEntityMetaData';
import { useNavigate } from 'react-router-dom';
interface Props<T extends Record<string, any>> {
  row: T;
  countNumber: number;
  refetch: () => Promise<any>;
  modelName: string;
}

// ==============================|| LEAD LIST - TABLE BODY ||============================== //

const DynamicTableRow = <T extends Record<string, any>>({
  row,
  countNumber,
  refetch,
  modelName,
}: Props<T>) => {
  const { borderRadius } = useConfig();
  const url = `${endpointModelMetaData}?modelName=${toPascalCaseFromHyphenedString(modelName)}`;
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const {
    validationSchema,
    interfaceDefinition,
    loading,
    error,
    initialValues,
    rowId,
    tableFields,
    singleInstanceState,
    viewonlyState,
  } = useFormMetadata(url, modelName, row);
  const [open, setOpen] = useState(false);
  const deleteUrl = `${modelName}/${row.id}`;
  const handleToggleDelete = () => {
    setOpen(!open);
  };
  const handleToggleAddDialog = () => {
    setOpenAddDialog(!openAddDialog);
  };

  // Utility function to access nested properties
  const getNestedValue = (obj: any, path: string): any => {
    return path?.split('.').reduce((acc, key) => acc?.[key], obj);
  };
  const navigate = useNavigate();
  return (
    <>
      {rowId && (
        <TableRow hover role="checkbox" tabIndex={-1}>
          <TableCell>
            <Typography variant="h5">{countNumber}</Typography>
          </TableCell>
          {Object.entries(tableFields).map(([key, value]) => {
            const cellValue = getNestedValue(row, key); // Access nested value
            if (value === 'ImageUpload') {
              return (
                <TableCell key={key}>
                  <Avatar
                    src={cellValue as string}
                    // imgProps={{ crossOrigin: 'anonymous' }}
                  />
                </TableCell>
              );
            } else {
              return (
                <TableCell key={key}>
                  <Typography variant="h5">
                    {String(cellValue ?? '')}
                  </Typography>
                </TableCell>
              );
            }
          })}

          <TableCell sx={{ pr: 3 }}>
            <Stack direction="row" spacing={1.25} justifyContent="left">
              {viewonlyState ? (
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => navigate(`/${modelName}/${row.id}`)}
                  sx={{
                    borderRadius: `${borderRadius}px`,
                    p: 1.25,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              ) : (
                <IconButton
                  color="primary"
                  size="small"
                  onClick={handleToggleAddDialog}
                  sx={{
                    borderRadius: `${borderRadius}px`,
                    p: 1.25,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <EditTwoTone />
                </IconButton>
              )}
              <IconButton
                color="error"
                size="small"
                sx={{
                  borderRadius: `${borderRadius}px`,
                  p: 1.25,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
                onClick={handleToggleDelete}
              >
                <DeleteOutlineOutlined />
              </IconButton>
            </Stack>
          </TableCell>
        </TableRow>
      )}
      <DeletePopUp {...{ open, handleToggleDelete, url: deleteUrl, refetch }} />

      <AddLeadDialog<T>
        {...{
          open: openAddDialog,
          handleToggleAddDialog,
          row,
          dialogBody: (
            <DynamicForm
              handleToggleAddDialog={handleToggleAddDialog}
              modelName={modelName}
              initialValues={initialValues}
              validationSchema={
                (validationSchema as yup.ObjectSchema<any>) || yup.object()
              }
              refetch={refetch}
              rowId={rowId}
              singleInstanceState={singleInstanceState}
            />
          ),
          entityName: modelName,
        }}
      />
    </>
  );
};

export default DynamicTableRow;
