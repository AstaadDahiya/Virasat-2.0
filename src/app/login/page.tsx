
import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center space-x-2 text-primary">
            <Logo size={100} />
            <span className="font-bold text-4xl font-headline">VIRASAT</span>
          </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Artisan Login</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
