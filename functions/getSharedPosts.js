const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { receiverEmail } = JSON.parse(event.body);

    // Hash the receiver's email
    const receiverEmailHash = crypto.createHash('sha256').update(receiverEmail).digest('hex');

    const session = driver.session();
    try {
        const result = await session.run(
            `
                MATCH (post:Post)-[:SHARED_WITH]->(receiver:PetOwner {hashEmail: $receiverEmailHash})
                RETURN post
            `, { receiverEmailHash }
        );

        const sharedPosts = result.records.map((record) => record.get('post').properties);

        return { statusCode: 200, body: JSON.stringify(sharedPosts) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to retrieve shared posts' }) };
    } finally {
        await session.close();
    }
};
