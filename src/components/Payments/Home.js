
import * as React from 'react';
import { Grid, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { Link, Routes, Route, Outlet } from 'react-router-dom';
import HomeActivity from './HomeActivity';
import HomePaymentMethods from './HomePaymentMethods';
import ActivityTransactions from './ActivityTransactions';
import RecurringPayments from './RecurringPayments';
import SettingsContactInfo from './SettingsContactInfo';
import SettingsSecurity from './SettingsSecurity';
import HelpPayments from './HelpPayments';
import HelpCommonQuestions from './HelpCommonQuestions';
import TermsAndPrivacy from './TermsAndPrivacy';

export default function Home() {
    const listItems = [
        { name: 'Home', route: 'home' },
        { name: 'Activity', route: 'activity' },
        { name: 'Subscriptions', route: 'recurringpayments' },
        { name: 'Settings', route: 'settings' },
        { name: 'Help', route: 'help' },
        { name: 'Terms And Privacy', route: 'termsandprivacy'},
    ];

    return (
        <Grid container justify="center" spacing={3} style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Grid item xs={12} sm={3} style={{ minWidth: '300px' }}>
                <Typography variant="h6" gutterBottom>
                    Payments
                </Typography>
                <List style={{width: '100%'}}>
                    {listItems.map((item, index) => (
                        <ListItem button key={index} component={item.newTab ? 'a' : Link} to={item.route} target={item.newTab ? '_blank' : '_self'} style={{height: '50px'}}>
                            <ListItemText primary={item.name} style={{ width: '100%', textAlign: 'Left' }} />
                        </ListItem>
                    ))}
                </List>
            </Grid>
            <Grid item xs={12} sm={3} style={{ minWidth: '300px' }}>
                <Typography variant="h6" gutterBottom>
                    {/*Second Column*/}
                </Typography>
                <Box bgcolor="background.paper" p={2} borderRadius="borderRadius" boxShadow={1}>
                    <Routes>
                        <Route path="home" element={<HomeActivity />} />
                        <Route path="activity" element={<ActivityTransactions />} />
                        <Route path="recurringpayments" element={<RecurringPayments />} />
                        <Route path="settings" element={<SettingsContactInfo />} />
                        <Route path="help" element={<HelpPayments />} />
                        <Route path="termsandprivacy" element={<TermsAndPrivacy />} />
                    </Routes>
                </Box>
            </Grid>
            <Grid item xs={12} sm={3} style={{ minWidth: '300px' }}>
                <Typography variant="h6" gutterBottom>
                    {/*Third Column*/}
                </Typography>
                <Routes>
                    <Route path="home" element={HomePaymentMethods && <Box bgcolor="background.paper" p={2} borderRadius="borderRadius" boxShadow={1}><HomePaymentMethods /></Box>} />
                    <Route path="settings" element={SettingsSecurity && <Box bgcolor="background.paper" p={2} borderRadius="borderRadius" boxShadow={1}><SettingsSecurity /></Box>} />
                    <Route path="help" element={HelpCommonQuestions && <Box bgcolor="background.paper" p={2} borderRadius="borderRadius" boxShadow={1}><HelpCommonQuestions /></Box>} />
                </Routes>
            </Grid>
            <Outlet />
        </Grid>
    );
}

