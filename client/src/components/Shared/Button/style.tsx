import { css, styled } from "styled-components";

export const ButtonContainer = styled.button`
  margin: 0;
  border: none;

  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;

  padding: 12px 16px;

  ${({ theme }) => css`
    background: ${theme.secondary};
  `}
`;

export const ButtonLabel = styled.label`
  ${({ theme }) => css`
    color: ${theme.light};
  `}
`;

export const ButtonIcon = styled.div`
  position: relative;
  height: 18px;
  aspect-ratio: 1/1;
`;
