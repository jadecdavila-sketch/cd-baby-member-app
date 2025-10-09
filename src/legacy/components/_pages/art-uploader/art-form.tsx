'use client';

import { useState } from 'react';
import {
  ChevronDown,
  Music,
  Globe,
  User,
  Tag,
  Building,
  Copyright,
  Calendar,
  Barcode,
} from 'lucide-react';
import { Input } from '@/components/input';
import { Checkbox } from '@/components/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Label } from '../../label';
import { Button } from '@/components/button';

export function ArtForm() {
  const [upcOption, setUpcOption] = useState('need');

  return (
    <div className="space-y-6">
      {/* First Section */}
      <div className="rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Release Name */}
          <div>
            <div className="mb-2 flex items-center">
              <Music className="mr-2 h-4 w-4" />
              <label className="text-sm font-medium">Release Name</label>
            </div>
            <Input
              type="text"
              defaultValue="Turning"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Release Version */}
          <div>
            <div className="mb-2 flex items-center">
              <Tag className="mr-2 h-4 w-4" />
              <label className="text-sm font-medium">Release Version</label>
            </div>
            <div className="relative">
              <select
                defaultValue="Original Version"
                className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option>Original Version</option>
                <option>Deluxe Edition</option>
                <option>Remix</option>
                <option>Remaster</option>
              </select>
              <ChevronDown className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
            </div>
          </div>

          {/* Release Language */}
          <div>
            <div className="mb-2 flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              <label className="text-sm font-medium">Release Language</label>
            </div>
            <Input
              type="text"
              defaultValue="English"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Content Flags */}
          <div>
            <div className="mb-2 flex items-center">
              <Tag className="mr-2 h-4 w-4" />
              <label className="text-sm font-medium">Content Flags</label>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox
                  id="explicit"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="explicit" className="ml-2 block text-sm">
                  This release contains explicit content
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="live"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="live" className="ml-2 block text-sm">
                  This is a live recording
                </label>
              </div>
            </div>
          </div>

          {/* Primary Artists */}
          <div>
            <div className="mb-2 flex items-center">
              <User className="mr-2 h-4 w-4" />
              <label className="text-sm font-medium">Primary Artists</label>
            </div>
            <Input
              type="text"
              defaultValue="Jane Smith"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          To edit artists, update the track details in the previous step.
        </p>
      </div>

      {/* Second Section */}
      <div className="rounded-lg border border-gray-200 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            <h3 className="text-lg font-medium">Release Details</h3>
          </div>
          <ChevronDown className="h-5 w-5" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Record Label */}
          <div>
            <div className="mb-2 flex items-center">
              <Building className="mr-2 h-4 w-4" />
              <label className="text-sm font-medium">
                Record Label <span className="text-red-500">*</span>
              </label>
            </div>
            <Input
              type="text"
              defaultValue="T Shop"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Genre */}
          <div>
            <div className="mb-2 flex items-center">
              <Music className="mr-2 h-4 w-4" />
              <label className="text-sm font-medium">
                Genre <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <select
                defaultValue="Pop"
                className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option>Pop</option>
                <option>Rock</option>
                <option>Hip-Hop</option>
                <option>Electronic</option>
                <option>Jazz</option>
              </select>
              <ChevronDown className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
            </div>
          </div>

          {/* Copyright Owner */}
          <div>
            <div className="mb-2 flex items-center">
              <Copyright className="mr-2 h-4 w-4" />
              <label className="text-sm font-medium">
                Copyright Owner <span className="text-red-500">*</span>
              </label>
            </div>
            <Input
              type="text"
              defaultValue="T Shop"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Sub-Genre */}
          <div>
            <div className="mb-2 flex items-center">
              <Music className="mr-2 h-4 w-4" />
              <label className="text-sm font-medium">Sub-Genre</label>
            </div>
            <div className="relative">
              <select
                defaultValue="Dance Pop"
                className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option>Dance Pop</option>
                <option>Synth Pop</option>
                <option>Indie Pop</option>
                <option>Pop Rock</option>
              </select>
              <ChevronDown className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
            </div>
          </div>

          {/* Copyright Year */}
          <div>
            <div className="mb-2 flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <label className="text-sm font-medium">Copyright Year</label>
            </div>
            <Input
              type="text"
              defaultValue="2025"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* UPC Information */}
          <div>
            <div className="mb-2 flex items-center">
              <Barcode className="mr-2 h-4 w-4" />
              <label className="text-sm font-medium">UPC Information</label>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <RadioGroup
                  value={upcOption}
                  onValueChange={setUpcOption}
                  className="space-y-2"
                >
                  <div className="flex items-center">
                    <RadioGroupItem value="have" id="have-upc" />
                    <Label htmlFor="have-upc" className="ml-2 block text-sm">
                      I already have a UPC
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem id="need-upc" value="need" />
                    <Label htmlFor="need-upc" className="ml-2 block text-sm">
                      I need a UPC
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <Button type="button" variant="ghost">
          Back to tracks
        </Button>
        <Button type="button"> Continue</Button>
      </div>
    </div>
  );
}
export default ArtForm;
