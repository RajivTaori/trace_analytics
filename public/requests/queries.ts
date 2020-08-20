const index = 'apm-spans-1';

export const getDashboardQuery = () => {
  return {
    "index": index,
    "size": 0,
    "query": {
      "query": {
        "bool": {
          "must_not": [
            {
              "exists": {
                "field": "parentSpanId"
              }
            }
          ]
        }
      },
      "aggs": {
        "trace_group": {
          "terms": {
            "field": "name.value.keyword"
          },
          "aggs": {
            "total_latency": {
              "scripted_metric": {
                "init_script": `
                state.latencies = [];
              `,
                "map_script": `
                state.latencies.add(doc['endTime'].value.toInstant().toEpochMilli() - doc['startTime'].value.toInstant().toEpochMilli());
              `,
                "combine_script": `
                double sumLatency = 0;
                for (t in state.latencies) { 
                  sumLatency += t;
                }
                return sumLatency;
              `,
                "reduce_script": `
                double sumLatency = 0;
                for (a in states) { 
                  if (a != null) {
                    sumLatency += a;
                  }
                }
                return sumLatency;
              `
              }
            },
            "average_latency": {
              "bucket_script": {
                "buckets_path": {
                  "count": "_count",
                  "latency": "total_latency.value"
                },
                "script": "params.latency / params.count"
              }
            }
          }
        }
      }
    }
  }
}

export const getDashboardErrorRateQuery = (traceGroupName) => {
  return {
    "index": index,
    "size": 0,
    "query": {
      "query": {
        "bool": {
          "must": [
            {
              "term": {
                "name.value.keyword": traceGroupName
              }
            }
          ]
        }
      },
      "aggs": {
        "trace_group": {
          "terms": {
            "field": "name.value.keyword"
          },
          "aggs": {
            "error_count": {
              "filter": {
                "range": {
                  "status.code": {
                    "gt": "0"
                  }
                }
              }
            },
            "error_rate": {
              "bucket_script": {
                "buckets_path": {
                  "total": "_count",
                  "errors": "error_count._count"
                },
                "script": "params.errors / params.total * 100"
              }
            }
          }
        }
      }
    }
  }
}