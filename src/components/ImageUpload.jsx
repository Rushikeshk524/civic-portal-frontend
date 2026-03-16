import { useState } from 'react';

const CLOUD_NAME = 'dhgty3pol';
const UPLOAD_PRESET = 'civic-portal-upload';

export default function ImageUpload({ onUpload }) {
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if(!file) return;

        setPreview(URL.createObjectURL(file));
        setLoading(true);
        setError('');

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
                setLoading(false);
            }
            else {
                setError('Upload failed - try again');
                setLoading(false);
            }
        } catch (err) {
            setError('Upload failed - check internet connection');
            setLoading(false);
        }
    };

    return (
        <div>
            <label className='form-label fw-bold'>
                Photo <span className='text-muted fw-normal'>(optional)</span>
            </label>

            <input 
                type='file'
                className='form-control mb-2'
                accept='image/*'
                onChange={handleFile}
            />

            {loading && (
                <div className='d-flex align-items-center gap-2 text-muted small mb-2'>
                    <div className='spinner-border spinner-border-sm'>
                        
                    </div>
                </div>
            )}

            {error && (
                <div className='alert alert-danger py-2 small'>{error}</div>
            )}

            {preview && !loading && (
                <div className='mt-2'>
                    <img
                        src={preview}
                        alt='Preview'
                        className='rounded border'
                        style={{width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                    />
                    <small className='text-success d-block mt-1'> Image uploaded successfully</small>
                </div>
            )}
        </div>
    );
}