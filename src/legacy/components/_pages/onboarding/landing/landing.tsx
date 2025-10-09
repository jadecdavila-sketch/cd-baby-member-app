'use client';

import { Button } from '@/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screenfrom-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Welcome to Music Platform!
            </CardTitle>
            <CardDescription className="text-lg">
              Thanks for creating your account. Let&apos;s set up your profile!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              We just need a few details to personalize your experience and help
              you get started.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              id="continue-button"
              className="mx-auto w-full max-w-xs"
              onClick={() => router.push('/onboarding/music-connect')}
            >
              Let&apos;s Get Started
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;
