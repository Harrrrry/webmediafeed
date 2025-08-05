import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';

interface JoinFormData {
  name: string;
  email: string;
  phone: string;
  relationship: string;
  side: string;
  showContact: boolean;
}

interface JoinFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  relationship?: string;
  side?: string;
  submit?: string;
}

interface UseJoinShaadiFormProps {
  inviteCode: string;
  onSuccess?: () => void;
}

export const useJoinShaadiForm = ({ inviteCode, onSuccess }: UseJoinShaadiFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<JoinFormData>({
    name: '',
    email: '',
    phone: '',
    relationship: '',
    side: '',
    showContact: false,
  });
  const [errors, setErrors] = useState<JoinFormErrors>({});

  // Pure function that checks form validity without setting state
  const isFormValid = (): boolean => {
    if (!form.name.trim()) {
      return false;
    }
    
    if (!form.email.trim() && !form.phone.trim()) {
      return false;
    }
    
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return false;
    }
    
    if (form.phone.trim() && !/^\+?\d{7,15}$/.test(form.phone)) {
      return false;
    }
    
    if (!form.side) {
      return false;
    }
    
    if (!form.relationship) {
      return false;
    }
    
    return true;
  };

  // Function that performs validation and updates error state (call only on submit)
  const validateForm = (): boolean => {
    const newErrors: JoinFormErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!form.email.trim() && !form.phone.trim()) {
      newErrors.email = 'Either email or phone is required';
      newErrors.phone = 'Either email or phone is required';
    }
    
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (form.phone.trim() && !/^\+?\d{7,15}$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!form.side) {
      newErrors.side = 'Please select a side';
    }
    
    if (!form.relationship) {
      newErrors.relationship = 'Please select a relationship';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleToggleShowContact = () => {
    setForm(prev => ({ ...prev, showContact: !prev.showContact }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.joinShaadi({
        code: inviteCode,
        name: form.name,
        side: form.side,
        relationship: form.relationship,
        contactNumber: form.phone,
        showContact: form.showContact
      });
      
      // Store the token in localStorage
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Default success behavior - redirect to home
        navigate('/');
      }
    } catch (err: any) {
      console.error('JoinShaadiForm: API error:', err);
      setErrors({
        submit: err.message || 'Failed to join wedding. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    loading,
    handleChange,
    handleToggleShowContact,
    handleSubmit,
    validateForm,
    isFormValid,
  };
}; 