import styled, { css } from "styled-components";

export const PostContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 18px;
`;

export const PostSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;

  gap: 12px;
`;

export const PostContent = styled.p`
  font-size: 18px;

  ${({ theme }) => css`
    color: ${theme.light};
  `}
`;

export const PostReactTabs = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
`;

export const PostReactTab = styled.button`
  background: transparent;
  border: none;
  padding: 4px
  margin: 0;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const PostTimestamp = styled.label`
  font-size: 12px;
  opacity: 0.7;

  ${({ theme }) => css`
    color: ${theme.light};
  `}
`;
