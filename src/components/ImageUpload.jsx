import { useState } from 'react';
import './ImageUpload.css';

const CLOUD_NAME   = 'dhgty3pol';
const UPLOAD_PRESET = 'civic-portal-upload';

export default function ImageUpload({ onUpload, onUploadStart, onUploadEnd }) {
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setError('');
    onUploadStart?.();

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await res.json();

      if (data.secure_url) {
        onUpload(data.secure_url);
        onUploadEnd?.();
        setLoading(false);
      } else {
        setError('Upload failed — try again');
        setLoading(false);
      }
    } catch (err) {
      setError('Upload failed — check internet connection');
      onUploadEnd?.();
      setLoading(false);
    }
  };

  return (
    <div>
      <label className='img-upload-label'>
        Photo <span>(optional)</span>
      </label>

      <input
        type='file'
        className='img-upload-input'
        accept='image/*'
        onChange={handleFile}
      />

      {loading && (
        <div className='img-upload-spinner'>
          <span className='spinner-sm' />
          Uploading image...
        </div>
      )}

      {error && (
        <div className='alert alert-error'>{error}</div>
      )}

      {preview && !loading && (
        <div className='img-upload-preview'>
          <img
            src={preview}
            alt='Preview'
          />
          <span className='img-upload-success'>Image uploaded successfully</span>
        </div>
      )}
    </div>
  );
}