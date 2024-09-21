import styles from "@/styles";
import styled, { css } from "styled-components";

export const LayoutContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100vw;

  @media screen and (min-width: ${styles.breakpoints.medium}) {
    flex-direction: row;
    align-items: flex-start;
  }

  ${({ theme }) => css`
    background: ${theme.primary};
  `};
`;

export const LayoutContent = styled.div<{ offset: number }>`
  position: relative;
  width: 100%;
  padding: 24px 48px;
  box-sizing: border-box;

  overflow-y: auto;
  overflow-x: hidden;

  ${({ offset }) => css`
    min-height: calc(100vh - ${offset}px); /* old browsers */
    min-height: calc(100dvh - ${offset}px); /* new browsers */
    margin-top: ${offset}px;
  `}
`;
