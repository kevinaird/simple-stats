
module.exports = async ({ host, port, username, password, database, query, count, log }) => {
    
    const Influx = require("influx");

    const influx = new Influx.InfluxDB({
        host, port, username, password, database
    });

    let result = await influx.query(query);
    result = result.reduce((sum,item)=>sum+(item[count]?item[count]:0),0);

    log("query influx db",database,"with:",query,"===>",result);

    return { [count]: result };
};