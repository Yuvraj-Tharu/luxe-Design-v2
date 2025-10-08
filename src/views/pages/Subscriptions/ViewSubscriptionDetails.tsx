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
  const { data, refetch } = useGetDataByIdQuery(`subscription/${id}`);
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
          Subscription Details
        </Typography>
        <IconButton onClick={() => navigate(`/subscription`)} color="primary">
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
              Email : {customerData?.email}
            </Typography>
          </Grid>
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
              Subscription Date : {customerData?.created_date}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ViewDetailsPage;
