/* eslint-disable no-unused-vars */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import {Helmet} from "react-helmet";

const Payments = () => {
    return (
        <div>
            <Helmet>
                <title>Wagzters - Payments</title>
                <meta name="description" content="Manage your payments on Wagzters. Pay for services, make donations, or support our work."/>
                <meta property="og:title" content="Wagzters - Payments" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://i.imgur.com/jrbqoWp.png" />
                <meta property="og:url" content="https://wagzters.com/payments" />
                <meta property="og:description" content="Manage your payments on Wagzters. Pay for services, make donations, or support our work." />
            </Helmet>
            <Routes>
                <Route path="/*" element={<Home />} />
            </Routes>
        </div>
    );
};

export default Payments;
