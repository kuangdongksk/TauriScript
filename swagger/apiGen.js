// import { codegenV3 } from "swagger-code-gen-liquid";

// codegenV3({
//   remoteUrl: "./swagger/swagger.json", // your swagger json url,  v2.0 or 3.0+.
//   // definitionTemplateFile: "definitions.liquid", // your swagger schema definition template, liquidjs file.
//   // serviceTemplateFile: "service.liquid", // your swagger operations template, liquidjs file.
//   outputDir: "../src/services", // output dir
// });

import { codegen } from "swagger-axios-codegen";
import swagger from "./swagger.json" assert { type: "json" };

codegen({
  methodNameMode: "operationId",
  modelMode: "interface",
  multipleFileMode: true,
  openApi: "3.0.0",
  outputDir: "./src/services",
  useStaticMethod: true,
  useCustomerRequestInstance: true,
  source: swagger,
});
