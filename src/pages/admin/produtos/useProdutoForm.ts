import type { AxiosError } from 'axios';
import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import {
  createProdutoApi,
  createProdutoPayload,
  updateProdutoApi,
  uploadProdutoImageApi,
} from './produto.api';

import {
  ALLOWED_IMAGE_TYPES,
  initialFormData,
  MAX_IMAGE_SIZE,
} from './produto.constants';

import type {
  ApiErrorResponse,
  Produto,
  ProdutoFormData,
} from './produto.types';

import {
  getErrorMessage,
} from './produto.utils';

interface UseProdutoFormOptions {
  onCreated: () => Promise<void>;
  onUpdated: () => Promise<void>;
}

export function useProdutoForm({
  onCreated,
  onUpdated,
}: UseProdutoFormOptions) {
  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [formData, setFormData] =
    useState<ProdutoFormData>(
      initialFormData,
    );

  const [
    selectedImage,
    setSelectedImage,
  ] = useState<File | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setSelectedImage(null);
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleFieldChange = (
    field: keyof ProdutoFormData,
    value: string | boolean,
  ) => {
    setFormData(
      (currentFormData) =>
        ({
          ...currentFormData,
          [field]: value,
        }) as ProdutoFormData,
    );
  };

  const handleImageChange = (
    event:
      ChangeEvent<HTMLInputElement>,
  ) => {
    clearMessages();

    const file =
      event.target.files?.[0];

    if (!file) {
      setSelectedImage(null);
      return;
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type,
      )
    ) {
      setSelectedImage(null);
      event.target.value = '';

      setError(
        'Selecione uma imagem JPG, PNG ou WEBP.',
      );

      return;
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setSelectedImage(null);
      event.target.value = '';

      setError(
        'A imagem deve ter no máximo 5 MB.',
      );

      return;
    }

    setSelectedImage(file);
  };

  const handleRemoveImage = () => {
    clearMessages();
    setSelectedImage(null);

    setFormData(
      (currentFormData) => ({
        ...currentFormData,
        imageUrl: '',
        imagePublicId: '',
      }),
    );
  };

  const getImageData =
    async () => {
      if (!selectedImage) {
        return {
          imageUrl:
            formData.imageUrl.trim() ||
            undefined,

          imagePublicId:
            formData.imagePublicId.trim() ||
            undefined,
        };
      }

      return uploadProdutoImageApi(
        selectedImage,
      );
    };

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      clearMessages();
      setSaving(true);

      const imageData =
        await getImageData();

      const payload =
        createProdutoPayload(
          formData,
          imageData,
        );

      if (editingId !== null) {
        await updateProdutoApi(
          editingId,
          payload,
        );

        setSuccess(
          'Produto atualizado com sucesso.',
        );

        resetForm();

        await onUpdated();

        return;
      }

      await createProdutoApi(
        payload,
      );

      setSuccess(
        'Produto criado com sucesso.',
      );

      resetForm();

      await onCreated();
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      console.error(
        'Erro ao salvar produto:',
        {
          statusCode:
            axiosError.response
              ?.status,
          data:
            axiosError.response
              ?.data,
          message:
            axiosError.message,
        },
      );

      setError(
        getErrorMessage(
          axiosError,
          'Erro ao salvar produto.',
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (
    produto: Produto,
  ) => {
    clearMessages();

    setEditingId(
      produto.id,
    );

    setSelectedImage(null);

    setFormData({
      name:
        produto.name,

      description:
        produto.description || '',

      price: String(
        produto.price,
      ),

      stockQuantity: String(
        produto.stockQuantity,
      ),

      categoryId: String(
        produto.category?.id ||
          '',
      ),

      imageUrl:
        produto.imageUrl || '',

      imagePublicId:
        produto.imagePublicId ||
        '',

      active:
        produto.active,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCancelEdit = () => {
    clearMessages();
    resetForm();
  };

  return {
    editingId,
    formData,
    selectedImage,
    saving,

    error,
    success,

    handleFieldChange,
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
    handleEdit,
    handleCancelEdit,
  };
}