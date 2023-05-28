import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const PostList = ({ posts }) => {
    return (
        <Box>
            {posts.map((post) => (
                <Card key={post.id} sx={{ margin: '1rem 0' }}>
                    <CardContent>
                        <Typography variant="h6">
                            {post.title}
                        </Typography>
                        <Typography variant="body1">
                            {post.content}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default PostList;
