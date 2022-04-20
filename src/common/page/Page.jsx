export function Page(props) {
  const { children } = props;

  return (
    <main className="h-full min-h-screen p-4 max-w-[1200px] mx-auto">
      {children}
    </main>
  );
}
