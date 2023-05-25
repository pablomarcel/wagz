const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { sharerEmail, postId, receiverEmail } = JSON.parse(event.body);

    const session = driver.session();

    console.log('sharerEmail: ', sharerEmail);
    console.log('postId: ', postId);
    console.log('receiverEmail: ', receiverEmail);

    try {
        await session.writeTransaction((tx) =>
            tx.run(`
        MATCH (sharer:PetOwner {email: $sharerEmail})
        MATCH (post:Post {id: $postId})
        MATCH (receiver:PetOwner {email: $receiverEmail})
        MERGE (sharer)-[:SHARES { timestamp: datetime() }]->(post)
        MERGE (post)-[:SHARED_WITH { seen: false }]->(receiver)
    `, { sharerEmail, postId, receiverEmail })
        );

        return { statusCode: 200, body: 'Post Shared Successfully' };
    } catch (error) {
        console.log('sharerEmail: ', sharerEmail);
        console.log('postId: ', postId);
        console.log('receiverEmail: ', receiverEmail);
        console.log('Error: ', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to share the post' }) };
    } finally {
        await session.close();
    }
};
