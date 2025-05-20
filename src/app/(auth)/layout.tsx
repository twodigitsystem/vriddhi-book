//src\app\(auth)\layout.tsx

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <div>{children}</div>
    </main>
  );
}
