// getLikedComments.js

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

    const { userEmail } = JSON.parse(event.body);

    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (owner:PetOwner {email: $userEmail})-[:LIKED]->(comment:Comment)
            RETURN comment
            ORDER BY comment.timestamp DESC
        `, { userEmail });

        const likedComments = result.records.map((record) => record.get('comment').properties);

        return { statusCode: 200, body: JSON.stringify(likedComments) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
    } finally {
        await session.close();
    }
};
