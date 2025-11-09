import AppHeader from '@/components/app-header';

interface layoutProps {
    children: React.ReactNode;
}

const layout = ({ children }: layoutProps) => {
    return (
        <>
            <AppHeader />
            <main className='flex-1'> {children} </main>
        </>
    );
};

export default layout;
