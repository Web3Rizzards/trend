import { FC } from "react";
import { css, styled } from "styled-components";

const DangerousAvatarContainer = styled.div<{ size: number }>`
  position: relative;
  height: ${({ size }) => size}px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  overflow: hidden;
`;

const DummyAvatarContainer = styled(DangerousAvatarContainer)`
  ${({ theme }) => css`
    background: ${theme.light};
  `}
`;

interface IProps {
  src: string;
  alt: string;
  size?: number;
}

const DangerousAvatar: FC<IProps> = ({ src, alt, size = 48 }) => {
  const updateSvgSize = (src: string) => {
    return src
      .replace(`width="320"`, `width="${size}"`)
      .replace(`height="320"`, `height="${size}"`);
  };

  if (!src) return <DummyAvatarContainer size={size} />;

  return (
    <DangerousAvatarContainer
      size={size}
      dangerouslySetInnerHTML={{
        __html: updateSvgSize(src),
      }}
    />
  );
};

export default DangerousAvatar;
