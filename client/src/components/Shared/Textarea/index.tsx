import { FC } from "react";
import styled, { css } from "styled-components";

const TextareaInput = styled.textarea`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;

  ${({ theme }) => css`
    background: ${theme.secondary};
    color: ${theme.light};
  `}
`;

interface IProps {
  id: string;
  placeholder?: string;
  setContent: (_content: string) => void;
  value: string;
}

const Textarea: FC<IProps> = ({ id, placeholder = "", setContent, value }) => {
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.includes("image")) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setContent(value + `![Image](${reader.result})\n`);
          }
        };
        if (file) reader.readAsDataURL(file);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b") {
        e.preventDefault();
        setContent(value + "**bold text** ");
      }
      if (e.key === "`") {
        e.preventDefault();
        setContent(value + "`code` ");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <TextareaInput
      id={id}
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      rows={5}
    />
  );
};

export default Textarea;
