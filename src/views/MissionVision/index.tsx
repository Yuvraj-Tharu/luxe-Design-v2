import { Box, Container } from '@mui/material';
import { useGetAllDataQuery } from 'api/api';
import { endpointModelMetaData } from 'api/endPoints';
import useFormMetadata from 'hooks/useEntityMetaData';
import { url } from 'inspector';
import React, { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import DynamicForm from 'ui-component/forms/DynamicForm';
import { toPascalCaseFromHyphenedString } from 'utils/convertToScreamingSnakeCase';
import * as yup from 'yup';

export const index = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [openAddDialog, setOpenAddDialog] = useState(true);
  const handleToggleAddDialog = () => {
    setOpenAddDialog(!openAddDialog);
  };

  const entityName = 'vision-mission';
  const url = `${endpointModelMetaData}?modelName=${toPascalCaseFromHyphenedString(entityName)}`;

  const {
    validationSchema,
    interfaceDefinition,
    initialValues,
    loading,
    error,
    rowId,
    headCells,
    singleInstanceState,
  } = useFormMetadata(url, entityName, rows[0]);

  const { data, isSuccess, refetch } = useGetAllDataQuery({
    url: `/${entityName.toLowerCase()}`,
    params: `search=${search}&page=${page + 1}&perPage=${rowsPerPage}`,
  });
  useEffect(() => {
    if (isSuccess && data) {
      setRows([data.data]);
    }
  }, [data, isSuccess]);
  return (
    <MainCard title="Vision and Mission">
      <Box
        id="home-section"
        sx={{
          backgroundColor: '#eef2f6',
          borderRadius: 1,
          p: 2,
          scrollMargin: '100px',
        }}
      >
        <MainCard content={false} sx={{ p: 3, boxShadow: 3 }}>
          <DynamicForm
            singleInstanceState={singleInstanceState}
            handleToggleAddDialog={handleToggleAddDialog}
            rowId={rowId}
            refetch={refetch}
            modelName={entityName}
            initialValues={initialValues}
            validationSchema={
              validationSchema || yup.object().shape<Record<string, any>>({})
            }
          />
        </MainCard>
      </Box>
    </MainCard>
  );
};
export default index;
