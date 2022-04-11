### Lambda-NestJS

Lambda function triggered to S3 Bucket and also available to be called using HTTP (POST and GET) 

## Bootstrapped with:

- Node 14x;
- Serverless;
- NestJS;

## Summary

- S3 will receive the json files in `/source` bucket folder and the lambda will be triggered;
- The file will be processed;
- In case of process SUCCESS, the file will be moved to `/target` bucket folder;
- In case of process FAIL, the file will be moved to `/rejected` bucket folder;

## Development

- To install all dependencies: `npm install` 
- To generate the _main.js_ file on _/dist_ folder: `npm run build`
- To build and run the lambda locally using _serverless offline_ plugin: `npm run serverless:offline` 
- To build, deploy and run the lambda locally using _serverless localstack_ plugin: `npm run serverless:localstack` 

## Test

- To format the code: `npm run format`
- To validate code with lint: `npm run lint` will run lint validation
- To run the tests (external dependence mocked): `npm run test` 
- Use CURLs below to call the lambda function:

```
  curl --location --request GET 'http://localhost:3000/local/api'
```

```
  curl --location --request POST 'http://localhost:3000/local/api' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "Records": [
      {
        "s3": {
          "bucket": {
            "name": "bucket-name"
          },
          "object": {
            "key": "source/sub-folder/file.json"
          }
        }
      }
    ]
  }'
```

```
  curl --location --request POST 'http://localhost:3000/local/standalone' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "Records": [
      {
        "s3": {
          "bucket": {
            "name": "bucket-name"
          },
          "object": {
            "key": "source/sub-folder/file.json"
          }
        }
      }
    ]
  }'
```

## TODO

- Test build, deploy and run locally triggered on S3 Bucket using LOCALSTACK;