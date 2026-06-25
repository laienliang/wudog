## 为什么上传文件后路径是127.0.0.1开头
```
## 在wudog/cool-admin-midway/src/modules/plugin/config.ts
upload: {
                // 地址前缀
                domain: `http://127.0.0.1:${(_a = options === null || options === void 0 ? void 0 : options.app) === null || _a === void 0 ? void 0 : _a.getConfig('koa.port')}`,
            },


```
