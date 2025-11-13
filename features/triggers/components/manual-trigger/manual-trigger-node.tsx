import { NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';
import { MousePointerIcon } from 'lucide-react';
import { BaseTriggerNode } from '../base-trigger-node';
import { SettingsDialog } from './settings-dialog';

export const ManualTriggerNode = memo(
    (props: NodeProps) => {

        const [open, setOpen] = useState(false);
        const status = 'initial';

        return (
            <>
                <SettingsDialog open={open} onOpenChange={setOpen} />
                <BaseTriggerNode
                    {...props}
                    status={status}
                    name="When click execute workflow"
                    icon={MousePointerIcon}
                    id={props.id}
                    onDoubleClick={() => { setOpen(true) }}
                    onSettingsClick={() => setOpen(true)}
                >
                    {null}
                </BaseTriggerNode>
            </>
        );
    }
);

ManualTriggerNode.displayName = 'ManualTriggerNode';
