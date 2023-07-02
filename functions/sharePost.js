const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { sharerEmail, postId, receiverEmail } = JSON.parse(event.body);

    //(`Received sharerEmail: ${sharerEmail}, postId: ${postId}, receiverEmail: ${receiverEmail}`);

    // Hashing the sharer's email only
    const hashedSharerEmail = crypto.createHash('sha256').update(sharerEmail).digest('hex');

    //console.log(`Hashed sharerEmail: ${hashedSharerEmail}, receiverEmail: ${receiverEmail}`);

    const session = driver.session();

    try {
        await session.writeTransaction((tx) =>
            tx.run(`
        MATCH (sharer:PetOwner {hashEmail: $hashedSharerEmail})
        MATCH (post:Post {id: $postId})
        MATCH (receiver:PetOwner {hashEmail: $receiverEmail})
        MERGE (sharer)-[:SHARES { timestamp: datetime() }]->(post)
        MERGE (post)-[:SHARED_WITH { seen: false }]->(receiver)
    `, { hashedSharerEmail, postId, receiverEmail })
        );

        //console.log('Cypher query executed successfully');
        return { statusCode: 200, body: 'Post Shared Successfully' };
    } catch (error) {
        console.error(`Error while executing Cypher query: ${error}`);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to share the post' }) };
    } finally {
        //console.log('Closing session');
        await session.close();
    }
};
