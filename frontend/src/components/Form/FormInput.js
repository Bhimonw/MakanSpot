import React from 'react';
import styled from 'styled-components';

const InputGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  font-weight: ${props => props.theme.fontWeights.medium};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: ${props => props.theme.borderRadius.small};
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 14px;
  margin-top: 4px;
`;

const FormInput = ({ label, name, type = 'text', step, placeholder, value, onChange, error, ...rest }) => {
  return (
    <InputGroup>
      <Label htmlFor={name}>{label}</Label>
      <StyledInput
        id={name}
        name={name}
        type={type}
        step={step}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputGroup>
  );
};

export default FormInput;