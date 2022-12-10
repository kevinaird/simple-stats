const fs = require("fs");
const flattenJSON = require("./flatten");

class StatWriter {
    constructor(config) {
        this.config = config;
        this.log = config.log;
        this.outputStream = false;

        if(typeof config.output == "string") {
            this.outputStream = fs.createWriteStream(config.output, { flags: 'a' });
        }
    }

    write({ timestamp, stats, metric }) {
        if(!this.outputStream) return;

        this.log("writing to output:",this.config.output);
        
        const flatStats = flattenJSON({ [metric]: stats });
        
        for(const stat in flatStats) {
            if(typeof flatStats[stat]!="number") continue;

            const statLine = `${timestamp},${stat},${flatStats[stat]}`;

            this.outputStream.write(statLine+"\n");
            this.log("writing:",statLine);
        }
        
    }
};

module.exports = StatWriter;