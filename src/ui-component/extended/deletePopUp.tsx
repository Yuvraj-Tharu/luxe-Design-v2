import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useDeleteDataMutation } from 'api/api';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';

function DeletePopUp({ url, open, handleToggleDelete, refetch }: { url: string; open: boolean; handleToggleDelete: any; refetch: any }) {
    const [deleteData, { isLoading }] = useDeleteDataMutation();
    const handleDelete = async () => {
        try {
            const response = await deleteData(url);
            if (response.data.statusCode === 200) {
                enqueueSnackbar(response.data.message || 'Item deleted successfully', { variant: 'success' });
                refetch();
                handleToggleDelete();
            }
        } catch (error) {
            enqueueSnackbar('Item delete failed', { variant: 'error' });
        }
    };
    return (
        <>
            <Dialog open={open} onClose={handleToggleDelete}>
                <DialogTitle>{'Confirm Deletion'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleToggleDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DeletePopUp;
