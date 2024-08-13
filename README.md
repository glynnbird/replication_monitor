# replication_monitor

A simple Cloudant replication monitor that polls a single replication doc to see if the replication is working. It uses two Cloudant API calls to do this:

1. [Get a replication scheduler doc](https://cloud.ibm.com/apidocs/cloudant?code=node#getschedulerdocument)
2. [Get replication scheduler job](https://cloud.ibm.com/apidocs/cloudant?code=node#getschedulerjob)

This repository is designed to be a jumping off point to allow you to create your own monitoring solution. You may wish to perform some action when a replication is found to have failed (look in source code for comments).

## Installation

Clone this repo. Install dependencies with:

```sh
cd replication_monitor
npm install
```

## Configuring

The Cloudant configuration is picked up from environment variables as [described here](https://github.com/IBM/cloudant-node-sdk?tab=readme-ov-file#authentication-with-environment-variables) e.g.

```sh
export CLOUDANT_URL="https://MY_CLOUDANT_SERVICE.cloudant.com"
export CLOUDANT_APIKEY="MY_IAM_APIKEY"
```
   
## Running

Run the application with:

```sh
npm run start <docId>
```

where `<docId>` is `_id` of a document in Cloudant's `_replicator` database.

e.g.

```sh
npm run start my_replication
```

If everthing is working, the output should be of this form:

```sh
Replication is working: job id someid+continuous+create_target
{
  "database": "_replicator",
  "docId": "myreplication",
  "history": [
    {
      "timestamp": "2024-08-12T10:03:49Z",
      "type": "started"
    },
    {
      "timestamp": "2024-08-12T10:03:49Z",
      "type": "added"
    }
  ],
  "id": "someid+continuous+create_target",
  "info": {
    "changesPending": 0,
    "checkpointedSourceSeq": "23564-g1AAAAgTe",
    "docWriteFailures": 0,
    "docsRead": 5,
    "docsWritten": 5,
    "missingRevisionsFound": 5,
    "revisionsChecked": 23541,
    "sourceSeq": "23564-g1AAAAgTe",
    "throughSeq": "23564-g1AAAAgTe"
  },
  "node": "dbcore@db17.bm-cc-us-south-05.cloudant.net",
  "pid": "<0.17912.4439>",
  "source": "https://MY_CLOUDANT_SERVICE.cloudant.com/cities/",
  "startTime": "2024-08-12T10:03:49Z",
  "target": "https://MY_CLOUDANT_SERVICE.cloudant.com/cities4/",
  "user": null
}
```

## Error codes

The command line tool will return the following exit codes:

- 0 - ok. The replication is running.
- 1 - Missing docID parameter.
- 2 - Cannot fetch replication scheduler doc.
- 3 - Cannot fetch replication scheduler job.
- 4 - The replication is not running. Take action.
