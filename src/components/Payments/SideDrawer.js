import * as React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

export default function SideDrawer() {
    const drawerOptions = ['Home', 'Activity', 'Subscriptions', 'Settings', 'Help', 'TermsAndPrivacy'];

    return (
        <List>
            {drawerOptions.map((text, index) => (
                <ListItem button key={text} component={Link} to={`/payments/${text.toLowerCase()}`}>
                    <ListItemText primary={text} />
                </ListItem>
            ))}
        </List>
    );
}
