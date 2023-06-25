require('dotenv').config();
const neo4j = require('neo4j-driver');
const crypto = require('crypto'); // <-- Require the crypto module

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { postId, userEmail } = JSON.parse(event.body);

    // Generate the SHA-256 hash of the email
    const hash = crypto.createHash('sha256');
    hash.update(userEmail);
    const hashedUserEmail = hash.digest('hex');

    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (post:Post {id: $postId})<-[:POSTED_ON]-(comment:Comment)-[:COMMENTED_BY]->(owner:PetOwner)
            OPTIONAL MATCH (comment)<-[like:LIKED]-(user:PetOwner {hashEmail: $hashedUserEmail})
            OPTIONAL MATCH (comment)<-[likeAll:LIKED]-(allUsers:PetOwner)
            RETURN comment, owner.name as ownerName, COUNT(like) as isLiked, COUNT(likeAll) as likeCount
            ORDER BY comment.timestamp ASC
        `, { postId, hashedUserEmail });

        const comments = result.records.map((record) => {
            const properties = record.get('comment').properties;
            properties.timestamp = new Date(properties.timestamp);
            return {
                ...properties,
                ownerName: record.get('ownerName'),
                isLiked: record.get('isLiked') > 0,
                likeCount: record.get('likeCount').toNumber(),
            };
        });

        return { statusCode: 200, body: JSON.stringify(comments) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    } finally {
        await session.close();
    }
};
