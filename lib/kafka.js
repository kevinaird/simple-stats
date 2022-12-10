
module.exports = async ({ topic, brokers, log }) => {
    const { Kafka } = require('kafkajs');

    log("connecting to kafka brokers:",brokers,"...");

    const kafka = new Kafka({
        clientId: 'simple-stats',
        brokers,
    });
    const admin = kafka.admin();
    await admin.connect();

    let results;
    try {
        results = await admin.fetchTopicOffsetsByTimestamp(topic, 0);
        log("query kafka mq topic:",topic,"results ===>",results);

        results = results.reduce((sum,{offset})=>{
            const d = parseInt(offset);
            return sum + ((typeof d == "number" && !isNaN(d))?d:0);
        },0);

        log("query kafka mq topic:",topic,"count ===>",results);
    } catch(e) {
        throw e;
    } finally {
        await admin.disconnect();
    }

    return { [topic]: results };
};