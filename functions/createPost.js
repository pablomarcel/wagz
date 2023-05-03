const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const data = JSON.parse(event.body);

    const session = driver.session();

    try {
        const postId = uuidv4();
        const result = await session.run(
            `MATCH (po:PetOwner {email: $email}), (p:Pet {petId: $petId})
            CREATE (post:Post {postId: $postId, content: $content, author: p.name, coAuthor: po.userName})
            CREATE (p)-[:CREATED]->(post)
            CREATE (po)-[:CO_CREATED]->(post)
            RETURN post`,
            {
                email: data.email,
                petId: data.petId,
                postId,
                content: data.content
            }
        );

        const record = result.records[0];
        const post = record.get('post').properties;

        return {
            statusCode: 200,
            body: JSON.stringify(post)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create post' })
        };
    } finally {
        session.close();
    }
};
