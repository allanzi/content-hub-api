/* istanbul ignore next */
if (!process.env.AWS_REGION) {
  process.env.AWS_REGION = 'us-east-1';
}

/* istanbul ignore next */
if (!process.env.DYNAMODB_NAMESPACE) {
  process.env.DYNAMODB_NAMESPACE = 'dev';
}

const {
  DynamoDBClient,
  ScanCommand,
  QueryCommand,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand
} = require("@aws-sdk/client-dynamodb");

// In offline mode, use DynamoDB local server
let DocumentClient = null;
/* istanbul ignore next */
let config = {
  region: process.env.AWS_REGION,
};
if (process.env.IS_OFFLINE) {
  config = {
    region: 'localhost',
    endpoint: 'http://0.0.0.0:8000',
    credentials: {
      accessKeyId: 'MockAccessKeyId',
      secretAccessKey: 'MockSecretAccessKey'
    },
  };
}
DocumentClient = new DynamoDBClient(config);

DocumentClient.scan = (params) => {
  const command = new ScanCommand(params);
  return DocumentClient.send(command);
};

DocumentClient.query = (params) => {
  const command = new QueryCommand(params);
  return DocumentClient.send(command);
};

DocumentClient.get = (params) => {
  const command = new GetItemCommand(params);
  return DocumentClient.send(command);
};

DocumentClient.put = (params) => {
  const command = new PutItemCommand(params);
  return DocumentClient.send(command);
};

DocumentClient.delete = (params) => {
  const command = new DeleteItemCommand(params);
  return DocumentClient.send(command);
};

module.exports = {

  async ping() {
    return envelop({
      pong: new Date(),
      AWS_REGION: process.env.AWS_REGION,
      DYNAMODB_NAMESPACE: process.env.DYNAMODB_NAMESPACE,
    });
  },

  async purgeData() {
    await purgeTable('users', 'username');
    await purgeTable('articles', 'slug');
    await purgeTable('comments', 'id');
    return envelop('Purged all data!');
  },

  getTableName(aName) {
    return `realworld-${process.env.DYNAMODB_NAMESPACE}-${aName}`;
  },

  envelop,

  tokenSecret: /* istanbul ignore next */ process.env.SECRET ?
    process.env.SECRET : '3ee058420bc2',
  DocumentClient,

};

function envelop(res, statusCode = 200) {
  let body;
  if (statusCode == 200) {
    body = JSON.stringify(res, null, 2);
  } else {
    body = JSON.stringify({ errors: { body: [res] } }, null, 2);
  }
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body,
  };
}

async function purgeTable(aTable, aKeyName) /* istanbul ignore next */ {
  const tableName = module.exports.getTableName(aTable);

  if (!tableName.includes('dev') && !tableName.includes('test')) {
    console.log(`WARNING: Table name [${tableName}] ` +
      `contains neither dev nor test, not purging`);
    return;
  }

  const allRecords = await DocumentClient
    .scan({ TableName: tableName });
  const deletePromises = [];
  for (let i = 0; i < allRecords.Items.length; ++i) {
    const recordToDelete = {
      TableName: tableName,
      Key: {},
    };
    recordToDelete.Key[aKeyName] = allRecords.Items[i][aKeyName];
    deletePromises.push(DocumentClient.delete(recordToDelete));
  }
  await Promise.all(deletePromises);
}
