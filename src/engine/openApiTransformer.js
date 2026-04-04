export function transformOpenApi(openApi) {
  const endpoints = [];

  if (openApi?.paths) {
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
  }

  const externalApis = openApi?.["x-external-apis"];
  let externalBasePath = "";

  if (Array.isArray(externalApis) && externalApis.length > 0) {
    externalBasePath = externalApis[0].baseUrl || "";

    for (const api of externalApis) {
      if (Array.isArray(api.endpoints)) {
        for (const ep of api.endpoints) {
          endpoints.push({
            method: ep.method?.toUpperCase() || "GET",
            path: ep.path || "",
            summary: ep.summary || "",
            parameters: [],
            requestBody: null,
            responses: []
          });
        }
      }
    }
  }

  return {
    meta: {
      basePath: openApi?.servers?.[0]?.url || externalBasePath
    },
    endpoints
  };
}