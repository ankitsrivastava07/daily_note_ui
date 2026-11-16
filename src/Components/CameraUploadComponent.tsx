import React, { useState } from 'react';

const CameraUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);

    try {
      const referenceId = "note_123"; // Apna dynamic note reference ID daal dena

      // 1. Backend se S3 Pre-signed URL maango
      const res = await fetch(`http://localhost:8080/api/v1/documents/presigned-url?referenceId=${referenceId}&fileNames=${encodeURIComponent(selectedFile.name)}`);
      const data = await res.json();
      const uploadUrl = data.data[0]; // Backend se mila hua S3 pre-signed URL

      // 2. Backend ko bypass karke seedha S3 par photo upload karo (Production-grade approach!)
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': selectedFile.type,
        },
        body: selectedFile,
      });

      alert('Photo uploaded successfully to S3!');
      setSelectedFile(null);
      setPreview(null);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload photo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-sm mx-auto mt-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Attach Photo to Note</h3>

      {preview && (
        <div className="relative w-full h-48">
          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-md border" />
          <button
            onClick={() => { setSelectedFile(null); setPreview(null); }}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        {/* Mobile par direct camera kholne ke liye capture="environment" use hota hai */}
        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium border flex items-center gap-2">
          📸 Open Camera / Gallery
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={loading || !selectedFile}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default CameraUploadComponent;
