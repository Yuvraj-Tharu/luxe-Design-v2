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

function ConfirmApprovePopUp({
  url,
  openApprove,
  handleToggleApprove,
  refetch,
  title,
  status,
}: {
  url: string;
  openApprove: boolean;
  handleToggleApprove: any;
  refetch: any;
  title: string;
  status: string;
}) {
  const [approve] = useUpdateDataMutation();
  const handleApprove = async () => {
    try {
      const response = await approve({
        url: url,
        updateData: { status: `${status}` },
      });
      if (response.error) {
        enqueueSnackbar('  Update failed');
        handleToggleApprove();
      } else {
        enqueueSnackbar('Updated successfully', { variant: 'success' });
        handleToggleApprove();
        refetch();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Dialog open={openApprove} onClose={handleToggleApprove}>
        <DialogTitle>{`Confirm ${title}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {title.toLocaleLowerCase()} this message?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleApprove} color="primary">
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

export default ConfirmApprovePopUp;
