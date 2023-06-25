const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const postId = body.postId;

    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (po:PetOwner)-[r:POSTED]->(p:Post {id: $postId})
            RETURN po.id AS id, po.name AS name, po.bio AS bio, po.hashEmail AS email, po.fileUrl AS fileUrl
            `,
            { postId }
        );

        await session.close();

        if(result.records.length == 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'PetOwner not found' }),
            };
        }

        const record = result.records[0];

        const petOwner = {
            id: record.get('id'),
            name: record.get('name'),
            bio: record.get('bio'),
            email: record.get('email'),
            fileUrl: record.get('fileUrl')
        };

        return {
            statusCode: 200,
            body: JSON.stringify(petOwner),
        };
    } catch (error) {
        await session.close();

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch pet owner by post id' }),
        };
    }
};
