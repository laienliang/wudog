import { CoolEps } from '@cool-midway/core';
import {
  Config,
  Inject,
  MidwayWebRouterService,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import * as _ from 'lodash';

@Provide()
@Scope(ScopeEnum.Singleton)
export class SwaggerBuilder {
  @Config('module.swagger.base')
  swaggerBase;

  @Config('cool.eps')
  epsConfig: boolean;

  @Config('koa.globalPrefix')
  globalPrefix: string;

  @Inject()
  eps: CoolEps;

  @Inject()
  midwayWebRouterService: MidwayWebRouterService;

  json = {};

  async init() {
    if (this.epsConfig) {
      await this.build();
    }
  }

  async build() {
    const routes = await this.buildRouteMap();
    const epsData = {
      app: this.mergeApis(this.eps.app || {}, routes),
      admin: this.mergeApis(this.eps.admin || {}, routes),
      module: this.eps.module || {},
    };
    this.json = this.convertToSwagger(epsData);
  }

  private async buildRouteMap() {
    const table = await this.midwayWebRouterService.getFlattenRouterTable();
    const items = table.map(item => {
      const normalizedPrefix = this.normalizePrefix(item.prefix);
      return {
        method: item.requestMethod,
        path: item.url,
        summary: item.summary,
        prefix: normalizedPrefix,
        ignoreToken: false,
      };
    });
    return _.groupBy(items, 'prefix');
  }

  private mergeApis(groupedModules, routeMap) {
    return Object.keys(groupedModules).reduce((acc, moduleKey) => {
      acc[moduleKey] = groupedModules[moduleKey].map(item => ({
        ...item,
        api: item.api || routeMap[item.prefix] || [],
      }));
      return acc;
    }, {});
  }

  private normalizePrefix(prefix: string) {
    const globalPrefix = this.globalPrefix || '';
    if (!globalPrefix || !prefix?.startsWith(globalPrefix)) {
      return prefix;
    }
    const normalized = prefix.slice(globalPrefix.length);
    return normalized || '/';
  }

  convertToSwagger(dataJson) {
    const swagger = {
      ...this.swaggerBase,
      paths: {},
      tags: Object.keys(dataJson.module)
        .filter(item => item !== 'swagger')
        .map(moduleKey => ({
          key: moduleKey,
          name: dataJson.module[moduleKey].name || '',
          description: dataJson.module[moduleKey].description || '',
        })),
    };

    const addComponentSchemas = data => {
      if (_.isEmpty(data.name)) return;
      const schema = {
        type: 'object',
        properties: {},
        required: [],
      };

      data.columns.forEach(column => {
        const swaggerType = mapTypeToSwagger(column.type);
        schema.properties[column.propertyName] = {
          type: swaggerType,
          description: column.comment,
        };

        if (!column.nullable) {
          schema.required.push(column.propertyName);
        }
      });

      swagger.components.schemas[data.name] = schema;
      return data.name;
    };

    const mapTypeToSwagger = type => {
      const typeMapping = {
        string: 'string',
        number: 'number',
        bigint: 'integer',
        datetime: 'string',
        decimal: 'number',
        boolean: 'boolean',
        json: 'object',
        text: 'string',
        varchar: 'string',
      };
      return typeMapping[type] || 'string';
    };

    const addRequest = (path, schemas, data) => {
      if (path === '/info' || path === '/list' || path === '/page') {
        if (path === '/info') {
          data.parameters = [
            {
              name: 'id',
              in: 'query',
              description: 'ID',
              required: true,
              schema: {
                type: 'integer',
              },
            },
          ];
        } else if (path === '/page') {
          data.requestBody = {
            description: '分页查询参数',
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    page: {
                      type: 'integer',
                      description: '页码',
                      default: 1,
                    },
                    pageSize: {
                      type: 'integer',
                      description: '每页数量',
                      default: 10,
                    },
                    keyWord: {
                      type: 'string',
                      description: '关键字',
                    },
                  },
                },
              },
            },
          };
        }

        data.responses = {
          '200': {
            description: 'Success response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'integer',
                    },
                    message: {
                      type: 'string',
                    },
                    data: schemas
                      ? {
                          $ref: `#/components/schemas/${schemas}`,
                        }
                      : {
                          type: 'object',
                        },
                  },
                },
              },
            },
          },
        };
      }

      if (path === '/delete') {
        data.requestBody = {
          description: '删除参数',
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ids: {
                    type: 'array',
                    items: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
        };
      }
    };

    const processModuleApis = (moduleApis, moduleName) => {
      moduleApis.forEach(module => {
        const schemas = addComponentSchemas({
          name: module.name,
          columns: module.columns,
        });

        if (!Array.isArray(module.api)) {
          return;
        }

        module.api.forEach(api => {
          const fullPath = `${api.prefix === '/' ? '' : api.prefix}${api.path}`;
          const method = String(api.method || 'get').toLowerCase();

          if (!swagger.paths[fullPath]) {
            swagger.paths[fullPath] = {};
          }

          swagger.paths[fullPath][method] = {
            summary: `${module.info.type.description || module.info.type.name} ${api.summary || ''}`.trim(),
            security: api.ignoreToken
              ? []
              : [
                  {
                    ApiKeyAuth: [],
                  },
                ],
            tags: [moduleName || '其他'],
            requestBody:
              method === 'post'
                ? {
                    description: '请求体',
                    required: true,
                    content: {
                      'application/json': {
                        schema: {
                          type: 'object',
                          properties: {},
                        },
                      },
                    },
                  }
                : undefined,
            responses: schemas
              ? {
                  '200': {
                    description: 'Success response',
                    content: {
                      'application/json': {
                        schema: {
                          $ref: `#/components/schemas/${schemas}`,
                        },
                      },
                    },
                  },
                }
              : {},
          };

          addRequest(api.path, schemas, swagger.paths[fullPath][method]);
        });
      });
    };

    Object.keys(dataJson.app).forEach(moduleKey => {
      if (Array.isArray(dataJson.app[moduleKey])) {
        processModuleApis(dataJson.app[moduleKey], dataJson.module[moduleKey]?.name);
      }
    });

    Object.keys(dataJson.admin).forEach(moduleKey => {
      if (Array.isArray(dataJson.admin[moduleKey])) {
        processModuleApis(dataJson.admin[moduleKey], dataJson.module[moduleKey]?.name);
      }
    });

    return swagger;
  }
}
