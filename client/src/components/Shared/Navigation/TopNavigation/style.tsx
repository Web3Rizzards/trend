import { css, styled } from "styled-components";

export const TopNavigationContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;

  width: 100%;
  box-sizing: border-box;
  padding: 24px 48px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) => css`
    background: ${theme.primary};
  `};
`;

export const TopNavigationIcon = styled.div`
  font-weight: 700;

  ${({ theme }) => css`
    color: ${theme.dark};
  `};
`;

export const TopNavigationSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
