// likeComment.js

require('dotenv').config();
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { commentId, userEmail } = JSON.parse(event.body);

    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (owner:PetOwner {email: $userEmail})
            MATCH (comment:Comment {id: $commentId})
            OPTIONAL MATCH (owner)-[r:LIKED]->(comment)
            CALL apoc.do.case(
                r IS NULL,
                'MERGE (owner)-[:LIKED]->(comment) RETURN 1',
                'DELETE r RETURN -1',
                {owner: owner, comment: comment}
            ) YIELD value
            RETURN sum(value) AS change
        `, { commentId, userEmail });

        const change = result.records[0].get('change').toNumber();

        return { statusCode: 200, body: JSON.stringify({ change }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
    } finally {
        await session.close();
    }
};
