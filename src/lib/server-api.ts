// Серверная версия API без axios для Edge Runtime
export const backendUrl = process.env.NEXT_PUBLIC_API_URL;

export async function serverGet(endpoint: string, options?: { revalidate?: number | false }) {
  const response = await fetch(`${backendUrl}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // Используем revalidate вместо no-store для статической генерации
    next: { 
      revalidate: options?.revalidate ?? 3600 // кеш на 1 час по умолчанию
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Проверяем, что ответ не пустой
  const text = await response.text();
  if (!text) {
    throw new Error('Empty response body');
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse JSON response:', text);
    throw new Error(`Invalid JSON response: ${error}`);
  }
}

export async function serverPost(endpoint: string, data: any) {
  const response = await fetch(`${backendUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    next: { revalidate: 0 } // Не кешируем POST запросы
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}