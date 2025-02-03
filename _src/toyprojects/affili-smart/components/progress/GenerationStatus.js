import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const StatusList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StatusItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: ${props => props.completed ? '#28a745' : props.active ? '#007bff' : '#6c757d'};
`;

const StatusIcon = styled.span`
  margin-right: 10px;
  font-size: 18px;
`;

const GenerationStatus = ({ steps, currentStep }) => {
  return (
    <Container>
      <StatusList>
        {steps.map((step, index) => (
          <StatusItem 
            key={index}
            completed={index < currentStep}
            active={index === currentStep}
          >
            <StatusIcon>
              {index < currentStep ? '✓' : index === currentStep ? '►' : '○'}
            </StatusIcon>
            {step}
          </StatusItem>
        ))}
      </StatusList>
    </Container>
  );
};

export default GenerationStatus;
