export const getServicesQuery = (serviceName = null) => {
  const query = {
    size: 0,
    query: {
      bool: {
        must: [],
        filter: [],
        should: [],
        must_not: [],
      },
    },
    aggs: {
      trace_group: {
        terms: {
          field: 'resource.attributes.service.name',
        },
        aggs: {
          error_count: {
            filter: {
              exists: {
                field: 'status.code',
              },
            },
          },
          total_latency: {
            scripted_metric: {
              init_script: `
                state.latencies = [];
              `,
              map_script: `
                state.latencies.add(doc['endTime'].value.toInstant().toEpochMilli() - doc['startTime'].value.toInstant().toEpochMilli());
              `,
              combine_script: `
                double sumLatency = 0;
                for (t in state.latencies) { 
                  sumLatency += t;
                }
                return sumLatency;
              `,
              reduce_script: `
                double sumLatency = 0;
                for (a in states) {
                  if (a != null) {
                    sumLatency += a;
                  }
                }
                return sumLatency;
              `,
            },
          },
          error_rate: {
            bucket_script: {
              buckets_path: {
                total: '_count',
                errors: 'error_count._count',
              },
              script: 'params.errors / params.total * 100',
            },
          },
          average_latency: {
            bucket_script: {
              buckets_path: {
                count: '_count',
                latency: 'total_latency.value',
              },
              script: 'params.latency / params.count',
            },
          },
        },
      },
    },
  };
  if (serviceName) {
    query.query.bool.must.push({
      term: {
        'resource.attributes.service.name': serviceName,
      },
    });
  }
  return query;
};
