import React, { useEffect, useState } from 'react';
import Item from './Item';
import { Grid } from '@mui/material';

const ItemList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('/.netlify/functions/getShopItems', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                const itemData = await response.json();
                setItems(itemData);
            } catch (error) {
                console.error('Error fetching shop items:', error);
            }
        };

        fetchItems();
    }, []);

    return (
        <Grid container spacing={3}>
            {items.map((item) => (
                <Grid item xs={12} md={4} key={item.id} style={{ minHeight: '500px' }}>
                    <Item item={item} />
                </Grid>
            ))}
        </Grid>
    );
};

export default ItemList;
