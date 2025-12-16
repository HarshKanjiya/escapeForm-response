
export default async function Layout({ children }: { children: React.ReactNode; }) {
    return (
        <div className="flex h-screen w-full flex-col bg-accent-bg">
            <main className="flex-1 w-full transition-all duration-300 ease-in-out h-auto overflow-auto max-w-3xl mx-auto">
                {children}
            </main>
        </div>
    );
}