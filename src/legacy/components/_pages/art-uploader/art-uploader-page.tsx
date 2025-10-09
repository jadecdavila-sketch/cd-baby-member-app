import ArtUploader from './art-uploader';
import ArtForm from './art-form';

const ArtUploaderPage = () => {
  return (
    <div>
      <div className="mb-4">
        <ArtUploader />
      </div>
      <div>
        <ArtForm />
      </div>
    </div>
  );
};

export default ArtUploaderPage;
