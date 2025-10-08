// material-ui
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// assets
import DeleteIcon from '@mui/icons-material/Delete';

// types
import { HeadCell, EnhancedTableToolbarProps } from 'types';
import { toFormattedTitle } from 'utils/convertToScreamingSnakeCase';

// ==============================|| LEAD - TABLE TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }: EnhancedTableToolbarProps) => (
  <Toolbar
    sx={{
      p: 0,
      pl: 2,
      pr: 1,
      ...(numSelected > 0 && { color: 'secondary.main' }),
    }}
  >
    {numSelected > 0 ? (
      <Typography color="inherit" variant="h4">
        {numSelected} Selected
      </Typography>
    ) : (
      <Typography variant="h6" id="tableTitle">
        Nutrition
      </Typography>
    )}
    <Box sx={{ flexGrow: 1 }} />
    {numSelected > 0 && (
      <Tooltip title="Delete">
        <IconButton size="large">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    )}
  </Toolbar>
);

// ==============================|| LEAD - TABLE HEADER ||============================== //

function LeadTableHeader({ headCells }: { headCells: HeadCell[] }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            <TableSortLabel sx={{ textTransform: 'capitalize' }}>
              {toFormattedTitle(headCell.label)}
            </TableSortLabel>
          </TableCell>
        ))}
        {
          <TableCell
            sortDirection={false}
            align="center"
            sx={{ pr: 3 }}
          ></TableCell>
        }
      </TableRow>
    </TableHead>
  );
}

export default LeadTableHeader;
