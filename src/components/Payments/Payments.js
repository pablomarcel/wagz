/* eslint-disable no-unused-vars */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';

const Payments = () => {
    return (
        <div>
            <Routes>
                <Route path="/*" element={<Home />} />
            </Routes>
        </div>
    );
};

export default Payments;
