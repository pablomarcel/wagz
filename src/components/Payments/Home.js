import * as React from 'react';
import { Typography, Button, Grid } from '@mui/material';

export default function Home() {
    const seeAll = () => {
        console.log('See All Button Clicked!');
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <Typography variant="h6">Activity</Typography>
                <Button variant="contained" onClick={seeAll}>See All</Button>
                <Typography>No Payment History</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="h6">Payment Methods</Typography>
                <Button variant="contained">Add Payment Method</Button>
                <Typography>Balances</Typography>
            </Grid>
        </Grid>
    );
}
