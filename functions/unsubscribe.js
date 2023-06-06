const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const unsubscribePublicFigure = async (userEmail, publicFigureId) => {
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
                MATCH (user:PetOwner {email: $userEmail})-[relationship:SUBSCRIBED_TO]->(publicFigure:PublicFigure {id: $publicFigureId})
                DELETE relationship
            `,
                { userEmail, publicFigureId }
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
        const unsubscribeResult = await unsubscribePublicFigure(userEmail, publicFigureId);
        return {
            statusCode: 200,
            body: JSON.stringify(unsubscribeResult),
        };
    } catch (error) {
        console.error('Error unsubscribing Public Figure:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to unsubscribe Public Figure' }),
        };
    }
};
