import { useEffect, useState } from 'react';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import { useGetAllDataQuery } from 'api/api';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import LeadTableHeader from 'ui-component/reusable-table-components/LeadTableHeader';
import Filter from 'ui-component/reusable-table-components/Filter';
import { TableHandleEmptyRows } from 'ui-component/reusable-table-components/TableHandleEmptyRows';
import AddLeadDialog from 'ui-component/reusable-table-components/AddLeadDialog';
import useFormMetadata from 'hooks/useEntityMetaData';
import DynamicForm from 'ui-component/forms/DynamicForm';
import { endpointModelMetaData } from 'api/endPoints';
import DynamicTableRow from 'ui-component/table/DynamicTableRow';
import { toPascalCaseFromHyphenedString } from 'utils/convertToScreamingSnakeCase';

type LeadListProps = {
  entityName: string;
};

const CareerBenefitsLeadList = ({ entityName }: LeadListProps) => {
  const [rows, setRows] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [showAdd, setShowAdd] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [search, setSearch] = useState('');

  const handleToggleAddDialog = () => {
    setOpenAddDialog(!openAddDialog);
  };

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
  } = useFormMetadata(url, entityName);

  const { data, isSuccess, refetch } = useGetAllDataQuery({
    url: `/${entityName.toLowerCase()}`,
    params: `search=${search}&page=${page + 1}&perPage=${rowsPerPage}`,
  });

  const handleSearch = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined
  ) => {
    setSearch(event?.target.value || '');
  };

  useEffect(() => {
    if (isSuccess && data) {
      if (singleInstanceState) {
        setRows([data.data]);
      } else {
        setRows(data?.data?.records);
        if (data?.data?.records?.length > 0) {
          setShowAdd(true);
        }
      }
    }
  }, [data, isSuccess, singleInstanceState]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined
  ) => {
    event?.target.value && setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };
  return (
    <MainCard content={false}>
      <Box sx={{ display: 'block' }}>
        <Grid container sx={{ position: 'relative', display: 'block' }}>
          <Grid item xs={12}>
            <Filter
              {...{
                handleSearch,
                showAdd,
                showSearch,
                openAddDialog,
                handleToggleAddDialog,
                search,
                setSearch,
                entityName,
              }}
            />
            {rows?.length ? (
              <Grid item xs={12}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ pl: 3 }}>Title</TableCell>
                        <TableCell align="left">Icon</TableCell>
                        <TableCell align="left">Actions</TableCell>

                        <TableCell align="left" sx={{ pr: 3 }} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableHandleEmptyRows rowNumber={rows?.length || 0}>
                        {rows?.map((row, index) => {
                          if (typeof row === 'number' || !row) return null;

                          return (
                            <DynamicTableRow
                              refetch={refetch}
                              countNumber={page * rowsPerPage + index + 1}
                              row={row}
                              key={row.id || `row-${index}`}
                              modelName={entityName}
                            />
                          );
                        })}
                      </TableHandleEmptyRows>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            ) : null}
            {/* <Table>
                            <LeadTableHeader headCells={headCells} />
                            <TableBody>
                                <TableHandleEmptyRows rowNumber={rows?.length || 0}>
                                    {rows?.map((row, index) => {
                                        if (typeof row === 'number' || !row) return null;

                                        return (
                                            <DynamicTableRow
                                                refetch={refetch}
                                                countNumber={page * rowsPerPage + index + 1}
                                                row={row}
                                                key={row.id || `row-${index}`}
                                                modelName={entityName}
                                            />
                                        );
                                    })}
                                </TableHandleEmptyRows>
                            </TableBody>
                        </Table> */}
          </Grid>
        </Grid>
      </Box>
      <AddLeadDialog
        {...{
          open: openAddDialog,
          handleToggleAddDialog,
          dialogBody: (
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
          ),
          entityName,
        }}
      />
      <TablePagination
        rowsPerPageOptions={[10, 25]}
        component="div"
        count={data?.data?.totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </MainCard>
  );
};

export default CareerBenefitsLeadList;
