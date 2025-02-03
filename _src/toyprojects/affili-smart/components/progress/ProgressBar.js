import React from 'react';
import styled, { keyframes } from 'styled-components';

const progressAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const Container = styled.div`
  width: 100%;
  margin: 20px 0;
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 20px;
  background: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, #007bff, #00a6ff);
  border-radius: 10px;
  transition: width 0.3s ease;
  animation: ${progressAnimation} 0.3s ease;
`;

const StatusText = styled.div`
  font-size: 16px;
  color: #333;
  margin-top: 8px;
  text-align: center;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
`;

const StepDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.active ? '#007bff' : '#f0f0f0'};
  border: 2px solid ${props => props.completed ? '#007bff' : '#ddd'};
  margin-bottom: 5px;
  transition: all 0.3s ease;
`;

const StepLabel = styled.span`
  font-size: 12px;
  color: ${props => props.active ? '#007bff' : '#666'};
  text-align: center;
`;

const ProgressBar = ({ progress, currentStep, steps }) => {
  return (
    <Container>
      <StepIndicator>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepDot 
              active={currentStep === index}
              completed={progress > (index / steps.length) * 100}
            />
            <StepLabel active={currentStep === index}>
              {step}
            </StepLabel>
          </Step>
        ))}
      </StepIndicator>
      <ProgressContainer>
        <Progress progress={progress} />
      </ProgressContainer>
      <StatusText>
        {steps[currentStep]} 진행 중... ({progress.toFixed(1)}%)
      </StatusText>
    </Container>
  );
};

export default ProgressBar;
