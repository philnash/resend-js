export type ListResponse<Item> = {
  data: Array<Item>;
};

export type WithStringCreatedAt<APIResponse> = Omit<
  APIResponse,
  "created_at"
> & { created_at: string };
