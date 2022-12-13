# Simple Stats Logger

A simple framework built in nodejs for polling stats at an interval and dumping them to a csv file.

- Configurable via yaml file
- Designed for running in a docker container
- Can retrieve container stats and container top data
- Can retrieve metrics from any prometheus-style exporter
- Can retrieve kafka topic offsets
- Can retrieve influx record count
- Exports the data to a csv

## Configuration

In a yml file configure the type of metrics you want to capture -->

````yml
metrics:
  # docker container stats - i.e. cpu, memory, network
  #     this will result in a docker stats and a docker top call each time 
  #     simple stats polls for metrics
  kafka-container-stats: # name each metric however you like
    type: container      # this lets simple stats know we want to get container stats
    name: kafka          # the name of the container we want to get stats from

  # kafka queue stats - Gets a count of how many messages are in the kafka topic
  kafka-topic-count:
    type: kafka          # this lets simple stats know we want kafka stats
    topic: loadrunner    # the name of the kafka topic
    brokers:             # a list of kafka brokers
      - kafka:9092

  # influx data stats - how many entries? i.e. SELECT COUNT(*) FROM transactions
  influx-record-count:
    type: influx            # this lests simple stats know we want influx stats
    host: influx            # the hostname of the influx instance we want to connect to
    port: 8086              # the port of the influx instance we want to connect to
    username: username      # influx creds
    password: password
    database: loadrunner    # the name of the database we want to query
    query: SELECT count(*) FROM transactions    # the query we will run to get the record count
    count: count_duration   # the name of the result field that will contain the count

# Write to a csv file
output: /stats.csv      # where to dump the metrics to. Required
interval: 5             # in seconds - how often to poll metrics. Default: 5
continueOnError: false  # if this is true, if no metrics are able to be pulled it will continue 
                        # to keep trying instead of ending right there. Default: false

````

## Node Usage

TBD

## Docker Usage

Buidling the image

````sh
docker build --tag kevinaird/simple-stats .
````

Running the docker container

````sh
docker run --name simple-stats \
 -v ./stats.yml:/app/stats.yml \
 -v /var/run/docker.sock:/var/run/docker.sock \
 --privileged \
 -it kevinaird/simple-stats -v start /app/stats.yml

````

OR run via a docker compose file

````yml
  simple-stats:
    image: kevinaird/simple-stats
    hostname: simple-stats
    container_name: simple-stats
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./stats.yml:/app/stats.yml
    command: start /app/stats.yml
````

## Example Output

