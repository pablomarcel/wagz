const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const getSubscriptionsByUser = async (userId) => {
    const session = driver.session();
    let result;

    try {
        result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (owner:PetOwner {id: $userId})-[:HAS_SUBSCRIBED_TO]->(figure:PublicFigure)
                RETURN figure AS Subscription
            `, { userId }
            )
        );

    } catch (error) {
        console.error("Error querying database:", error);
    } finally {
        await session.close();
    }

    if (result.records.length === 0) {
        console.error("No subscriptions found for owner:", userId);
        return [];
    }

    // Transform the raw Neo4j record into a regular JS object
    return result.records.map(record => new neo4j.types.Node(record.get('Subscription').identity, record.get('Subscription').labels, record.get('Subscription').properties));
};

exports.handler = async (event, context) => {
    // Parse the user ID from the request body
    const { userId } = JSON.parse(event.body);
    if (!userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing userId parameter' }),
        };
    }

    // Query the database for the user's subscriptions
    const subscriptions = await getSubscriptionsByUser(userId);

    // Respond with the fetched subscriptions
    return {
        statusCode: 200,
        body: JSON.stringify(subscriptions),
    };
};
