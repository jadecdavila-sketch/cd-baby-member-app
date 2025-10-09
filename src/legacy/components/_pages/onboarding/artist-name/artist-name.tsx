'use client';
import React from 'react';
import { Button } from '@/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { Music, X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Label } from '@/components/label';
import { Input } from '@/components/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/tooltip';
import { Badge } from '@/components/badge';
import { useRouter } from 'next/navigation';

const ArtistNamePage = () => {
  const [planToPerformUnderName, setPlanToPerformUnderName] = React.useState<
    string | undefined
  >(undefined);
  const [newArtistName, setNewArtistName] = React.useState('');
  const [plannedArtistNames, setPlannedArtistNames] = React.useState<string[]>(
    []
  );

  const router = useRouter();

  const addArtistName = () => {
    if (
      newArtistName.trim() &&
      !plannedArtistNames.includes(newArtistName.trim())
    ) {
      setPlannedArtistNames([...plannedArtistNames, newArtistName.trim()]);
      setNewArtistName('');
    }
  };
  const removeArtistName = (name: string) => {
    setPlannedArtistNames(
      plannedArtistNames.filter((artistName) => artistName !== name)
    );
  };

  const handleArtistNamesSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.push('/onboarding/location');
  };
  return (
    <div className="min-h-screenfrom-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Music className="text-primary h-6 w-6" />
            </div>
            <CardTitle className="text-center text-xl">
              Artist or band names
            </CardTitle>
            <CardDescription className="text-center">
              Tell us about the names you plan to perform under
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleArtistNamesSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-base font-medium">
                    Do you personally plan to perform under a different artist
                    or band name?
                  </h3>
                  <RadioGroup
                    id="artist-name-radio-group"
                    value={planToPerformUnderName}
                    onValueChange={setPlanToPerformUnderName}
                    className="space-y-3"
                  >
                    <Label
                      className="hover:bg-muted/50 flex cursor-pointer items-start space-x-2 rounded-md border p-3"
                      htmlFor="artist-name-yes"
                    >
                      <RadioGroupItem
                        value="yes"
                        id="artist-name-yes"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <span className="text-base font-medium">Yes</span>
                        <p className="text-muted-foreground text-sm">
                          I will appear as a credited artist or band member
                          under another artist name.
                        </p>
                      </div>
                    </Label>

                    <Label
                      className="hover:bg-muted/50 flex cursor-pointer items-start space-x-2 rounded-md border p-3"
                      htmlFor="artist-name-no"
                    >
                      <RadioGroupItem
                        value="no"
                        id="artist-name-no"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <span className="text-base font-medium">No</span>
                        <p className="text-muted-foreground text-sm">
                          I use my full name when performing or I work behind
                          the scenes.
                        </p>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>

                {/* Show artist name input if they plan to perform under a name */}
                {planToPerformUnderName === 'yes' && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-base font-medium">
                      Add your artist or band names
                    </h3>

                    <div className="relative">
                      <div className="flex space-x-2">
                        <Input
                          type="text"
                          placeholder="Enter artist or band name"
                          value={newArtistName}
                          onChange={(e) => setNewArtistName(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          id="add-button"
                          onClick={addArtistName}
                          disabled={
                            !newArtistName.trim() ||
                            plannedArtistNames.length >= 5
                          }
                        >
                          Add
                        </Button>
                      </div>
                      {plannedArtistNames.length >= 5 && (
                        <p className="mt-1 text-sm text-red-500">
                          You can only add up to 5 artist or band names.
                        </p>
                      )}
                    </div>

                    {/* Selected Artist Names */}
                    {plannedArtistNames.length > 0 ? (
                      <div className="mt-2 space-y-2">
                        <Label className="text-sm">
                          Your artist/band names:
                        </Label>
                        <div className="bg-muted/20 flex flex-wrap gap-2 rounded-md border p-2">
                          {plannedArtistNames.map((name, index) => (
                            <TooltipProvider key={index}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge className="flex items-center gap-1 px-2 py-1.5">
                                    <Music className="h-3.5 w-3.5" />
                                    <span className="max-w-[180px] truncate">
                                      {name}
                                    </span>
                                    <button
                                      type="button"
                                      id="remove-button"
                                      onClick={() => removeArtistName(name)}
                                      className="hover:bg-muted ml-1 rounded-full p-0.5"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p>{name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground mt-2 text-sm">
                        No artist or band names added yet
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <Button
                    id="back-button"
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/onboarding/streaming')}
                  >
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      id="skip-button"
                      variant="outline"
                      onClick={() => router.push('/')}
                    >
                      Skip for now
                    </Button>
                    <Button
                      id="continue-button"
                      type="submit"
                      disabled={
                        planToPerformUnderName === 'yes' &&
                        plannedArtistNames.length === 0
                      }
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArtistNamePage;
