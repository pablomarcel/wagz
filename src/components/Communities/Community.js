import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const StyledCardMedia = styled(CardMedia)({
    paddingTop: '56.25%', // 16:9
});

const StyledLink = styled(Link)({
    textDecoration: 'none',
    color: 'inherit',
    display: 'block', // This is important to make the link occupy the full space of the Card
});

const Community = ({ community }) => (
    <StyledLink to={`/communityProfile/${community.id}`}>
        <Card
            sx={{
                maxWidth: '100%',
                height: '360px',
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
                backgroundColor: '#f5f5f5',
                borderRadius: '15px',
            }}
        >
            <StyledCardMedia
                image={community.fileUrl ? community.fileUrl : "https://via.placeholder.com/640x360"}
                title="Community image"
            />
            <CardContent>
                <Typography variant="h5" color="text.secondary">
                    {community.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {community.about}
                </Typography>
            </CardContent>
        </Card>
    </StyledLink>
);

export default Community;
