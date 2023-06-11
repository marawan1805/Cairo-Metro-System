import React, { useState } from 'react';

function ImageUpload({ onImageUpload }) {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const handleImageChange = async (e) => {
    if (e.target.files[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('upload_preset', 'mauukiql'); // replace 'your_upload_preset' with your preset name

      const response = await fetch('https://api.cloudinary.com/v1_1/dbm979fdv/image/upload', { // replace 'your-cloud-name' with your cloud name
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedImage(data.secure_url);
        onImageUpload(data.secure_url);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {selectedImage && (
        <img src={selectedImage} alt="Selected" />
      )}
    </div>
  );
}

export default ImageUpload;
