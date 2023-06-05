const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const getCommunityPost = async (postId) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (post:CommunityPost { id: $postId })
                RETURN post
            `, { postId })
        );

        if (result.records.length === 0) {
            return null;
        }

        const postData = result.records[0].get('post').properties;

        return {
            id: postData.id,
            caption: postData.caption,
            fileUrl: postData.fileUrl
        };
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {

    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing post id' }),
            };
        }

        const body = JSON.parse(event.body);
        const postItem = await getCommunityPost(body.postId);

        if (!postItem) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Post not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(postItem),
        };
    } catch (error) {
        console.error('Error fetching post:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch post' }),
        };
    }
};
