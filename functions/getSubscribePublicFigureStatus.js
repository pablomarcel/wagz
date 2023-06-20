const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const getFollowPublicFigureStatus = async (followerEmail, publicFigureId) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (follower:PetOwner {email: $followerEmail})-[r:HAS_SUBSCRIBED_TO]->(followee:PublicFigure {id: $publicFigureId})
                RETURN r IS NOT NULL AS isSubscribed
            `,
                { followerEmail, publicFigureId }
            )
        );

        if (result.records.length === 0) {
            throw new Error('No such public figure found');
        }

        return result.records[0].get('isSubscribed');
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const { followerEmail, publicFigureId } = JSON.parse(event.body);
        const followStatus = await getFollowPublicFigureStatus(followerEmail, publicFigureId);
        return {
            statusCode: 200,
            body: JSON.stringify({ isSubscribed: followStatus }),
        };
    } catch (error) {
        console.error('Error checking paid subscription to public figure status:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to get paid subscription to public figure status' }),
        };
    }
};
