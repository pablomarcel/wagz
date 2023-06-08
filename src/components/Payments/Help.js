import * as React from 'react';
import { Typography, Grid } from '@mui/material';

export default function Help() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={9}>
                <Typography>Payments</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography>Common Questions</Typography>
            </Grid>
        </Grid>
    );
}
