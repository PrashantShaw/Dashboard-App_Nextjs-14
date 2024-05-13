'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { debounce } from '@/app/lib/utils';

/**
 * ready to use react-rebounce hook-
 * npm i use-debounce
 * useDebouncedCallback(Fn, ms)
 */

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace: replaceUrl } = useRouter()
  const deafultQueryString = searchParams.get('query')?.toString()
  const DEBOUNCE_MS = 500

  const handleSearch = useCallback((term: string) => {
    console.log(term);
    const params = new URLSearchParams(searchParams);

    params.set('page', '1');
    (term !== '') ? params.set('query', term) : params.delete('query');
    const urlWithQuery = `${pathname}?${params.toString()}`
    replaceUrl(urlWithQuery)
  }, [pathname, replaceUrl, searchParams])

  const deboundcedHandleSearch = useMemo(() => debounce(handleSearch, DEBOUNCE_MS), [handleSearch])

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        // onChange={(event) => handleSearch(event.target.value)}
        onChange={(event) => deboundcedHandleSearch(event.target.value)}
        defaultValue={deafultQueryString}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
