import React from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormInput from './FormInput';

const FormContainer = styled.div`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.small};
  margin-bottom: 36px;
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px 0;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
  
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

const FilterSchema = Yup.object().shape({
  price_range: Yup.number()
    .positive('Harga harus positif')
    .required('Harga maksimal diperlukan'),
  min_rating: Yup.number()
    .min(1, 'Rating minimal 1')
    .max(5, 'Rating maksimal 5')
    .required('Rating minimal diperlukan'),
  max_distance: Yup.number()
    .positive('Jarak harus positif')
    .required('Jarak maksimal diperlukan'),
  kategori: Yup.string(),
});

const FilterForm = ({ onSubmit, loading }) => {
  return (
    <FormContainer>
      <Formik
        initialValues={{
          price_range: '',
          min_rating: '',
          max_distance: '',
          kategori: '',
        }}
        validationSchema={FilterSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form>
            <FormInput
              label="Harga Maksimal (Rp)"
              name="price_range"
              type="number"
              placeholder="Contoh: 25000"
              value={values.price_range}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.price_range && errors.price_range}
              required
            />
            
            <FormInput
              label="Rating Minimal"
              name="min_rating"
              type="number"
              step="0.1"
              placeholder="Contoh: 4.5"
              value={values.min_rating}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.min_rating && errors.min_rating}
              required
            />
            
            <FormInput
              label="Jarak Maksimal (km)"
              name="max_distance"
              type="number"
              step="0.1"
              placeholder="Contoh: 2.5"
              value={values.max_distance}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.max_distance && errors.max_distance}
              required
            />
            
            <FormInput
              label="Kategori Tempat (Opsional)"
              name="kategori"
              placeholder="Contoh: Cafe, Warung, Indoor"
              value={values.kategori}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.kategori && errors.kategori}
            />
            
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Mencari...' : 'Cari Rekomendasi'}
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default FilterForm;