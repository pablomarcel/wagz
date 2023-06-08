const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const subscribePublicFigure = async (followerEmail, publicFigureId) => {
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
          MATCH (follower:PetOwner {email: $followerEmail})
          MATCH (followee:PublicFigure {id: $publicFigureId})
          MERGE (follower)-[:PAID_SUBSCRIBE_TO]->(followee)
        `,
                { followerEmail, publicFigureId }
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
        const followResult = await subscribePublicFigure(followerEmail, publicFigureId);
        return {
            statusCode: 200,
            body: JSON.stringify(followResult),
        };
    } catch (error) {
        console.error('Error paid subscribe to public figure:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to paid subscribe to public figure' }),
        };
    }
};
