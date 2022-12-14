const statTypes = {
    container: true,
    influx: true,
    kafka: true,
    //jmx: true,
    exporter: true,
    embed: true,
};

const start = async ( { log, ...config } ) => {

    if(typeof config != "object") 
        throw new Error("config is required");

    if(typeof config.metrics != "object") 
        throw new Error("config.metrics is required");

    const interval = (config.interval || 5) * 1000;
    const metricNames = Object.keys(config.metrics);

    const StatWriter = require("./lib/writer");
    const statWriter = new StatWriter({ ...config, log });

    while(true) {
        const startTime = new Date().getTime();
        let successCount = 0;

        log("fetching",metricNames.length,"metrics...");

        const p = metricNames
            .map(async metric=>{
                const obj = config.metrics[metric];
                if(statTypes[obj.type]) {
                    try {
                        const statFetcher = require(`./lib/${obj.type}`);
                        const stats = await statFetcher({ ...obj, metric, config, log });
                        statWriter.write({ timestamp: startTime, stats, obj, metric });
                        successCount++;
                    }
                    catch(err) {
                        console.error("Error retrieving stat type:",obj.type,"for metric:",metric,err);
                    }
                }
                else {
                    console.error("Invalid stat type:",obj.type,"for metric:",metric);
                }
            });
        
        await Promise.all(p);

        const endTime = new Date().getTime();
        const elapsed = endTime - startTime;

        log("fetched and logged",successCount,"out of",metricNames.length,"metric types in",elapsed,"ms");

        if(!config.continueOnError && successCount==0) {
            throw new Error("No metrics were successfully retrieved");
        }

        if(elapsed < interval) {
            const timeToWait = interval - elapsed;
            log("waiting",timeToWait,"ms...");
            await new Promise(resolve=>setTimeout(resolve,timeToWait));
        }
    }

};

module.exports = start;