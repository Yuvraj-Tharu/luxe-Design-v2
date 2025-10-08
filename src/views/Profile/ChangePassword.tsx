// material-ui
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { IconButton, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { useCreateDataMutation } from 'api/api';
import handleErrors from 'api/apiError';
import { useSnackbar } from 'notistack';
import { DASHBOARD_PATH } from 'config';

interface MyFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const validationSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),

  newPassword: yup
    .string()
    .min(6, 'New password must be at least 6 characters long')
    .required('New password is required'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const [changePassword, { isLoading: saveChangePasswordLoading }] =
    useCreateDataMutation();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik<MyFormValues>({
    initialValues: {
      // _id: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };
      try {
        const response = await changePassword({
          url: '/user/change-password',
          newData: formData,
        });

        handleErrors(response, formik.setErrors);
        if (response.data.statusCode === 200) {
          enqueueSnackbar('Password changed successfully!', {
            variant: 'success',
          });
        }
      } catch (error) {
        alert('error');
        console.error('Error changing password:', error);
      }
    },
  });
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <SubCard title="Change Password">
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={gridSpacing} sx={{ mb: 1.75 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  type="password"
                  name="currentPassword"
                  value={formik.values.currentPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.currentPassword &&
                    Boolean(formik.errors.currentPassword)
                  }
                  helperText={
                    formik.touched.currentPassword &&
                    formik.errors.currentPassword
                  }
                  id="outlined-basic7"
                  fullWidth
                  label="Current Password"
                />
              </Grid>
            </Grid>
            <Grid container spacing={gridSpacing} sx={{ mb: 1.75 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-basic8"
                  fullWidth
                  type={`${showPassword ? 'text' : 'password'}`}
                  name="newPassword"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.newPassword &&
                    Boolean(formik.errors.newPassword)
                  }
                  helperText={
                    formik.touched.newPassword && formik.errors.newPassword
                  }
                  label="New Password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-basic8"
                  fullWidth
                  type={`${showConfirmPassword ? 'text' : 'password'}`}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  label="Confirm Password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                          size="large"
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              spacing={2}
              container
              justifyContent="flex-end"
              sx={{ mt: 3 }}
            >
              <Grid item>
                <AnimateButton>
                  <Button type="submit" variant="contained">
                    Change Password
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => {
                    navigate(DASHBOARD_PATH);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </SubCard>
      </Grid>
    </Grid>
  );
};

export default ChangePassword;
