export function transformOpenApi(openApi) {
  if (!openApi?.paths) {
    return {
      meta: {},
      endpoints: []
    };
  }

  const endpoints = [];

  for (const [path, methods] of Object.entries(openApi.paths)) {
    for (const [method, config] of Object.entries(methods)) {
      const endpoint = {
        method: method.toUpperCase(),
        path,
        summary: config.summary || "",
        parameters: [],
        requestBody: null,
        responses: []
      };

      if (Array.isArray(config.parameters)) {
        endpoint.parameters = config.parameters.map((param) => ({
          name: param.name,
          in: param.in,
          type: param.schema?.type || "string",
          required: param.required || false
        }));
      }

      if (
        config.requestBody?.content?.["application/json"]?.schema?.properties
      ) {
        const props =
          config.requestBody.content["application/json"].schema.properties;

        endpoint.requestBody = {
          fields: Object.entries(props).map(([name, value]) => ({
            name,
            type: value.type || "string"
          }))
        };
      }

      if (config.responses) {
        endpoint.responses = Object.entries(config.responses).map(
          ([status, res]) => ({
            status,
            description: res.description || ""
          })
        );
      }

      endpoints.push(endpoint);
    }
  }

  return {
    meta: {
      basePath: openApi.servers?.[0]?.url || ""
    },
    endpoints
  };
}