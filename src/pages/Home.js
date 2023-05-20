import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    CardMedia,
    IconButton,
    CardActions
} from '@mui/material';
import { styled } from '@mui/system';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    marginBottom: theme.spacing(2),
}));

const StyledCardMedia = styled(CardMedia)({
    height: 0,
    paddingTop: '56.25%', // 16:9 aspect ratio
});

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/.netlify/functions/listPosts')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    return (
        <Container maxWidth="md">
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {`Error fetching data: ${error}`}
                </Alert>
            )}
            <Grid container spacing={2} justifyContent="center">
                {loading ? (
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Grid>
                ) : (
                    posts.map(({ id, caption, pet, owner }) => (
                        <Grid item xs={12} key={id}>
                            <StyledCard>
                                <CardHeader
                                    action={
                                        <IconButton>
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                    title={`Posted by: ${owner ? owner.name : 'Unknown'}`}
                                    subheader={`Pet: ${pet ? pet.name : 'Unknown'}`}
                                />
                                <StyledCardMedia image="https://via.placeholder.com/640x360" title="Post image" />
                                <CardContent>
                                    <Typography variant="body1">{caption}</Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton aria-label="add to favorites">
                                        <FavoriteIcon />
                                    </IconButton>
                                    <IconButton aria-label="comment">
                                        <CommentIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton>
                                    <IconButton aria-label="save">
                                        <SaveIcon />
                                    </IconButton>
                                </CardActions>
                            </StyledCard>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default Home;
