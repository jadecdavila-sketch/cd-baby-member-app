'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/accordion';
import { Button } from '@/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';
import exp from 'constants';
import { ClipboardList, Icon, Link, User } from 'lucide-react';
import { SocialsAccordion } from '../socials';
import ProAccordion from '../PRO/pro';
import { useRouter } from 'next/navigation';

const AboutYourself = () => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="relative overflow-hidden">
        <div className="bg-primary/5 absolute -top-10 -left-10 z-0 h-40 w-40 rounded-full"></div>
        <div className="bg-primary/5 absolute -right-10 -bottom-10 z-0 h-40 w-40 rounded-full"></div>
        <div className="relative z-10">
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <User className="text-primary h-6 w-6" />
          </div>
          <CardTitle className="text-center text-xl">
            Tell us more about yourself
          </CardTitle>
          <CardDescription className="text-center">
            Add your social profiles and other details to help fans and
            collaborators find you
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <span className="flex">
                <Link className="me-3" /> Social Media Profiles
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <SocialsAccordion />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <span className="flex">
                <ClipboardList className="me-3" />
                Performance Rights Information
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <ProAccordion />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-6 flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/onboarding/tos')}
            >
              Skip for now
            </Button>
            <Button
              type="button"
              onClick={() => router.push('/onboarding/tos')}
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutYourself;
