import MainLayout from 'layout/MainLayout';
import { useParams } from 'react-router-dom';
import CareerViews from 'views/careers';
import HomeViews from 'views/home';
import Views from 'views';
import MissionViews from 'views/MissionVision';
import AboutUsViews from 'views/about-us';
import ViewConsultationBooking from 'views/pages/ConsultationBooking/ViewConsultationBooking';
import ViewContactUsDetailsPage from 'views/pages/ContactUs/viewContactUsDetailPage';
import ViewSubscriptionDetails from 'views/pages/Subscriptions/ViewSubscriptionDetails';
import AccountSettings from 'views/Profile';
// sample page routing

const DynamicViews = () => {
  const { entityName } = useParams();
  return <Views entityName={entityName || ''} />;
};

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/user/account-profile',
      element: <AccountSettings />,
    },
    {
      path: '/careers',
      element: <CareerViews entityName="careers" />,
    },
    {
      path: '/contact-us/:id',
      element: <ViewContactUsDetailsPage />,
    },
    {
      path: 'vision-mission',
      element: <MissionViews />,
    },
    {
      path: '/home',
      element: <HomeViews entityName="home" />,
    },
    {
      path: '/about-us',
      element: <AboutUsViews entityName="about-us" />,
    },
    {
      path: '/consultation-booking/:id',
      element: <ViewConsultationBooking />,
    },
    {
      path: '/subscription/:id',
      element: <ViewSubscriptionDetails />,
    },
    {
      path: '/:entityName',
      element: <DynamicViews />,
    },
  ],
};

export default MainRoutes;
