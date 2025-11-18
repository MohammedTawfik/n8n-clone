import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "../../lib/executor-registry";
import ky, { type Options as KyOptions} from 'ky';
import handlebars from 'handlebars';


//register handlebars json stringfy helper 
handlebars.registerHelper('json', (context) => {
    const jsonString =  JSON.stringify(context, null, 2);
    const safeString = new handlebars.SafeString(jsonString);
    return safeString;
});

type HttpRequestNodeData = {
    name: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestNodeData> = async ({data, context, step }) => {
    if (!data.endpoint) {
        throw new NonRetriableError('HTTP Request node: No endpoint configured');
    }

    if (!data.name) {
        throw new NonRetriableError('HTTP Request node: No name configured');
    }
    
    
    const result = await step.run('http-request', async () => {
        const endpoint = handlebars.compile(data.endpoint)(context);
        const method = data.method || 'GET';
         const options: KyOptions = {method};

         if(['POST', 'PUT', 'PATCH'].includes(method)) {

            const body = handlebars.compile(data.body)(context);
            JSON.parse(body);
            options.body = body;
            options.headers = {
              "Content-Type": "application/json",
            };
         }
         const response = await ky(endpoint, options);
         const contentType = response.headers.get('content-type');
         const responseBody = contentType?.includes('application/json') ? await response.json() : await response.text();

         return{
            ...context,
            [data.name]: {
                status: response.status,
                statusText: response.statusText,
                data: responseBody,
            },
         }
    });
    return result;
};