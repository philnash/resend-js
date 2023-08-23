import { Resend } from "../resend.ts";
import { ListResponse, WithStringCreatedAt } from "../types.ts";
import {
  CreateAPIKeyOptions,
  CreateAPIKeyResponse,
  GetAPIKeyResponse,
} from "./types.ts";

const path = "/api-keys";

export class APIKeys {
  constructor(private readonly resend: Resend) {}

  create(options: CreateAPIKeyOptions): Promise<CreateAPIKeyResponse> {
    return this.resend.post(path, options);
  }

  async list(): Promise<ListResponse<GetAPIKeyResponse>> {
    const result = await this.resend.get<
      ListResponse<WithStringCreatedAt<GetAPIKeyResponse>>
    >(path);
    return {
      data: result.data.map(
        (apiKey): GetAPIKeyResponse => ({
          ...apiKey,
          created_at: new Date(apiKey.created_at),
        })
      ),
    };
  }

  remove(id: string): Promise<void> {
    return this.resend.remove(`${path}/${id}`);
  }
}
