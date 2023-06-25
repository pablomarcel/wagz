const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const subscribePublicFigure = async (hashedUserEmail, publicFigureId) => {
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
                MATCH (user:PetOwner {hashEmail: $hashedUserEmail})
                MATCH (publicFigure:PublicFigure {id: $publicFigureId})
                MERGE (user)-[:SUBSCRIBED_TO]->(publicFigure)
            `,
                { hashedUserEmail, publicFigureId }
            )
        );

        return result;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const { userEmail, publicFigureId } = JSON.parse(event.body);
        const hashedUserEmail = crypto.createHash('sha256').update(userEmail).digest('hex');
        const joinResult = await subscribePublicFigure(hashedUserEmail, publicFigureId);
        return {
            statusCode: 200,
            body: JSON.stringify(joinResult),
        };
    } catch (error) {
        console.error('Error subscribing to Public Figure:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to subscribe to Public Figure' }),
        };
    }
};
