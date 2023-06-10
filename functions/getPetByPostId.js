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
            MATCH (p:Post {id: $postId})-[r:ABOUT]->(pe:Pet)
            RETURN pe.id AS id, pe.name AS name, pe.age AS age, pe.bio AS bio, pe.breed AS breed, pe.fileUrl AS fileUrl
            `,
            { postId }
        );

        await session.close();

        if(result.records.length == 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Pet not found' }),
            };
        }

        const record = result.records[0];

        const pet = {
            id: record.get('id'),
            name: record.get('name'),
            age: record.get('age'),
            bio: record.get('bio'),
            breed: record.get('breed'),
            fileUrl: record.get('fileUrl')
        };

        return {
            statusCode: 200,
            body: JSON.stringify(pet),
        };
    } catch (error) {
        await session.close();

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch pet by post id' }),
        };
    }
};
