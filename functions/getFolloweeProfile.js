// getFolloweeProfile.js

const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const followeeEmail = body.followeeEmail; // this should be the email of the PetOwner you're interested in

    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (po:PetOwner {email: $followeeEmail})-[r:POSTED]->(p:Post)
            RETURN po.name AS name, po.email AS email, collect(p) AS posts
            `,
            { followeeEmail }
        );

        await session.close();

        if (result.records.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'No profile found for this email.' }),
            };
        }

        const record = result.records[0];

        const profile = {
            name: record.get('name'),
            email: record.get('email'),
            posts: record.get('posts').map(post => ({
                id: post.properties.id,
                caption: post.properties.caption,
                fileUrl: post.properties.fileUrl,
            })),
        };

        return {
            statusCode: 200,
            body: JSON.stringify(profile),
        };
    } catch (error) {
        await session.close();

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch followee profile' }),
        };
    }
};