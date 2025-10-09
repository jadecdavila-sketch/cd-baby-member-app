'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { Input } from '@/components/input';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/accordion';
import { Label } from '@/components/label';
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from '@/components/select';
import {
  User,
  Link,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  FileText,
} from 'lucide-react';
import { Badge } from '@/components/badge/badge';
import { Button } from '@/components/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  CustomLinkIcon,
  FacebookIcon,
  InstagramIcon,
  LinkdnIcon,
  XIcon,
  YoutubeIcon,
} from '@/components/icons';

// Zod schema: all fields optional
const socialsSchema = z.object({
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

type SocialsFormValues = z.infer<typeof socialsSchema>;

const mockProfiles = [
  {
    id: '1',
    name: 'John Doe',
    isLegal: true,
    platform: 'apple',
  },
  {
    id: '2',
    name: 'Test',
    isLegal: true,
    platform: 'spotify',
  },
];

const SocialsAccordion = () => {
  const [aliasProfiles, setAliasProfiles] = useState<any[]>(mockProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string | undefined>(
    mockProfiles[0].id
  );

  // Setup react-hook-form with zod
  const form = useForm<SocialsFormValues>({
    resolver: zodResolver(socialsSchema),
    defaultValues: {
      instagram: '',
      twitter: '',
      facebook: '',
      youtube: '',
      linkedin: '',
      website: '',
    },
  });

  // Mockup: get/set social media values via form
  const getSocialMedia = (profileId: string, key: keyof SocialsFormValues) => {
    return form.watch(key) || '';
  };
  const updateSocialMedia = (
    profileId: string,
    key: keyof SocialsFormValues,
    value: string
  ) => {
    form.setValue(key, value);
  };

  // Mockup submit handler
  const handleAdditionalInfoSubmit = form.handleSubmit((values) => {
    // No real logic, just log for now
    console.log('Submitted socials:', values);
  });

  // Mockup for skip
  const handleSkipAdditionalInfo = () => {
    // No real logic
    console.log('Skipped socials');
  };

  // Mockup for setStep
  const setStep = (step: string) => {
    // No real logic
    console.log('Set step:', step);
  };

  return (
    <div>
      <div>
        {/* Profile Selector */}
        {aliasProfiles.length > 1 && (
          <div className="mb-6">
            <Label
              htmlFor="profile-name-selector"
              className="mb-2 block text-sm font-medium"
            >
              Select name to add social profiles for
            </Label>
            <Select value={activeProfileId} onValueChange={setActiveProfileId}>
              <SelectTrigger id="profile-name-selector">
                <SelectValue placeholder="Select a name" />
              </SelectTrigger>
              <SelectContent>
                {aliasProfiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name}
                    {profile.isLegal && ' (Legal Name)'}
                    {profile.platform &&
                      ` - ${profile.platform === 'apple' ? 'Apple Music' : 'Spotify'}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Active Profile Social Media */}
        {activeProfileId && (
          <div className="space-y-6">
            {aliasProfiles
              .filter((p) => p.id === activeProfileId)
              .map((profile) => (
                <div key={profile.id} className="space-y-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Badge variant={profile.isLegal ? 'default' : 'secondary'}>
                      {profile.isLegal ? 'Legal Name' : 'Artist Name'}
                    </Badge>
                    <h3 className="text-base font-medium">{profile.name}</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full bg-gray-100 p-1.5">
                        <InstagramIcon className="h-2 w-2" />
                      </div>

                      <Input
                        placeholder="Instagram username"
                        value={getSocialMedia(profile.id, 'instagram')}
                        onChange={(e) =>
                          updateSocialMedia(
                            profile.id,
                            'instagram',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full bg-gray-100 p-1.5">
                        <XIcon className="h-5 w-5" />
                      </div>
                      <Input
                        placeholder="Twitter/X username"
                        value={getSocialMedia(profile.id, 'twitter')}
                        onChange={(e) =>
                          updateSocialMedia(
                            profile.id,
                            'twitter',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full bg-gray-100 p-1.5">
                        <FacebookIcon className="h-5 w-5" />
                      </div>
                      <Input
                        placeholder="Facebook page"
                        value={getSocialMedia(profile.id, 'facebook')}
                        onChange={(e) =>
                          updateSocialMedia(
                            profile.id,
                            'facebook',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* More social profiles section - simplified to avoid ResizeObserver issues */}
                    <div className="mt-4 border-t border-gray-100 pt-3">
                      <h4 className="mb-3 text-sm font-medium">
                        More social profiles
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="rounded-full bg-gray-100 p-1.5">
                            <YoutubeIcon className="h-5 w-5" />
                          </div>
                          <Input
                            placeholder="YouTube channel"
                            value={getSocialMedia(profile.id, 'youtube')}
                            onChange={(e) =>
                              updateSocialMedia(
                                profile.id,
                                'youtube',
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="rounded-full bg-gray-100 p-1.5">
                            <LinkdnIcon className="h-5 w-5" />
                          </div>
                          <Input
                            placeholder="LinkedIn profile"
                            value={getSocialMedia(profile.id, 'linkedin')}
                            onChange={(e) =>
                              updateSocialMedia(
                                profile.id,
                                'linkedin',
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="rounded-full bg-gray-100 p-1.5">
                            <CustomLinkIcon className="h-5 w-5" />
                          </div>
                          <Input
                            placeholder="Website URL"
                            value={getSocialMedia(profile.id, 'website')}
                            onChange={(e) =>
                              updateSocialMedia(
                                profile.id,
                                'website',
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialsAccordion;
