import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import Activity from './Activity';
import RecurringPayments from './RecurringPayments';
import Help from './Help';
import Settings from './Settings';
import TermsAndPrivacy from './TermsAndPrivacy';

const Payments = () => {
    const location = useLocation();

    return (
        <div>
            <h1>Payments Page</h1>
            <p>Current sub-route: {location.pathname}</p>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/recurringpayments" element={<RecurringPayments />} />
                <Route path="/help" element={<Help />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/termsandprivacy" element={<TermsAndPrivacy />} />
            </Routes>
        </div>
    );
};

export default Payments;
