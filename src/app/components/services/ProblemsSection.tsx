'use client';

import React from 'react';
import styled from 'styled-components';
import { growsomeTheme } from '@/components/design-system/theme';
import { Typography } from '@/components/design-system/Typography';
import { ColumnBox, Container } from '@/components/design-system/Layout';

const problems = [
  "AI 붙이고 싶은데 PHP 홈페이지로는 불가능해요",
  "6개월 기다렸는데 결과물이 2020년 수준이에요",
  "해외 개발자와 소통이 안 돼서 스트레스받아요",
  "만들고 나니 운영을 어떻게 해야 할지 모르겠어요",
  "브랜드 아이덴티티가 없어서 경쟁력이 떨어져요"
];

const ProblemsSectionContainer = styled.section`
  padding: ${growsomeTheme.spacing["4xl"]} 0;
  background: ${growsomeTheme.color.White};
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing["2xl"]} 0;
  }
`;

const ProblemsTitle = styled(Typography.DisplayL600)`
  @media ${growsomeTheme.device.mobile} {
    font-size: 1.5rem !important;
  }
  
  @media ${growsomeTheme.device.tablet} {
    font-size: 2rem !important;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const ProblemsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${growsomeTheme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const ProblemCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${growsomeTheme.spacing.lg};
  padding: ${growsomeTheme.spacing.xl};
  background: ${growsomeTheme.color.White};
  border-radius: ${growsomeTheme.radius.radius2};
  box-shadow: ${growsomeTheme.shadow.Elevation1};
  border: 1px solid ${growsomeTheme.color.Gray200};
  text-align: left;
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing.lg};
    gap: ${growsomeTheme.spacing.md};
    
    .Typography.TextL400 {
      font-size: 1rem !important;
    }
  }
`;

const ProblemIcon = styled.div`
  background: ${growsomeTheme.color.Gray50};
  padding: ${growsomeTheme.spacing.sm};
  border-radius: ${growsomeTheme.radius.radius1};
  flex-shrink: 0;
`;

const CrossIcon = styled.div`
  width: 20px;
  height: 20px;
  color: ${growsomeTheme.color.Red500};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WarningCard = styled.div`
  background: ${growsomeTheme.color.Gray50};
  border: 1px solid ${growsomeTheme.color.Yellow300};
  border-radius: ${growsomeTheme.radius.radius2};
  padding: ${growsomeTheme.spacing.xl};
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const WarningIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${growsomeTheme.spacing.md};
`;

const ProblemsSection: React.FC = () => {
  return (
    <ProblemsSectionContainer>
      <Container>
        <ColumnBox $gap={4} $ai="center">
          <SectionHeader>
            <ProblemsTitle style={{textAlign: 'center', marginBottom: '2rem'}}>
              <span style={{color: growsomeTheme.color.Red500}}>⚠️</span> 아직도 이런 고민 하고 계신가요?
            </ProblemsTitle>
          </SectionHeader>
          
          <ProblemsGrid>
            {problems.map((problem, index) => (
              <ProblemCard key={index}>
                <ProblemIcon>
                  <CrossIcon>❌</CrossIcon>
                </ProblemIcon>
                <Typography.TextL400 style={{color: growsomeTheme.color.Black700, fontWeight: 500}}>
                  "{problem}"
                </Typography.TextL400>
              </ProblemCard>
            ))}
          </ProblemsGrid>
          
          <WarningCard>
            <WarningIcon>⏰</WarningIcon>
            <ColumnBox $gap={1} $ai="center">
              <Typography.TextL600 color={growsomeTheme.color.Black800} style={{textAlign: 'center'}}>
                ChatGPT, Claude 등<br />AI가 비즈니스를 바꾸고 있는데,
              </Typography.TextL600>
              <Typography.TextL600 color={growsomeTheme.color.Red500} style={{textAlign: 'center'}}>
                매월 뒤처지고 있습니다
              </Typography.TextL600>
            </ColumnBox>
          </WarningCard>
        </ColumnBox>
      </Container>
    </ProblemsSectionContainer>
  );
};

export default ProblemsSection;