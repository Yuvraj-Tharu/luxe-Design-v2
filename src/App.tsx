import { RouterProvider } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

// routing
import router from 'routes';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';

import ThemeCustomization from 'themes';

// ==============================|| APP ||============================== //

const App = () => {
    return (
        <ThemeCustomization>
            <Locales>
                <NavigationScroll>
                    <SnackbarProvider maxSnack={3}>
                        <>
                            <RouterProvider router={router} />
                        </>
                    </SnackbarProvider>
                </NavigationScroll>
            </Locales>
        </ThemeCustomization>
    );
};

export default App;
