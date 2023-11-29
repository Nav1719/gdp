import React, { useState } from 'react';
import openai from 'openai';

function TextToImageConverter() {
  const [imageUrl, setImageUrl] = useState('');

  const generateImage = async () => {
    openai.api_key = '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'; // Replace with your API key

    try {
      const response = await openai.Completion.create({
        engine: 'davinci',
        prompt: 'Generate an image from this text.',
        max_tokens: 50,
      });

      setImageUrl(response.choices[0].text);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <div>
      <button onClick={generateImage}>Generate Image</button>
      {imageUrl && <img src={imageUrl} alt="Generated" />}
    </div>
  );
}

export default TextToImageConverter;
