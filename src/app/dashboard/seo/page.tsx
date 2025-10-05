// front/src/app/dashboard/seo/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react';
import { CrudLayout } from '@/components/crud/crud-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSeoSettingsByPageName, updateSeoSettings } from '@/api/requests'; // <-- Используем НОВЫЕ API-функции
import { SeoSetting as SeoSettingType } from '@/types/type'; // <-- Используем НОВЫЙ тип
import { toast } from 'sonner';

// Определим список страниц, для которых можно управлять SEO
const SEO_PAGES = [
  { value: 'home', label: 'Главная страница (/)' },
  { value: 'courses', label: 'Список курсов (/courses)' },
  { value: 'blog', label: 'Список блогов (/blog)' },
  { value: 'news', label: 'Список новостей (/news)' },
  { value: 'about', label: 'О нас (/about)' },
  { value: 'contact', label: 'Контакты (/contact)' },
  // Добавьте другие страницы по мере необходимости
];

export default function SeoSettingsPage() {
  const [selectedPage, setSelectedPage] = useState<string>(SEO_PAGES[0].value);
  const [formData, setFormData] = useState<Omit<SeoSettingType, 'id' | 'pageName' | 'createdAt' | 'updatedAt'>>({ // Используем Pick или Omit для части типа
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ogImage: '', // Добавляем ogImage
  });
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  // --- Измененная логика ---
  // 1. Создаем функцию для получения данных, которая будет использоваться в useQuery
  const fetchSeoData = useCallback(async () => {
    if (!selectedPage) return null;
    return getSeoSettingsByPageName(selectedPage); // <-- Используем НОВУЮ функцию
  }, [selectedPage]);

  // 2. Используем useQuery с правильными зависимостями
  const {
    data: seoSetting, // <-- Переименовали переменную для ясности
    isLoading,
    isError,
    refetch,
  } = useQuery<SeoSettingType | null, Error>({
    queryKey: ['seo-settings', selectedPage], // <-- Изменили queryKey для ясности и уникальности
    queryFn: fetchSeoData,
    staleTime: 1000 * 60 * 5, // 5 минут
    retry: 1,
    enabled: !!selectedPage,
  });
  // --- Конец измененной логики ---

  // Мутация для обновления/создания SEO-данных
  const { mutate: updateSeoMutation, isPending: isUpdating } = useMutation({
    // Изменяем mutationFn на использование НОВОЙ функции
    mutationFn: ({ pageName, seoData }: { pageName: string; seoData: Partial<Omit<SeoSettingType, 'id' | 'pageName' | 'createdAt' | 'updatedAt'>> }) => updateSeoSettings(pageName, seoData),
    onSuccess: (updatedData) => {
      toast.success(`SEO настройки для "${SEO_PAGES.find(p => p.value === updatedData.pageName)?.label || updatedData.pageName}" успешно обновлены`);
      // Обновляем кэш с новыми данными
      queryClient.setQueryData(['seo-settings', updatedData.pageName], updatedData);
      // Также обновляем форму, чтобы отразить изменения
      setFormData({
        metaTitle: updatedData.metaTitle || '',
        metaDescription: updatedData.metaDescription || '',
        keywords: updatedData.keywords || '',
        ogImage: updatedData.ogImage || '', // Обновляем ogImage
      });
      setIsEditing(true);
    },
    onError: (error: any) => {
      console.error('Error updating SEO:', error);
      toast.error(`Ошибка при обновлении SEO: ${error.message || 'Неизвестная ошибка'}`);
    },
  });

  // --- Измененная логика ---
  // 3. Эффект, срабатывающий при изменении selectedPage
  useEffect(() => {
    // Сбросить форму к пустым значениям на время загрузки
    setFormData({
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      ogImage: '', // Сбрасываем ogImage
    });
    setIsEditing(false);

    const fetchNewData = async () => {
      try {
        await queryClient.cancelQueries({ queryKey: ['seo-settings', selectedPage] });
      } catch (err) {
        // Игнорируем ошибки отмены
      }
      refetch();
    };

    fetchNewData();
  }, [selectedPage, queryClient, refetch]);
  // --- Конец измененной логики ---

  // 4. Эффект, заполняющий форму данными из seoSetting
  useEffect(() => {
    if (seoSetting) {
      setFormData({
        metaTitle: seoSetting.metaTitle || '',
        metaDescription: seoSetting.metaDescription || '',
        keywords: seoSetting.keywords || '',
        ogImage: seoSetting.ogImage || '', // Заполняем ogImage
      });
      setIsEditing(true);
    } else {
      // Если данных нет (null), оставляем форму пустой и режим создания
      setFormData({
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        ogImage: '',
      });
      setIsEditing(false);
    }
  }, [seoSetting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) {
      toast.error('Пожалуйста, выберите страницу.');
      return;
    }
    // Используем Partial<Omit<...>> для отправляемых данных
    const dataToSend: Partial<Omit<SeoSettingType, 'id' | 'pageName' | 'createdAt' | 'updatedAt'>> = {
      metaTitle: formData.metaTitle || undefined,
      metaDescription: formData.metaDescription || undefined,
      keywords: formData.keywords || undefined,
      ogImage: formData.ogImage || undefined, // Отправляем ogImage
    };
    updateSeoMutation({ pageName: selectedPage, seoData: dataToSend });
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPage(e.target.value);
  };

  // --- Обработка состояний загрузки и ошибки ---
  if (isLoading && !seoSetting) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p>Loading SEO settings for {SEO_PAGES.find(p => p.value === selectedPage)?.label || selectedPage}...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <p className="text-red-500 mb-2">Error loading SEO settings for {SEO_PAGES.find(p => p.value === selectedPage)?.label || selectedPage}.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }
  // --- Конец обработки состояний ---

  return (
    <CrudLayout
      title="SEO Настройки"
      description="Управление мета-тегами для общих страниц сайта"
      createButtonLabel=""
      isButton={false}
      onCreateClick={() => {}}
    >
      <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
        <div className="mb-6">
          <Label htmlFor="page-select">Выберите страницу:</Label>
          <select
            id="page-select"
            value={selectedPage}
            onChange={handlePageChange}
            className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded mt-1 bg-white dark:bg-slate-900"
          >
            {SEO_PAGES.map(page => (
              <option key={`seo-page-${page.value}`} value={page.value}>
                {page.label}
              </option>
            ))}
          </select>
        </div>

        {isLoading && seoSetting && (
           <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 flex items-center justify-center rounded-lg">
             <p>Updating...</p>
           </div>
         )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Мета-заголовок</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle || ''}
                onChange={handleInputChange}
                placeholder="Введите мета-заголовок"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="metaDescription">Мета-описание</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription || ''}
                onChange={handleInputChange}
                placeholder="Введите мета-описание"
                rows={4}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="keywords">Keywords (через запятую)</Label>
              <Input
                id="keywords"
                name="keywords"
                value={formData.keywords || ''}
                onChange={handleInputChange}
                placeholder="keyword1, keyword2, keyword3"
                disabled={isLoading}
              />
            </div>
            {/* Добавляем поле для ogImage */}
            <div>
              <Label htmlFor="ogImage">OG Image URL</Label>
              <Input
                id="ogImage"
                name="ogImage"
                value={formData.ogImage || ''}
                onChange={handleInputChange}
                placeholder="/images/og/home-og.jpg"
                disabled={isLoading}
              />
              {formData.ogImage && (
                <div className="mt-2">
                  <Label>Предпросмотр OG Image:</Label>
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL}${formData.ogImage.startsWith('/') ? '' : '/'}${formData.ogImage}`} 
                    alt="OG Preview" 
                    className="w-full max-w-xs h-auto border rounded" 
                    onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} // Обработка ошибок загрузки
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Button 
              type="submit" 
              disabled={isUpdating || isLoading}
            >
              {isUpdating ? 'Сохранение...' : (isEditing ? 'Сохранить изменения' : 'Создать')}
            </Button>
          </div>
        </form>
      </div>
    </CrudLayout>
  );
}