````c
1670693536191,kafka-container-stats_pids_stats_current,82
1670693536191,kafka-container-stats_num_procs,0
1670693536191,kafka-container-stats_cpu_stats_cpu_usage_total_usage,22746987793000
1670693536191,kafka-container-stats_cpu_stats_cpu_usage_percpu_usage_0,844675178400
1670693536191,kafka-container-stats_cpu_stats_cpu_usage_percpu_usage_1,338365251100
1670693536191,kafka-container-stats_cpu_stats_cpu_usage_percpu_usage_2,853506338200
1670693536191,kafka-container-stats_cpu_stats_cpu_usage_percpu_usage_3,338204220500
1670693536191,kafka-container-stats_cpu_stats_cpu_usage_percpu_usage_4,18883730094500
1670693536191,kafka-container-stats_cpu_stats_cpu_usage_percpu_usage_5,318068082900
1670693536191,kafka-container-stats_cpu_stats_cpu_usage_percpu_usage_6,863413299400
1670693536191,kafka-container-stats_cpu_stats_cpu_usage_percpu_usage_7,307025328000
1670693536191,kafka-container-stats_cpu_stats_cpu_usage_usage_in_kernelmode,1507030000000
1670693536191,kafka-container-stats_cpu_stats_cpu_usage_usage_in_usermode,1460120000000
1670693536191,kafka-container-stats_cpu_stats_system_cpu_usage,1167347390000000
1670693536191,kafka-container-stats_cpu_stats_online_cpus,8
1670693536191,kafka-container-stats_cpu_stats_throttling_data_periods,0
1670693536191,kafka-container-stats_cpu_stats_throttling_data_throttled_periods,0
1670693536191,kafka-container-stats_cpu_stats_throttling_data_throttled_time,0
1670693536191,kafka-container-stats_precpu_stats_cpu_usage_total_usage,22746954701400
1670693536191,kafka-container-stats_precpu_stats_cpu_usage_percpu_usage_0,844670098300
1670693536191,kafka-container-stats_precpu_stats_cpu_usage_percpu_usage_1,338362073500
1670693536191,kafka-container-stats_precpu_stats_cpu_usage_percpu_usage_2,853497690000
1670693536191,kafka-container-stats_precpu_stats_cpu_usage_percpu_usage_3,338202838500
1670693536191,kafka-container-stats_precpu_stats_cpu_usage_percpu_usage_4,18883724909800
1670693536191,kafka-container-stats_precpu_stats_cpu_usage_percpu_usage_5,318066737900
1670693536191,kafka-container-stats_precpu_stats_cpu_usage_percpu_usage_6,863405341000
1670693536191,kafka-container-stats_precpu_stats_cpu_usage_percpu_usage_7,307025012400
1670693536191,kafka-container-stats_precpu_stats_cpu_usage_usage_in_kernelmode,1507030000000
1670693536191,kafka-container-stats_precpu_stats_cpu_usage_usage_in_usermode,1460100000000
1670693536191,kafka-container-stats_precpu_stats_system_cpu_usage,1167339210000000
1670693536191,kafka-container-stats_precpu_stats_online_cpus,8
1670693536191,kafka-container-stats_precpu_stats_throttling_data_periods,0
1670693536191,kafka-container-stats_precpu_stats_throttling_data_throttled_periods,0
1670693536191,kafka-container-stats_precpu_stats_throttling_data_throttled_time,0
1670693536191,kafka-container-stats_memory_stats_usage,1362653184
1670693536191,kafka-container-stats_memory_stats_max_usage,1371443200
1670693536191,kafka-container-stats_memory_stats_stats_active_anon,0
1670693536191,kafka-container-stats_memory_stats_stats_active_file,0
1670693536191,kafka-container-stats_memory_stats_stats_cache,1351680
1670693536191,kafka-container-stats_memory_stats_stats_dirty,0
1670693536191,kafka-container-stats_memory_stats_stats_hierarchical_memory_limit,9223372036854772000
1670693536191,kafka-container-stats_memory_stats_stats_hierarchical_memsw_limit,9223372036854772000
1670693536191,kafka-container-stats_memory_stats_stats_inactive_anon,1354854400
1670693536191,kafka-container-stats_memory_stats_stats_inactive_file,1216512
1670693536191,kafka-container-stats_memory_stats_stats_mapped_file,0
1670693536191,kafka-container-stats_memory_stats_stats_pgfault,183381
1670693536191,kafka-container-stats_memory_stats_stats_pgmajfault,0
1670693536191,kafka-container-stats_memory_stats_stats_pgpgin,185262
1670693536191,kafka-container-stats_memory_stats_stats_pgpgout,168274
1670693536191,kafka-container-stats_memory_stats_stats_rss,1354166272
1670693536191,kafka-container-stats_memory_stats_stats_rss_huge,1107296256
1670693536191,kafka-container-stats_memory_stats_stats_total_active_anon,0
1670693536191,kafka-container-stats_memory_stats_stats_total_active_file,0
1670693536191,kafka-container-stats_memory_stats_stats_total_cache,1351680
1670693536191,kafka-container-stats_memory_stats_stats_total_dirty,0
1670693536191,kafka-container-stats_memory_stats_stats_total_inactive_anon,1354854400
1670693536191,kafka-container-stats_memory_stats_stats_total_inactive_file,1216512
1670693536191,kafka-container-stats_memory_stats_stats_total_mapped_file,0
1670693536191,kafka-container-stats_memory_stats_stats_total_pgfault,183381
1670693536191,kafka-container-stats_memory_stats_stats_total_pgmajfault,0
1670693536191,kafka-container-stats_memory_stats_stats_total_pgpgin,185262
1670693536191,kafka-container-stats_memory_stats_stats_total_pgpgout,168274
1670693536191,kafka-container-stats_memory_stats_stats_total_rss,1354166272
1670693536191,kafka-container-stats_memory_stats_stats_total_rss_huge,1107296256
1670693536191,kafka-container-stats_memory_stats_stats_total_unevictable,0
1670693536191,kafka-container-stats_memory_stats_stats_total_writeback,0
1670693536191,kafka-container-stats_memory_stats_stats_unevictable,0
1670693536191,kafka-container-stats_memory_stats_stats_writeback,0
1670693536191,kafka-container-stats_memory_stats_limit,13257191424
1670693536191,kafka-container-stats_networks_eth0_rx_bytes,382621821
1670693536191,kafka-container-stats_networks_eth0_rx_packets,1022739
1670693536191,kafka-container-stats_networks_eth0_rx_errors,0
1670693536191,kafka-container-stats_networks_eth0_rx_dropped,0
1670693536191,kafka-container-stats_networks_eth0_tx_bytes,607147275
1670693536191,kafka-container-stats_networks_eth0_tx_packets,1858585
1670693536191,kafka-container-stats_networks_eth0_tx_errors,0
1670693536191,kafka-container-stats_networks_eth0_tx_dropped,0
````