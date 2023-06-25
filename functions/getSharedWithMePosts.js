const neo4j = require('neo4j-driver');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    const data = JSON.parse(event.body);
    const userEmail = data.userEmail;

    // Hash the user's email
    const userEmailHash = crypto.createHash('sha256').update(userEmail).digest('hex');

    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (user:PetOwner {hashEmail: $userEmailHash})<-[:SHARED_WITH]-(post:Post)
            RETURN post.id AS postId
            `,
            { userEmailHash }
        );

        const sharedWithMePosts = result.records.map((record) => record.get('postId'));

        return {
            statusCode: 200,
            body: JSON.stringify(sharedWithMePosts),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error in fetching shared with me posts' }),
        };
    } finally {
        await session.close();
    }
};
