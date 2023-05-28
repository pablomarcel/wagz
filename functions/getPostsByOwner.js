const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const userEmail = body.userEmail;

    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (po:PetOwner {email: $userEmail})-[r:POSTED]->(p:Post)
            RETURN p.id AS id, p.caption AS caption, p.fileUrl AS fileUrl
            `,
            { userEmail }
        );

        await session.close();

        const posts = result.records.map(record => ({
            id: record.get('id'),
            caption: record.get('caption'),
            fileUrl: record.get('fileUrl')
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(posts),
        };
    } catch (error) {
        await session.close();

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch posts by owner' }),
        };
    }
};
