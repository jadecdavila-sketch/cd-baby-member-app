'use client';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { Music, Search, X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Label } from '@/components/label';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/tooltip';
import { Input } from '../../../input';
import { useRouter } from 'next/navigation';

const mockAppleArtists = [
  { id: 'apple-1', name: 'Apple Artist One', image: '' },
  { id: 'apple-2', name: 'Apple Artist Two', image: '' },
];

const mockSpotifyArtists = [
  { id: 'spotify-1', name: 'Spotify Artist One', image: '' },
  { id: 'spotify-2', name: 'Spotify Artist Two', image: '' },
];

const StreamingPage = () => {
  const [hasStreamingPresence, setHasStreamingPresence] = useState('');
  const [secondaryFormVisible, setSecondaryFormVisible] = useState(false);
  const [appleSearch, setAppleSearch] = useState('');
  const [spotifySearch, setSpotifySearch] = useState('');
  const [showAppleResults, setShowAppleResults] = useState(false);
  const [showSpotifyResults, setShowSpotifyResults] = useState(false);
  const router = useRouter();
  type Artist = { id: any; name?: string; image?: string };

  const [selectedAppleArtists, setSelectedAppleArtists] = useState<Artist[]>(
    []
  );
  const [selectedSpotifyArtists, setSelectedSpotifyArtists] = useState<
    Artist[]
  >([]);

  const appleSearchRef = useRef<HTMLDivElement>(null);
  const spotifySearchRef = useRef<HTMLDivElement>(null);

  const filteredAppleArtists = mockAppleArtists.filter((artist) =>
    artist.name.toLowerCase().includes(appleSearch.toLowerCase())
  );

  const filteredSpotifyArtists = mockSpotifyArtists.filter((artist) =>
    artist.name.toLowerCase().includes(spotifySearch.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        appleSearchRef.current &&
        !appleSearchRef.current.contains(event.target as Node)
      ) {
        setShowAppleResults(false);
      }
      if (
        spotifySearchRef.current &&
        !spotifySearchRef.current.contains(event.target as Node)
      ) {
        setShowSpotifyResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addAppleArtist = (artist: {
    id: any;
    name?: string;
    image?: string;
  }) => {
    if (!selectedAppleArtists.find((a) => a.id === artist.id)) {
      setSelectedAppleArtists([...selectedAppleArtists, artist]);
      setShowAppleResults(false);
      setAppleSearch('');
    }
  };

  const removeAppleArtist = (id: any) => {
    setSelectedAppleArtists(
      selectedAppleArtists.filter((artist) => artist.id !== id)
    );
  };

  const addSpotifyArtist = (artist: {
    id: any;
    name?: string;
    image?: string;
  }) => {
    if (!selectedSpotifyArtists.find((a) => a.id === artist.id)) {
      setSelectedSpotifyArtists([...selectedSpotifyArtists, artist]);
      setShowSpotifyResults(false);
      setSpotifySearch('');
    }
  };

  const removeSpotifyArtist = (id: any) => {
    setSelectedSpotifyArtists(
      selectedSpotifyArtists.filter((artist) => artist.id !== id)
    );
  };

  const handleStreamingProfilesSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log('Selected Apple Artists:', selectedAppleArtists);
    console.log('Selected Spotify Artists:', selectedSpotifyArtists);
    router.push('/onboarding/artist-name');
  };

  //TODO this will be updated with the yes flow of streaming platforms
  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-2xl">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Music className="text-primary h-6 w-6" />
            </div>
            <CardTitle className="text-center text-xl">
              Are you on streaming platforms?
            </CardTitle>
            <CardDescription className="text-center">
              Are you credited on any active releases or do you have an artist
              profile on Spotify or Apple Music already?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleStreamingProfilesSubmit}
              className="space-y-6"
            >
              <div className="space-y-6">
                <RadioGroup
                  value={hasStreamingPresence}
                  onValueChange={setHasStreamingPresence}
                  className="space-y-3"
                >
                  <Label
                    className="hover:bg-muted/50 flex cursor-pointer items-start space-x-2 rounded-md border p-3"
                    htmlFor="streaming-yes"
                  >
                    <RadioGroupItem
                      value="yes"
                      id="streaming-yes"
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <span className="text-base font-medium">Yes</span>
                      <p className="text-muted-foreground text-sm">
                        I appear as an artist or band member on Spotify or Apple
                        Music.
                      </p>
                    </div>
                  </Label>

                  <Label
                    className="hover:bg-muted/50 flex cursor-pointer items-start space-x-2 rounded-md border p-3"
                    htmlFor="streaming-no"
                  >
                    <RadioGroupItem
                      value="no"
                      id="streaming-no"
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <span className="text-base font-medium">No</span>
                      <p className="text-muted-foreground text-sm">
                        I don&apos;t have my own music on these platforms yet,
                        or I work behind the scenes.
                      </p>
                    </div>
                  </Label>
                </RadioGroup>

                <div className="mt-6 flex justify-end">
                  <Button id="continue-button" type="submit">
                    Continue
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StreamingPage;
