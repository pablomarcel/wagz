const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { userEmail } = JSON.parse(event.body);

    if (!userEmail) {
        return {
            statusCode: 400,
            body: 'Bad Request: Expected userEmail in JSON body',
        };
    }

    const session = driver.session();

    try {
        const result = await session.run(
            `
                    MATCH (follower:PetOwner {email: $userEmail})-[:FOLLOWS]->(followee:PetOwner)
                    RETURN followee.email as followeeEmail, followee.name as followeeName, followee.fileUrl as fileUrl, followee.bio as bio
                    `,
            { userEmail }
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
