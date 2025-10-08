import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useCreateDataMutation } from '../../../../api/api';
import handleErrors from 'api/apiError';
import { showErrorToast, showSuccessToast } from 'utils/toast';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { ErrorResponse } from 'types/error';
import { DASHBOARD_PATH } from 'config';


const validationSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
    password: Yup.string().max(255).required('Password is required')
});

const initialValues = {
    email: '',
    password: ''
};

const JWTLogin = (props: any) => {
    const theme = useTheme();
    const [showPassword, setShowPassword] = React.useState(false);
    const [createData, { isLoading }] = useCreateDataMutation();
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'userId']);
    const navigate = useNavigate();
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { setErrors }) => {
            try {
                const response: any = await createData({
                    url: `user/login`,
                    newData: { email: values.email, password: values.password }
                });

                if (response?.error) {
                    if ('data' in response.error) {
                        if (response.error.status === 422) {
                            handleErrors(response, formik.setErrors);
                        } else {
                            const errorResponse = response.error.data as ErrorResponse;
                            showErrorToast(errorResponse.message);
                        }
                    } else {
                        showErrorToast('An unexpected error occurred.');
                    }
                    return;
                }
                if (response.data && response.data.status && response.data.status === 'success') {
                    setCookie('accessToken', response?.data?.data.accessToken, { path: '/' });

                    setCookie('userId', response?.data?.data.user, { path: '/' });

                    showSuccessToast(response?.data.message);
                    navigate(DASHBOARD_PATH);
                }
            } catch (error) {
                alert('error');
                console.error('Error saving user:', error);
            }
        }
    });

    return (
        <form noValidate onSubmit={formik.handleSubmit} {...props}>
            <FormControl fullWidth error={Boolean(formik.touched.email && formik.errors.email)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-email-login"
                    type="email"
                    value={formik.values.email}
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                />
                {formik.touched.email && formik.errors.email && <FormHelperText error>{formik.errors.email}</FormHelperText>}
            </FormControl>

            <FormControl
                fullWidth
                error={Boolean(formik.touched.password && formik.errors.password)}
                sx={{ ...theme.typography.customInput }}
            >
                <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.password}
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end" size="large">
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Password"
                />
                {formik.touched.password && formik.errors.password && <FormHelperText error>{formik.errors.password}</FormHelperText>}
            </FormControl>

            <Box sx={{ mt: 2 }}>
                <AnimateButton>
                    <Button color="primary" fullWidth size="large" type="submit" variant="contained">
                        {isLoading ? 'Sign In...' : 'Sign In'}
                    </Button>
                </AnimateButton>
            </Box>
        </form>
    );
};

export default JWTLogin;
