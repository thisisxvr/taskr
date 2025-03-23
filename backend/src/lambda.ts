import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import serverless from 'serverless-http';
import app from './app';

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const serverlessHandler = serverless(app);
  
  const result = await serverlessHandler(event, context);
  return result as APIGatewayProxyResult;
};