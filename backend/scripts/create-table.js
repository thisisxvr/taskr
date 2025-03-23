const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  region: process.env.AWS_REGION || 'ap-southeast-2'
});

const dynamodb = new AWS.DynamoDB();

const params = {
  TableName: process.env.DYNAMODB_TABLE || 'Tasks',
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' }
  ],
  BillingMode: 'PAY_PER_REQUEST'
};

console.log(`Creating DynamoDB table: ${params.TableName}...`);

dynamodb.createTable(params, (err, data) => {
  if (err) {
    if (err.code === 'ResourceInUseException') {
      console.log(`Table already exists: ${params.TableName}`);
    } else {
      console.error('Error creating table:', err);
    }
  } else {
    console.log('Table created successfully:', data);
  }
});