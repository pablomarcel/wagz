const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const getTransactionsByUser = async (userId) => {
    const session = driver.session();
    let result;

    try {
        result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (owner:PetOwner {id: $userId})-[made:MADE]->(t:Transaction)-[to:TO]->(figure:PublicFigure)
                RETURN owner AS PetOwner, made, t AS Transaction, to, figure AS PublicFigure
            `, { userId }
            )
        );

    } catch (error) {
        console.error("Error querying database:", error);
    } finally {
        await session.close();
    }

    if (result.records.length === 0) {
        console.error("No transactions found for owner:", userId);
        return [];
    }

    // Transform the raw Neo4j record into a regular JS object
    return result.records.map(record => {
        return {
            PetOwner: new neo4j.types.Node(record.get('PetOwner').identity, record.get('PetOwner').labels, record.get('PetOwner').properties),
            Transaction: new neo4j.types.Node(record.get('Transaction').identity, record.get('Transaction').labels, record.get('Transaction').properties),
            PublicFigure: new neo4j.types.Node(record.get('PublicFigure').identity, record.get('PublicFigure').labels, record.get('PublicFigure').properties),
        };
    });
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

    // Query the database for the user's transactions
    const transactions = await getTransactionsByUser(userId);

    // Respond with the fetched transactions
    return {
        statusCode: 200,
        body: JSON.stringify(transactions),
    };
};
