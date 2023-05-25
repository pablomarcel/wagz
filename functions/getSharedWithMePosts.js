const neo4j = require('neo4j-driver');
const dotenv = require('dotenv');

dotenv.config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    const data = JSON.parse(event.body);
    const userEmail = data.userEmail;
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (user:PetOwner {email: $userEmail})<-[:SHARED_WITH]-(post:Post)
            RETURN post.id AS postId
            `,
            { userEmail }
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
