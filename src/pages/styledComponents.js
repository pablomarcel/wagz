// styledComponents.js
import { styled } from '@mui/system';
import { Card, CardMedia } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    marginBottom: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
    borderRadius: '15px',
    padding: 'rem',

}));

export const StyledCardMedia = styled(CardMedia)({
    height: 0,
    paddingTop: '56.25%', // 16:9 aspect ratio
});

