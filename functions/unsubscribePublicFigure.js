const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const unsubscribePublicFigure = async (followerEmail, publicFigureId) => {
    const session = driver.session();

    // Hash the email
    const hashedFollowerEmail = crypto.createHash('sha256').update(followerEmail).digest('hex');

    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
          MATCH (follower:PetOwner {hashEmail: $hashedFollowerEmail})-[r:PAID_SUBSCRIBE_TO]->(unfollowee:PublicFigure {id: $publicFigureId})
          DELETE r
        `,
                { hashedFollowerEmail, publicFigureId }
            )
        );

        return result;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const { followerEmail, publicFigureId } = JSON.parse(event.body);
        const unfollowResult = await unsubscribePublicFigure(followerEmail, publicFigureId);
        return {
            statusCode: 200,
            body: JSON.stringify(unfollowResult),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to paid unsubscribed to public figure' }),
        };
    }
};
