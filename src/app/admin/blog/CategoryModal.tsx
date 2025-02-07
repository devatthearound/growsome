import React, { useState } from 'react';
import styled from 'styled-components';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
}

interface CategoryModalProps {
  onClose: () => void;
  onCategoryChange: () => void;
  categories: Category[];
}

const CategoryModal = ({ onClose, onCategoryChange, categories }: CategoryModalProps) => {
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parent_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategory.name,
          description: newCategory.description,
          parent_id: newCategory.parent_id ? parseInt(newCategory.parent_id) : null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '카테고리 생성 실패');
      }
      
      setNewCategory({ name: '', description: '', parent_id: '' });
      onCategoryChange();
    } catch (error: any) {
      console.error('카테고리 생성 중 에러:', error);
      alert(error.message || '카테고리 생성 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('이 카테고리를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('카테고리 삭제 실패');
      
      onCategoryChange();
    } catch (error) {
      console.error('카테고리 삭제 중 에러:', error);
      alert('카테고리 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>카테고리 관리</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <CategoryList>
          {categories.map(category => (
            <CategoryItem key={category.id}>
              <CategoryName>{category.name}</CategoryName>
              <DeleteButton onClick={() => handleDelete(category.id)}>
                삭제
              </DeleteButton>
            </CategoryItem>
          ))}
        </CategoryList>

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <label>카테고리명</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({
                ...prev,
                name: e.target.value
              }))}
              required
            />
          </InputGroup>

          <InputGroup>
            <label>설명</label>
            <input
              type="text"
              value={newCategory.description}
              onChange={(e) => setNewCategory(prev => ({
                ...prev,
                description: e.target.value
              }))}
            />
          </InputGroup>

          <InputGroup>
            <label>상위 카테고리</label>
            <select
              value={newCategory.parent_id}
              onChange={(e) => setNewCategory(prev => ({
                ...prev,
                parent_id: e.target.value
              }))}
            >
              <option value="">없음</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </InputGroup>

          <Button type="submit">카테고리 추가</Button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
`;

const CategoryList = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
`;

const CategoryName = styled.span`
  font-size: 1rem;
`;

const DeleteButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #c82333;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input, select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #0066cc;
    }
  }
`;

const Button = styled.button`
  background: #0066cc;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #0052a3;
  }
`;

export default CategoryModal; 