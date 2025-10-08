import { useGetAllDataQuery } from 'api/api';
import { map } from 'lodash-es';
import { useEffect, useState } from 'react';
import { OptionType } from 'types/entities';

export const useFetchOptions = (
  url: string,
  mapFn: (item: any) => { id: string; name: string }
) => {
  const { data, isLoading, isError, isSuccess, refetch } = useGetAllDataQuery({
    // url: `${url}?page=1&perPage=200`,
    url: `${url}`,
  });

  const [options, setOptions] = useState<OptionType[]>();
  useEffect(() => {
    if (isSuccess && data) {
      if (data.data.records) {
        setOptions(data.data.records.map((item: any) => mapFn(item)));
      } else if (data.data) {
        setOptions([data.data].map((item: any) => mapFn(item)));
      } else {
        setOptions([mapFn(data.data)]);
      }
    }
  }, [data, isSuccess, mapFn]);
  useEffect(() => {
    if (url) {
      refetch();
    }
  }, [url]);

  return { options, isLoading, isError };
};
