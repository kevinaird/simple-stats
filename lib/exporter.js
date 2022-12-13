module.exports = async ({ endpoint, log, config }) => {

    const fetch = require("./fetchTimeout");
    const Exposition = require("exposition");

    const timeout = (config.interval || 30) * 1000;

    const res = await fetch(endpoint,{ timeout });
    const metricText = await res.text();

    const parsedMetric = Exposition.parse(metricText);
    
    const out = {};

    parsedMetric.forEach(m=>{
        
        let labels = {};
        m.metrics.forEach(v=>{
            if(v.label) labels[v.label]=1
        });
        labels = Object.keys(labels);
        
        if(m.type=="COUNTER" || m.type=="GAUGE") {
            labels.forEach(label=>{
                out[`${m.name}[${label}]`] = m.metrics
                    .filter(v=>v.label==label)
                    .map(v=>parseFloat(v.value))
                    .reduce((sum,v)=>sum+v,0);    
            });
            out[`${m.name}`] = m.metrics
                .map(v=>parseFloat(v.value))
                .reduce((sum,v)=>sum+v,0);
        }
        else if(m.type=="HISTOGRAM") {
            labels.forEach(label=>{
                const metrics = m.metrics.filter(v=>v.label==label);
                out[`${m.name}_sum[${label}]`] = metrics.map(v=>parseFloat(v.sum)).reduce((sum,v)=>sum+v,0);    
                out[`${m.name}_count[${label}]`] = metrics.map(v=>parseFloat(v.count)).reduce((sum,v)=>sum+v,0);   
                out[`${m.name}_mean[${label}]`] = out[`${m.name}_sum[${label}]`] / out[`${m.name}_count[${label}]`];
            });
            out[`${m.name}_sum`] = m.metrics.map(v=>parseFloat(v.sum)).reduce((sum,v)=>sum+v,0);
            out[`${m.name}_count`] = m.metrics.map(v=>parseFloat(v.count)).reduce((sum,v)=>sum+v,0);
            out[`${m.name}_mean`] = out[`${m.name}_sum`] / out[`${m.name}_count`];
        } 
        else {
            log("unknown type:",m.type);
        }
    });

    return out;
};