const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const postId = body.postId; // this should be the id of the Post you're interested in

    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (p:Post {id: $postId})
            RETURN p.id AS id, p.caption AS caption, p.fileUrl AS fileUrl
            `,
            { postId }
        );

        await session.close();

        if (result.records.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'No post found for this id.' }),
            };
        }

        const record = result.records[0];

        const post = {
            id: record.get('id'),
            caption: record.get('caption'),
            fileUrl: record.get('fileUrl'),
        };

        return {
            statusCode: 200,
            body: JSON.stringify(post),
        };
    } catch (error) {
        await session.close();

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch post profile' }),
        };
    }
};
