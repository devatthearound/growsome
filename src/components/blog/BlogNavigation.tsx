'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTags } from '@fortawesome/free-solid-svg-icons';

interface Category {
  id: string; // UUID
  name: string;
  slug: string;
  description?: string;
  contentCount?: number;
  sortOrder?: number;
}

interface BlogNavigationProps {
  categories: Category[];
  onSearch?: (query: string) => void;
  onCategoryChange?: (categoryId: string) => void;
}

const BlogNavigation: React.FC<BlogNavigationProps> = ({ 
  categories, 
  onSearch, 
  onCategoryChange 
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    setSelectedCategory(category);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <NavigationWrapper>
      <Container>
        <NavLinks>
          <NavLink href="/blog" $active={isActive('/blog')}>
            전체 포스트
          </NavLink>
          <NavLink href="/blog/categories" $active={isActive('/blog/categories')}>
            카테고리
          </NavLink>
          <NavLink href="/blog/tags" $active={isActive('/blog/tags')}>
            <FontAwesomeIcon icon={faTags} />
            태그
          </NavLink>
        </NavLinks>

        <SearchAndFilter>
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="검색어를 입력하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </SearchButton>
          </SearchForm>

          <CategoryFilter>
            <CategorySelect
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="all">전체 카테고리</option>
              {(categories || []).map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </CategorySelect>
          </CategoryFilter>
        </SearchAndFilter>
      </Container>
    </NavigationWrapper>
  );
};

const NavigationWrapper = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 80px; /* Navigation 높이만큼 */
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 1rem;
    justify-content: center;
    width: 100%;
  }
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  text-decoration: none;
  color: ${props => props.$active ? '#514FE4' : '#6b7280'};
  font-weight: ${props => props.$active ? '600' : '500'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #514FE4;
    background: #f8f9fa;
  }

  ${props => props.$active && `
    background: #f0f0ff;
    border: 1px solid #e0e0ff;
  `}
`;

const SearchAndFilter = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #514FE4;
    box-shadow: 0 0 0 3px rgba(81, 79, 228, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  padding: 0.75rem 1rem;
  outline: none;
  font-size: 0.9rem;
  flex: 1;
  min-width: 200px;

  @media (max-width: 768px) {
    min-width: auto;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchButton = styled.button`
  border: none;
  background: #514FE4;
  color: white;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #4338ca;
  }
`;

const CategoryFilter = styled.div`
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CategorySelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #514FE4;
    box-shadow: 0 0 0 3px rgba(81, 79, 228, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default BlogNavigation;