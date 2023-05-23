// addComment.js

require('dotenv').config();
const neo4j = require('neo4j-driver');
const uuidv4 = require('uuid').v4; // <-- Require the uuid package

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { postId, comment, userEmail } = JSON.parse(event.body);
    const commentId = uuidv4(); // <-- Generate a new unique ID

    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (owner:PetOwner {email: $userEmail})
            MATCH (post:Post {id: $postId})
            MERGE (comment:Comment {id: $commentId, text: $comment, timestamp: datetime(), likeCount: 0, isLiked: false})-[:COMMENTED_BY]->(owner)  // <-- Include the unique ID
            MERGE (comment)-[:POSTED_ON]->(post)
            RETURN comment, owner.name as ownerName
        `, { postId, comment, userEmail, commentId }); // <-- Include the unique ID

        const newComment = {
            ...result.records[0].get('comment').properties,
            ownerName: result.records[0].get('ownerName'),
            timestamp: new Date(result.records[0].get('comment').properties.timestamp),
        };

        return { statusCode: 200, body: JSON.stringify(newComment) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
    } finally {
        await session.close();
    }
};
