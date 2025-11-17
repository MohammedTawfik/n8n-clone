import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "../../lib/executor-registry";
import ky, { type Options as KyOptions} from 'ky';

type HttpRequestNodeData = {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestNodeData> = async ({data, context, step }) => {
    if (!data.endpoint) {
        throw new NonRetriableError('HTTP Request node: No endpoint configured');
    }
    
    
    const result = await step.run('http-request', async () => {
        const method = data.method || 'GET';
         const options: KyOptions = {method};

         if(['POST', 'PUT', 'PATCH'].includes(method)) {
            options.body = data.body;
         }
         const response = await ky(data.endpoint, options);
         const contentType = response.headers.get('content-type');
         const responseBody = contentType?.includes('application/json') ? await response.json() : await response.text();

         return{
            ...context,
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseBody,
            },
         }
    });
    return result;
};