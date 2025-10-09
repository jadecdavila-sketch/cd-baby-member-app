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

const ProfileCompletePage = () => {
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
              Profile Setup Complete!
            </CardTitle>
            <CardDescription className="text-lg">
              Your profile has been successfully created. What's next?
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Here are a few things you can do to get started on the platform:
            </p>
            <div className="mt-6 space-y-4">
              <Button className="w-full">Upload Your First Track</Button>
              <Button className="w-full" variant="outline">
                Add Contributors to Your Team
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="mx-auto w-full max-w-xs"
              onClick={() => router.push('/')}
            >
              Go to homepage
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCompletePage;
