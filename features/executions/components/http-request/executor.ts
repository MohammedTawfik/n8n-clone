import { NonRetriableError } from 'inngest';
import type { NodeExecutor } from '../../lib/executor-registry';
import ky, { type Options as KyOptions } from 'ky';
import handlebars from 'handlebars';
import { httpRequestChannel } from '@/inngest/channels/http-request';

//register handlebars json stringfy helper
handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new handlebars.SafeString(jsonString);
  return safeString;
});

type HttpRequestNodeData = {
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestNodeData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    httpRequestChannel().status({ nodeId, status: 'loading' })
  );
  if (!data.endpoint) {
    await publish(
        httpRequestChannel().status({ nodeId, status: 'error' })
      );
    throw new NonRetriableError('HTTP Request node: No endpoint configured');
  }

  if (!data.name) {
    await publish(
        httpRequestChannel().status({ nodeId, status: 'error' })
      );
    throw new NonRetriableError('HTTP Request node: No name configured');
  }

  try {
  const result = await step.run('http-request', async () => {
    const endpoint = handlebars.compile(data.endpoint)(context);
    const method = data.method || 'GET';
    const options: KyOptions = { method };

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const body = handlebars.compile(data.body)(context);
      JSON.parse(body);
      options.body = body; 
      options.headers = {
        'Content-Type': 'application/json',
      };
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get('content-type');
    const responseBody = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    return {
      ...context,
      [data.name]: {
        status: response.status,
        statusText: response.statusText,
        data: responseBody,
      },
    };
  });
  await publish(
    httpRequestChannel().status({ nodeId, status: 'success' })
  );
  return result;
  } catch (error) {
    await publish(
      httpRequestChannel().status({ nodeId, status: 'error' })
    );
    throw error;
  }
};
