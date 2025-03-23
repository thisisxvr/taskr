import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { TaskInput, Task, TaskStatus } from '../types';

AWS.config.update({
  region: process.env.AWS_REGION || 'ap-southeast-2'
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'Tasks';

export class TaskModel {
  static async getAllTasks(statusFilter?: TaskStatus): Promise<Task[]> {
    const params: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: TABLE_NAME
    };

    if (statusFilter) {
      params.FilterExpression = '#taskStatus = :statusValue';
      params.ExpressionAttributeNames = {
        '#taskStatus': 'status'
      };
      params.ExpressionAttributeValues = {
        ':statusValue': statusFilter
      };
    }

    const result = await dynamoDB.scan(params).promise();
    return result.Items as Task[];
  }

  static async getTaskById(id: string): Promise<Task | null> {
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: TABLE_NAME,
      Key: { id }
    };

    const result = await dynamoDB.get(params).promise();
    return result.Item as Task || null;
  }

  static async createTask(taskInput: TaskInput): Promise<Task> {
    const timestamp = new Date().toISOString();
    
    const task: Task = {
      id: uuidv4(),
      title: taskInput.title,
      description: taskInput.description,
      status: taskInput.status || TaskStatus.TO_DO,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: TABLE_NAME,
      Item: task
    };

    await dynamoDB.put(params).promise();
    return task;
  }

  static async updateTask(id: string, taskInput: TaskInput): Promise<Task | null> {
    const existingTask = await this.getTaskById(id);
    
    if (!existingTask) {
      return null;
    }

    const timestamp = new Date().toISOString();
    
    let updateExpression = 'set updatedAt = :updatedAt';
    const expressionAttributeValues: Record<string, any> = {
      ':updatedAt': timestamp
    };
    
    const expressionAttributeNames: Record<string, string> = {
      '#taskStatus': 'status'
    };
    
    if (taskInput.title !== undefined) {
      updateExpression += ', title = :title';
      expressionAttributeValues[':title'] = taskInput.title;
    }
    
    if (taskInput.description !== undefined) {
      updateExpression += ', description = :description';
      expressionAttributeValues[':description'] = taskInput.description;
    }
    
    if (taskInput.status !== undefined) {
      updateExpression += ', #taskStatus = :statusValue';
      expressionAttributeValues[':statusValue'] = taskInput.status;
    }
    
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoDB.update(params).promise();
    return result.Attributes as Task;
  }

  static async deleteTask(id: string): Promise<boolean> {
    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: TABLE_NAME,
      Key: { id },
      ReturnValues: 'ALL_OLD'
    };

    const result = await dynamoDB.delete(params).promise();
    
    return !!result.Attributes;
  }

  static async createTable(): Promise<void> {
    const dynamodb = new AWS.DynamoDB();
    
    const params: AWS.DynamoDB.CreateTableInput = {
      TableName: TABLE_NAME,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };

    try {
      await dynamodb.createTable(params).promise();
      console.log(`Created table: ${TABLE_NAME}`);
    } catch (error) {
      if ((error as AWS.AWSError).code === 'ResourceInUseException') {
        console.log(`Table already exists: ${TABLE_NAME}`);
      } else {
        throw error;
      }
    }
  }
}