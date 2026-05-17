import { useState } from 'react';
import { Skeleton } from '@mantine/core';

interface ProductImageProps {
  src: string;
  alt: string;
  height?: number;
}

export const ProductImage = ({ src, alt, height = 200 }: ProductImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', height }}>
      {!loaded && <Skeleton height={height} width="100%" animate />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          display: loaded ? 'block' : 'none',
          width: '100%',
          height,
          objectFit: 'cover',
        }}
      />
    </div>
  );
};
