'use client'

import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { getAllCoursesPublic } from '@/api/requests';

export default function SearchCourses({ navlight, scroll }: { navlight: boolean, scroll: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    limit: 1000,
  });

  const shouldFetch = filters.search.trim().length >= 3;

  const { data: courses, isLoading, refetch } = useQuery({
    queryKey: ['courses', filters],
    queryFn: () => getAllCoursesPublic(filters),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    enabled: shouldFetch,
    placeholderData: (previousData) => previousData,
  });

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchText, page: 1 }));
  };

  useEffect(() => {
    if (searchText.trim().length >= 3) {
      setFilters((prev) => ({ ...prev, search: searchText.trim(), page: 1 }));
    }
  }, [searchText]);


  return (
    <>
      <ul className="buy-button list-none mb-0">
        <li className="inline-block relative">
          {navlight && (
            <button
              className="text-[20px] size-8 inline-flex items-center justify-center tracking-wide align-middle"
              type="button"
              onClick={toggleDropdown}
            >
              <FiSearch className={`iconoir-search ${scroll ? 'text-black dark:text-white' : 'text-white'}`} />
            </button>
          )}
        </li>
      </ul>

      <div
        className={`fixed w-full h-[100vh] top-0 left-0 flex justify-center ${isOpen ? '' : 'hidden'}`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div ref={dropdownRef} className="rounded-md pt-2 shadow dark:shadow-gray-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-11/12 max-w-5xl mt-20 fixed">
          <div className="relative w-full h-auto">
            <button
              className="size-5 rounded-md flex justify-center items-center absolute -top-4 end-0 m-4"
              onClick={toggleDropdown}
            >
              <FiX className="size-4" />
            </button>

            <div className="p-6 text-center">
              <form className="relative" onSubmit={handleSearch}>
                <input
                  type="text"
                  className="w-full py-2 px-3 bg-transparent border border-slate-300 dark:border-slate-700 rounded-md pe-6 h-10"
                  name="s"
                  id="searchItem"
                  placeholder="Поиск..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </form>

              {/* Search Results */}
              {isLoading ? (
                <p className="mt-4">Загрузка...</p>
              ) : (
                <ul className="mt-4 text-left space-y-2">
                  {courses?.items.map((course: any) => (
                    <a
                      key={course.id}
                      href={`${process.env.NEXT_PUBLIC_API_URL}/${course.category?.url}/${course.url}`}
                    >
                      <li className="border-b pb-2">{course.name}</li>
                    </a>
                  ))}
                  {courses?.items.length === 0 && <li>Ничего не найдено.</li>}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}