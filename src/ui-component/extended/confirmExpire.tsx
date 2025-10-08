import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useUpdateDataMutation } from 'api/api';
import { enqueueSnackbar } from 'notistack';

function ConfirmExpirePopUp({
  url,
  openExpire,
  handleToggleExpire,
  refetch,
}: {
  url: string;
  openExpire: boolean;
  handleToggleExpire: any;
  refetch: any;
}) {
  const [expire] = useUpdateDataMutation();
  const handleApprove = async () => {
    try {
      const response = await expire({ url: url });
      if (response.error) {
        enqueueSnackbar('Update Vacancy failed');
        handleToggleExpire();
      } else {
        enqueueSnackbar('Vacancy updated successfully', { variant: 'success' });
        handleToggleExpire();
        refetch();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Dialog open={openExpire} onClose={handleToggleExpire}>
        <DialogTitle>{'Confirm Expire'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to expire this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleExpire} color="primary">
            Cancel
          </Button>
          <Button onClick={handleApprove} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ConfirmExpirePopUp;
