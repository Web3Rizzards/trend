import Image, { StaticImageData } from "next/image";
import { FC } from "react";
import { styled } from "styled-components";

const AvatarContainer = styled.div<{ size: number }>`
  position: relative;
  height: ${({ size }) => size}px;
  aspect-ratio: 1/1;
  overflow: hidden;
  border-radius: 50%;
`;

interface IProps {
  src: StaticImageData | string;
  alt: string;
  size?: number;
}

const Avatar: FC<IProps> = ({ src, alt, size = 48 }) => {
  return (
    <AvatarContainer size={size}>
      <Image src={src} alt={alt} fill />
    </AvatarContainer>
  );
};

export default Avatar;
