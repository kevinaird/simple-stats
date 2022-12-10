module.exports = async ({ name, log }) => {
    const Docker = require("dockerode");
    const docker = new Docker({ socketPath: '/var/run/docker.sock' });

    // Get Container
    const containers = await docker.listContainers({ all: true });
    const container = containers.find(
        a =>
        a.Names.filter(b => {
            const n = b.replace(/^\//, "");
            return n == name;
        }).length > 0
    );
    const containerObj = await docker.getContainer(container.Id);

    // Get stats
    let stats = {};

    try {
        stats = await containerObj.stats({ stream: false });
    } catch (err) {
        console.error("Stats collection error", err);
        return;
    }

    try {
        stats.dtop = await containerObj.top({ ps_args: "axo pid,pcpu,comm,pmem" });
    } catch (err) {
        console.error("Docker top error", err);
        return;
    }

    log("container stats for",name,stats);

    return stats;
};