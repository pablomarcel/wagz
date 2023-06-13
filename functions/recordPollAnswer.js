const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const recordPollAnswer = async (userId, pollId, option) => {
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
                MATCH (poll:PollQuestion {id: $pollId}), (user:PetOwner {id: $userId})
                MERGE (answer:Answer {option: $option})
                MERGE (poll)-[:HAS_ANSWER]->(answer)
                MERGE (answer)-[:ANSWERED_BY]->(user)
                RETURN answer
            `, { userId, pollId, option })
        );

        return result.records.length > 0;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    const { userId, pollId, option } = JSON.parse(event.body);

    try {
        const success = await recordPollAnswer(userId, pollId, option);

        if (success) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Answer recorded successfully' }),
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to record answer' }),
            };
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to record answer' }),
        };
    }
};
