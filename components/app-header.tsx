import { SidebarTrigger } from './ui/sidebar';

const AppHeader = () => {
    return (
        <header className='flex ml-2 h-14 shrink-0 items-center gap-2 border-b px-4 bg-background rounded-lg'>
            <SidebarTrigger />
        </header>
    )
}

export default AppHeader