import { FC } from "react";
import { ButtonContainer, ButtonIcon, ButtonLabel } from "./style";

interface IProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const Button: FC<IProps> = ({ onClick, startIcon, endIcon, label }) => {
  return (
    <ButtonContainer onClick={onClick}>
      {startIcon && <ButtonIcon>{startIcon}</ButtonIcon>}
      <ButtonLabel>{label}</ButtonLabel>
      {endIcon && <ButtonIcon>{endIcon}</ButtonIcon>}
    </ButtonContainer>
  );
};

export default Button;
