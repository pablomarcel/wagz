const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { userEmail } = JSON.parse(event.body);

    // Hash the email using SHA-256
    const hash = crypto.createHash('sha256');
    const hashedEmail = hash.update(userEmail, 'utf8').digest('hex');

    if (!hashedEmail) {
        return {
            statusCode: 400,
            body: 'Bad Request: Expected userEmail in JSON body',
        };
    }

    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (follower:PetOwner {hashEmail: $hashedEmail})-[:FOLLOWS]->(followee:PetOwner)
            RETURN followee.hashEmail as followeeEmail, followee.name as followeeName, followee.fileUrl as fileUrl, followee.bio as bio
            `,
            { hashedEmail }
        );

        const followingOwners = result.records.map((record) => ({
            email: record.get('followeeEmail'),
            name: record.get('followeeName'),
            fileUrl: record.get('fileUrl'),
            bio: record.get('bio'),
        }));


        return {
            statusCode: 200,
            body: JSON.stringify(followingOwners),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error: Could not retrieve following owners: ' + error,
        };
    } finally {
        session.close();
    }
};
