import {
  Box,
  Card,
  Divider,
  Paper,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetDataByIdQuery } from 'api/api';
import { useState } from 'react';
import ConfirmApprovePopUp from 'ui-component/extended/confirmApprove';
import { toTitleCaseFromHyphenated } from 'utils/convertToScreamingSnakeCase';

const ViewDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, refetch } = useGetDataByIdQuery(`contact-us/${id}`);
  const customerData = data?.data;
  const [isApprovePopupVisible, setIsApprovePopupVisible] = useState(false);
  const [isPendingPopupVisible, setIsPendingPopupVisible] = useState(false);

  const handleToogleApprove = () => {
    setIsApprovePopupVisible(!isApprovePopupVisible);
  };

  const handleTooglePending = () => {
    setIsPendingPopupVisible(!isPendingPopupVisible);
  };

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
          Contact Us
        </Typography>
        <IconButton onClick={() => navigate(`/contact-us`)} color="primary">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 20, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PersonIcon
            color="primary"
            fontSize="small"
            style={{ paddingBottom: 4 }}
          />
          <Typography variant="h6" fontWeight="medium">
            Name : {customerData?.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PhoneIcon
            color="primary"
            fontSize="small"
            style={{ paddingBottom: 4 }}
          />
          <Typography variant="h6" fontWeight="medium">
            Phone : {customerData?.phone}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HomeIcon
            color="primary"
            fontSize="small"
            style={{ paddingBottom: 4 }}
          />
          <Typography variant="h6" fontWeight="medium">
            Email : {customerData?.email}
          </Typography>
        </Box>
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
                    : customerData?.status?.toLowerCase() === 'followed-up'
                      ? '#2e7d32' // Green
                      : '#d32f2f', // Red
              }}
            >
              {toTitleCaseFromHyphenated(customerData?.status)}
            </Typography>
          </Box>

          {/* Buttons Wrapper */}
          <Box display="flex" gap={1}>
            <Button
              disabled={customerData?.status == 'followed-up'}
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
              Follow Up
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
          </Box>
        </Box>
      </Card>
      {isApprovePopupVisible && (
        <ConfirmApprovePopUp
          handleToggleApprove={handleToogleApprove}
          refetch={refetch}
          openApprove={isApprovePopupVisible}
          url={`contact-us/${id}`}
          title="Follow Up"
          status="followed-up"
        />
      )}

      {isPendingPopupVisible && (
        <ConfirmApprovePopUp
          handleToggleApprove={handleTooglePending}
          refetch={refetch}
          openApprove={isPendingPopupVisible}
          url={`contact-us/${id}`}
          title="Pending"
          status="pending"
        />
      )}
    </Paper>
  );
};

export default ViewDetailsPage;
