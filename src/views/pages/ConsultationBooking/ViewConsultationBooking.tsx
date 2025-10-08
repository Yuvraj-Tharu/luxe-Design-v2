import {
  Box,
  Card,
  Divider,
  Paper,
  Typography,
  IconButton,
  Button,
  Grid,
  CardContent,
  TextField,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useFormik } from 'formik';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { enqueueSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetDataByIdQuery, useUpdateDataMutation } from 'api/api';
import { useState } from 'react';
import ConfirmApprovePopUp from 'ui-component/extended/confirmApprove';

const ViewDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, refetch } = useGetDataByIdQuery(`consultation-booking/${id}`);
  const customerData = data?.data;
  const [isApprovePopupVisible, setIsApprovePopupVisible] = useState(false);
  const [isRejectPopupVisible, setIsRejectPopupVisible] = useState(false);
  const [isPendingPopupVisible, setIsPendingPopupVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [createNote] = useUpdateDataMutation();

  const handleToogleApprove = () => {
    setIsApprovePopupVisible(!isApprovePopupVisible);
  };

  const handleToogleReject = () => {
    setIsRejectPopupVisible(!isRejectPopupVisible);
  };

  const handleTooglePending = () => {
    setIsPendingPopupVisible(!isPendingPopupVisible);
  };

  interface MyFormValues {
    note: string;
  }

  const formik = useFormik<MyFormValues>({
    initialValues: { note: 'Mention Note Here' },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await createNote({
          url: `/consultation-booking/${id}`,
          newData: values,
        });

        if (response.data?.status === 'success') {
          enqueueSnackbar(
            response.data.message || 'Note updated successfully!',
            {
              variant: 'success',
            }
          );
          refetch(); // Refresh data
          setIsEditing(false); // Exit edit mode
        } else {
          enqueueSnackbar('Error updating note', { variant: 'error' });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Something went wrong', { variant: 'error' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Paper
      elevation={4}
      sx={{ p: 4, borderRadius: 3, backgroundColor: '#fafafa' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary">
          Consultation Booking Details
        </Typography>
        <IconButton
          onClick={() => navigate(`/consultation-booking`)}
          color="primary"
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ p: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
        {/* Customer Information */}
        <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <PersonIcon
              color="primary"
              fontSize="small"
              style={{ marginBottom: 4 }}
            />
            <Typography variant="h6" fontWeight="medium">
              Name : {customerData?.name}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <PhoneIcon
              color="primary"
              fontSize="small"
              style={{ marginBottom: 4 }}
            />
            <Typography variant="h6" fontWeight="medium">
              Phone Number : {customerData?.phone}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <HomeIcon
              color="primary"
              fontSize="small"
              style={{ marginBottom: 4 }}
            />
            <Typography variant="h6" fontWeight="medium">
              Address : {customerData?.address}
            </Typography>
          </Grid>
        </Grid>

        {/* Time Information */}
        <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <CalendarMonthIcon
              color="primary"
              fontSize="small"
              style={{ marginBottom: 4 }}
            />
            <Typography variant="h6" fontWeight="medium">
              Consultation Date: {customerData?.created_date}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          p: 2,
          backgroundColor: '#e3f2fd',
          borderRadius: 2,
          marginBottom: 2,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight="bold"
          sx={{ mb: 1 }}
        >
          Message:
        </Typography>
        <Typography variant="body1" color="text.primary" fontStyle="italic">
          {customerData?.message}
        </Typography>
      </Box>
      <Card sx={{ marginBottom: 4, backgroundColor: '#F5F5F5' }}>
        <CardContent>
          {!isEditing ? (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1">
                <strong>Note:</strong> {formik.values.note}
              </Typography>
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Edit Note
              </Button>
            </Box>
          ) : (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <TextField
                fullWidth
                multiline
                id="note"
                name="note"
                label="Edit Note"
                value={formik.values.note}
                onChange={formik.handleChange}
                sx={{ flexGrow: 1, mr: 2 }}
              />
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  onClick={() => formik.handleSubmit()}
                >
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
      <Card
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: '#e8f5e9',
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              Status:
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                borderRadius: '5px',
                color:
                  customerData?.status?.toLowerCase() === 'pending'
                    ? '#ffa726' // Orange
                    : customerData?.status?.toLowerCase() === 'approved'
                      ? '#2e7d32' // Green
                      : '#d32f2f', // Red
              }}
            >
              {customerData?.status}
            </Typography>
          </Box>

          {/* Buttons Wrapper */}
          <Box display="flex" gap={1}>
            <Button
              disabled={customerData?.status == 'approved'}
              variant="contained"
              color="success"
              size="small"
              onClick={() => setIsApprovePopupVisible(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'semibold',
              }}
            >
              Approve
            </Button>

            <Button
              disabled={customerData?.status == 'pending'}
              variant="contained"
              color="warning"
              size="small"
              onClick={() => setIsPendingPopupVisible(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'semibold',
              }}
            >
              Pending
            </Button>

            <Button
              disabled={customerData?.status == 'rejected'}
              variant="contained"
              color="error"
              size="small"
              onClick={() => setIsRejectPopupVisible(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'semibold',
              }}
            >
              Reject
            </Button>
          </Box>
        </Box>
      </Card>
      {isApprovePopupVisible && (
        <ConfirmApprovePopUp
          handleToggleApprove={handleToogleApprove}
          refetch={refetch}
          openApprove={isApprovePopupVisible}
          url={`consultation-booking/${id}`}
          title="Approve"
          status="approved"
        />
      )}

      {isRejectPopupVisible && (
        <ConfirmApprovePopUp
          handleToggleApprove={handleToogleReject}
          refetch={refetch}
          openApprove={isRejectPopupVisible}
          url={`consultation-booking/${id}`}
          title="Reject"
          status="rejected"
        />
      )}

      {isPendingPopupVisible && (
        <ConfirmApprovePopUp
          handleToggleApprove={handleTooglePending}
          refetch={refetch}
          openApprove={isPendingPopupVisible}
          url={`consultation-booking/${id}`}
          title="Pending"
          status="pending"
        />
      )}
    </Paper>
  );
};

export default ViewDetailsPage;
