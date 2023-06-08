import * as React from 'react';
import { Typography, Button, Grid, Switch, FormControlLabel, TextField, MenuItem } from '@mui/material';

export default function Settings() {
    const currencies = ['USD', 'EUR', 'GBP'];

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <Typography>Shipping Address</Typography>
                <Button variant="contained">Add Shipping Address</Button>
                <Typography>Email</Typography>
                <Button variant="contained">Add Email</Button>
                <Typography>Phone Number</Typography>
                <Typography>User's Phone Number</Typography>
                <Button variant="contained">Add Phone Number</Button>
            </Grid>
            <Grid item xs={4}>
                <Typography>Security</Typography>
                <FormControlLabel control={<Switch />} label="Require PIN Confirmation" />
                <Typography>Currency</Typography>
                <TextField select defaultValue="USD" variant="outlined">
                    {currencies.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
        </Grid>
    );
}
