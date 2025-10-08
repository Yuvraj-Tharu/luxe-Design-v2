import * as React from 'react';

// material-ui
import Fab from '@mui/material/Fab';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

// project import

// assets
import AddIcon from '@mui/icons-material/AddTwoTone';

import SearchIcon from '@mui/icons-material/Search';
import { IconReorder } from '@tabler/icons-react';
import { Box, Divider, Typography } from '@mui/material';
import { toSpacedPascalCaseFromHyphenated } from 'utils/convertToScreamingSnakeCase';

// types

interface LeadFilterProps<T> {
  singleInstanceState?: boolean;
  reorderState?: Boolean;
  search: string;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  handleToggleAddDialog: () => void;
  handleReorder?: () => void;
  handleSearch: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  showAdd?: boolean;
  showSearch?: boolean;
  entityName: string;
}

// ==============================|| LEAD - SEARCH FILTER ||============================== //

const Filter = <T,>({
  handleToggleAddDialog,
  handleReorder,
  entityName,
  handleSearch,
  search,
  showAdd = true,
  showSearch = true,
  singleInstanceState,
  reorderState,
}: LeadFilterProps<T>) => {
  // const handleSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {

  //     const newString = event?.target.value;
  //     setSearch(newString || '');

  //     // if (newString) {
  //     //     const newRows = rows?.filter((row: KeyedObject) => {
  //     //         let matches = true;
  //     //         const properties = ['id', 'name'];
  //     //         let containsQuery = false;

  //     //         properties.forEach((property) => {
  //     //             if (row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
  //     //                 containsQuery = true;
  //     //             }
  //     //         });
  //     //         if (!containsQuery) {
  //     //             matches = false;
  //     //         }
  //     //         return matches;
  //     //     });
  //     //     setRows(newRows);
  //     // } else {
  //     //     setRows(rows);
  //     // }
  // };

  return (
    <>
      <Stack
        sx={{ p: 3 }}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        spacing={2}
      >
        {/* Search field */}
        {showSearch && (
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            placeholder={`Search ${entityName}`}
            size="small"
            value={search}
            onChange={handleSearch}
          />
        )}

        {/* Title & Action buttons */}
        {showAdd && (
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            gap={1}
          >
            {/* Title */}
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Add {toSpacedPascalCaseFromHyphenated(entityName)}
            </Typography>

            {/* Icon buttons */}
            {!singleInstanceState && (
              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title="Add New Service">
                  <Fab
                    color="primary"
                    size="small"
                    onClick={handleToggleAddDialog}
                    sx={{
                      boxShadow: 'none',
                      width: 32,
                      height: 32,
                      minHeight: 32,
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </Fab>
                </Tooltip>
                {reorderState && (
                  <Tooltip title="Reorder Services">
                    <Fab
                      color="primary"
                      size="small"
                      onClick={handleReorder}
                      sx={{
                        boxShadow: 'none',
                        width: 32,
                        height: 32,
                        minHeight: 32,
                      }}
                    >
                      <IconReorder fontSize="small" />
                    </Fab>
                  </Tooltip>
                )}
              </Box>
            )}
          </Box>
        )}
      </Stack>
    </>
  );
};

export default Filter;
