import React, { useEffect, useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import '@mui/lab';

// project imports
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import MainCard from 'ui-component/cards/MainCard';

// third-party
import * as yup from 'yup';

import { useFormik } from 'formik';

import { Box, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import CareerLeadList from 'views/careers/careerIndex';

// yup validation-schema
const validationSchema = yup.object({
  invoiceNumber: yup.string().required('Invoice Number is Required'),
  customerName: yup.string().required('Customer Name is Required'),
  customerEmail: yup
    .string()
    .email('Enter a valid email')
    .required('Customer Email is Required'),
  customerPhone: yup
    .string()
    .min(10, 'Phone number should be of minimum 10 characters')
    .required('Customer Phone is Required'),
  customerAddress: yup.string().required('Customer Address is Required'),
  orderStatus: yup.string().required('Order Status is required'),
});

// ==============================|| CREATE INVOICE ||============================== //

function CreateInvoice({ entityName }: { entityName: string }) {
  const location = useLocation();
  const formik = useFormik({
    initialValues: {
      invoiceNumber: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      orderStatus: 'pending',
    },
    validationSchema,
    onSubmit: (values) => {
      if (values) {
        setOpen(true);
      }
    },
  });

  // array of products
  const initialProducsData = [
    {
      id: 1,
      product: 'Logo Design',
      description: 'lorem ipsum dolor sit amat, connecter adieu siccing eliot',
      quantity: 6,
      amount: 200.0,
      total: 1200.0,
    },
    {
      id: 2,
      product: 'Landing Page',
      description: 'lorem ipsum dolor sit amat, connecter adieu siccing eliot',
      quantity: 7,
      amount: 100.0,
      total: 700.0,
    },
    {
      id: 3,
      product: 'Admin Template',
      description: 'lorem ipsum dolor sit amat, connecter adieu siccing eliot',
      quantity: 5,
      amount: 150.0,
      total: 750.0,
    },
  ];

  const [allAmounts, setAllAmounts] = useState({
    subTotal: 0,
    appliedTaxValue: 0.1,
    appliedDiscountValue: 0.05,
    taxesAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
  });

  const [productsData, setProductsData] = useState(initialProducsData);
  const [open, setOpen] = useState(false);
  const [valueBasic, setValueBasic] = React.useState<Date | null>(new Date());
  const [addItemClicked, setAddItemClicked] = useState<boolean>(false);

  // calculates costs when order-details change
  useEffect(() => {
    const amounts = {
      subTotal: 0,
      appliedTaxValue: 0.1,
      appliedDiscountValue: 0.05,
      taxesAmount: 0,
      discountAmount: 0,
      totalAmount: 0,
    };
    productsData.forEach((item) => {
      amounts.subTotal += item.total;
    });
    amounts.taxesAmount = amounts.subTotal * amounts.appliedTaxValue;
    amounts.discountAmount =
      (amounts.subTotal + amounts.taxesAmount) * amounts.appliedDiscountValue;
    amounts.totalAmount =
      amounts.subTotal + amounts.taxesAmount - amounts.discountAmount;
    setAllAmounts(amounts);
  }, [productsData]);

  // to delete row in order details
  const deleteProductHandler = (id: number) => {
    setProductsData(productsData.filter((item) => item.id !== id));
  };

  // Dialog Handler
  const handleDialogOk = () => {
    setOpen(false);
    formik.resetForm();
  };

  // add item handler
  const handleAddItem = (addingData: any) => {
    setProductsData([
      ...productsData,
      {
        id: addingData.id,
        product: addingData.name,
        description: addingData.desc,
        quantity: addingData.selectedQuantity,
        amount: addingData.amount,
        total: addingData.totalAmount,
      },
    ]);

    setAddItemClicked(false);
  };

  const links = [{ label: 'Home', id: 'home-section' }];

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      const section = document.getElementById(sectionId);
      if (section) {
        // const yOffset = -130; // Adjust this value based on your navbar height
        // const y =
        //     section.getBoundingClientRect().top + window.scrollY + yOffset;
        // window.scrollTo({ top: y, behavior: "smooth" });
        window.scrollBy(0, section.getBoundingClientRect().top - 10000);
      }
    }
  }, [location]);

  return (
    <>
      <MainCard title="Home Page">
        <Box
          id="home-section"
          sx={{
            backgroundColor: '#eef2f6',
            borderRadius: 1,
            p: 2,
            scrollMargin: '100px',
          }}
        >
          <CareerLeadList entityName="home" />
        </Box>
      </MainCard>
    </>
  );
}

export default CreateInvoice;
