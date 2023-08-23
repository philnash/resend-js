export type CreateAPIKeyOptions = {
  name: string;
  permission?: "full_access" | "sending_access";
  domain_id?: string;
};

export type CreateAPIKeyResponse = {
  id: string;
  token: string;
};

export type GetAPIKeyResponse = {
  id: string;
  name: string;
  created_at: Date;
};
