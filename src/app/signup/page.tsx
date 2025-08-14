
import { SignUpForm } from '@/components/signup-form';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function SignUpPage() {
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
            <CardTitle>Create an Artisan Account</CardTitle>
            <CardDescription>Join our community of skilled artisans. Sign up to start selling.</CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
          </CardContent>
           <CardFooter className="flex justify-center text-sm">
              <p className="text-muted-foreground">Already have an account?&nbsp;</p>
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Log In
              </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
