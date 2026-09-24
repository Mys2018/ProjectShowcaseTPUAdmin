import { useMutation } from '@tanstack/react-query';
import { filesRequests } from './files.requests';

export const filesQueries = {
  useUpload: () =>
    useMutation({
      mutationFn: (file: File) => filesRequests.upload(file),
    }),
};
