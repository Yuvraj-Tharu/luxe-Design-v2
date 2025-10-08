import { SyntheticEvent } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
// project imports

// assets
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import { toTitleCaseFromHyphenated } from 'utils/convertToScreamingSnakeCase';

// types

type AddLeadProps<T> = {
  open: boolean;
  handleToggleAddDialog?: (e: SyntheticEvent) => void;
  dialogBody: JSX.Element;
  entityName: string;
  row?: T;
};

// ==============================|| ADD LEAD ||============================== //

const AddLeadDialog = <T,>({
  open,
  handleToggleAddDialog,
  dialogBody,
  row,
  entityName,
}: AddLeadProps<T>) => {
  return (
    <Dialog
      open={open}
      onClose={handleToggleAddDialog}
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: '100%',
          width: 696,
          borderRadius: 3,
          py: 0,
        },
      }}
    >
      {open && (
        <>
          <DialogTitle sx={{ px: 3, py: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              {!row ? (
                <Typography variant="h4">
                  Add {toTitleCaseFromHyphenated(entityName)}
                </Typography>
              ) : (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h4">
                    Edit {toTitleCaseFromHyphenated(entityName)}
                  </Typography>
                </Stack>
              )}
              <IconButton
                sx={{ p: 0 }}
                size="small"
                onClick={handleToggleAddDialog}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 0 }}>{dialogBody}</DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default AddLeadDialog;
