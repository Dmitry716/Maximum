'use client'

import { useState, useEffect } from 'react';
import { CrudLayout } from '@/components/crud/crud-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSeoByPageName, updateSeo } from '@/api/requests';
import { Blog as BlogType } from '@/types/type'; // Используем тип Blog
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
  const [selectedPage, setSelectedPage] = useState<string>(SEO_PAGES[0].value); // По умолчанию первая страница
  const [formData, setFormData] = useState<Partial<BlogType>>({ // Изменили тип formData
    metaTitle: '',
    metaDescription: '',
    keywords: '',
  });
  const [isEditing, setIsEditing] = useState(false); // Для отслеживания, создаем или редактируем

  const queryClient = useQueryClient();

  // Запрос для получения текущих SEO-данных для выбранной страницы
  const {
    data: seoBlogPost, // Переименовали переменную для ясности
    isLoading,
    isError,
    refetch,
  } = useQuery<BlogType | null, Error>({ // Изменили тип
    queryKey: ['seo', selectedPage],
    queryFn: () => getSeoByPageName(selectedPage),
    staleTime: 1000 * 60 * 5, // 5 минут
    retry: 1,
    // enabled: !!selectedPage, // Запрос выполняется только если selectedPage задан
  });

  // Мутация для обновления/создания SEO-данных
  const { mutate: updateSeoMutation, isPending: isUpdating } = useMutation({
    // Изменили mutationFn
    mutationFn: ({ pageName, seoData }: { pageName: string; seoData: Partial<BlogType> }) => updateSeo(pageName, seoData), // Изменили тип seoData
    onSuccess: (updatedData) => { // updatedData теперь BlogType
      toast.success(`SEO настройки для "${SEO_PAGES.find(p => p.value === updatedData.url)?.label || updatedData.url}" успешно обновлены`); // Обратите внимание на updatedData.url
      queryClient.setQueryData(['seo', updatedData.url], updatedData); // Обновляем кэш, используя url
      setIsEditing(false);
    },
    onError: (error: any) => {
      console.error('Error updating SEO:', error);
      toast.error(`Ошибка при обновлении SEO: ${error.message || 'Неизвестная ошибка'}`);
    },
  });

  // Сброс формы при изменении выбранной страницы
  useEffect(() => {
    setFormData({
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    });
    setIsEditing(false); // Сбрасываем режим редактирования при смене страницы
  }, [selectedPage]);

  // Заполняем форму данными из API, когда они загружаются
  useEffect(() => {
    if (seoBlogPost) {
      setFormData({
        metaTitle: seoBlogPost.metaTitle || '',
        metaDescription: seoBlogPost.metaDescription || '',
        keywords: seoBlogPost.keywords || '',
      });
      setIsEditing(true); // Режим редактирования, если данные есть
    } else {
      setFormData({
        metaTitle: '',
        metaDescription: '',
        keywords: '',
      });
      setIsEditing(false); // Режим создания, если данных нет
    }
  }, [seoBlogPost]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value })); // Обновляем formData
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) {
      toast.error('Пожалуйста, выберите страницу.');
      return;
    }
    const dataToSend: Partial<BlogType> = { // Изменили тип отправляемых данных
      metaTitle: formData.metaTitle || undefined,
      metaDescription: formData.metaDescription || undefined,
      keywords: formData.keywords || undefined,
      // ... другие возможные поля
    };
    // Передаем pageName и данные в мутацию
    updateSeoMutation({ pageName: selectedPage, seoData: dataToSend });
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPage(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p>Loading SEO settings...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-red-500">Error loading SEO settings.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <CrudLayout
      title="SEO Настройки"
      description="Управление мета-тегами для общих страниц сайта"
      createButtonLabel="" // Скрыть кнопку создания, управление через форму
      isButton={false} // Скрыть кнопку создания
      onCreateClick={() => {}} // Передаем пустую функцию, так как isButton=false
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
              <option key={page.value} value={page.value}>
                {page.label}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Мета-заголовок</Label>
              <Input
                id="metaTitle"
                name="metaTitle" // Убедитесь, что name соответствует полю в formData
                value={formData.metaTitle || ''}
                onChange={handleInputChange}
                placeholder="Введите мета-заголовок"
              />
            </div>
            <div>
              <Label htmlFor="metaDescription">Мета-описание</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription" // Убедитесь, что name соответствует полю в formData
                value={formData.metaDescription || ''}
                onChange={handleInputChange}
                placeholder="Введите мета-описание"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="keywords">Keywords (через запятую)</Label>
              <Input
                id="keywords"
                name="keywords" // Убедитесь, что name соответствует полю в formData
                value={formData.keywords || ''}
                onChange={handleInputChange}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Сохранение...' : (isEditing ? 'Сохранить изменения' : 'Создать')}
            </Button>
          </div>
        </form>
      </div>
    </CrudLayout>
  );
}