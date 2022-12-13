/*const jmx = require("node-jmx");

globals.jmx_connections = globals.jmx_connections || {};

const getConnection = async ({ host, port }) => {

    const lbl = `${host}:${port}`;
    
    if(globals.jmx_connections[lbl]=="starting")
        throw new Error("Connection is starting...");

    if(globals.jmx_connections[lbl])
        return globals.jmx_connections[lbl];

    globals.jmx_connections[lbl] = "starting";

    const client = jmx.createClient({
      host: "localhost", // optional
      port: 3000
    });
     
    await new Promise((resolve)=>{
        client.connect();
        client.on("connect", resolve);
    });

    globals.jmx_connections[lbl] = client;

    const mbeans = await new Promise((resolve)=>client.listMBeans(resolve));
    console.log("mbeans ==>",mbeans);

    return client;
};

module.exports = async ({ host, port, log }) => {
    const client = await getConnection({ host, port });

    await new Promise((resolve)=>{
        client.getAttribute("java.lang:type=Memory", "HeapMemoryUsage", function(data) {
            var used = data.getSync('used');
            console.log("HeapMemoryUsage used: " + used.longValue);
            // console.log(data.toString());
            return resolve(used.longValue);
          });
    });
};
*/