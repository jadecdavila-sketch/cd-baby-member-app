import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import AudioUploader from './uploader/uploader';

const AudioUploaderLayout = () => {
  return (
    <div className="w-full px-4">
      <h1 className="mb-8 text-3xl font-bold">Add Tracks</h1>
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-medium">Track Source</h2>
        <Tabs defaultValue="new" className="w-full">
          <TabsList className="mb-4 w-full justify-start gap-4 border-b border-gray-300">
            <TabsTrigger className="px-4 py-2" value="new">
              Upload New Tracks
            </TabsTrigger>
            <TabsTrigger className="px-4 py-2" value="existing">
              Select Existing Tracks
            </TabsTrigger>
          </TabsList>
          <TabsContent value="new">
            <AudioUploader />
          </TabsContent>
          <TabsContent value="existing">
            <p>Existing tracks component</p>
            {/* Manage component will go here */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AudioUploaderLayout;
