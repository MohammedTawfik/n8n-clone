import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const HttpRequestSettingsSchema = z.object({
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], {
        message: 'Please select a valid method',
    }),
    endpoint: z.url({ message: 'Please enter a valid URL' }),
    body: z.string().optional(),
});

export type HttpRequestSettings = z.infer<typeof HttpRequestSettingsSchema>;

interface HttpRequestSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof HttpRequestSettingsSchema>) => void;
    defaultMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    defaultEndpoint?: string;
    defaultBody?: string;
}

export const HttpRequestSettingsDialog = ({
    open,
    onOpenChange,
    defaultMethod = 'GET',
    defaultEndpoint = '',
    defaultBody = '',
    onSubmit,
}: HttpRequestSettingsDialogProps) => {
    const form = useForm<HttpRequestSettings>({
        resolver: zodResolver(HttpRequestSettingsSchema),
        defaultValues: {
            method: defaultMethod,
            endpoint: defaultEndpoint,
            body: defaultBody,
        },
    });


    useEffect(() => {
        if (open) {
            form.reset({
                method: defaultMethod,
                endpoint: defaultEndpoint,
                body: defaultBody,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, defaultMethod, defaultEndpoint, defaultBody]);

    const watchMethod = useWatch({ control: form.control, name: 'method' });
    const showBody = ['POST', 'PUT', 'PATCH'].includes(watchMethod);

    const handleSubmit = form.handleSubmit((values: HttpRequestSettings) => {
        onSubmit(values);
        onOpenChange(false);
    });
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> HTTP Request Settings</DialogTitle>

                    <DialogDescription>
                        This is the settings for the HTTP request.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Method</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select the HTTP method to use for the request.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endpoint URL</FormLabel>

                                    <FormControl>
                                        <Input
                                            type="url"
                                            placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                                            className="w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Static url or use {'{{variables}}'} for simple values or
                                        {'{{json variable}}'} to stringify objects.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {showBody && (
                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Body</FormLabel>
                                        <FormDescription>
                                            JSON with template variables use {'{{variables}}'} for simple values or
                                            {'{{json variable}}'} to stringify objects.
                                        </FormDescription>
                                        <FormControl>
                                            <Textarea
                                                placeholder={`{
  "userId": "{{ httpResponse.data.userId }}",
  "name": "{{ httpResponse.data.name }}",
  "items": "{{ httpResponse.data.items }}"
}`}
                                                className="w-full font-mono text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter>
                            <Button type="submit" className="w-full mt-4">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
