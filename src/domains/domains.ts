import { Resend } from "../resend.ts";
import {
  CreateDomainOptions,
  CreateDomainResponse,
  GetDomainResponse,
} from "./types.ts";
import { ListResponse, WithStringCreatedAt } from "../types.ts";

const path = "/domains";

export class Domains {
  constructor(private readonly resend: Resend) {}

  async create(options: CreateDomainOptions): Promise<CreateDomainResponse> {
    const result = await this.resend.post<
      WithStringCreatedAt<CreateDomainResponse>
    >(path, options);
    return { ...result, created_at: new Date(result.created_at) };
  }

  async get(id: string): Promise<GetDomainResponse> {
    const result = await this.resend.get<
      WithStringCreatedAt<GetDomainResponse>
    >(`${path}/${id}`);
    return { ...result, created_at: new Date(result.created_at) };
  }

  async list(): Promise<ListResponse<GetDomainResponse>> {
    const result = await this.resend.get<
      ListResponse<WithStringCreatedAt<GetDomainResponse>>
    >(path);
    return {
      data: result.data.map(
        (domain): GetDomainResponse => ({
          ...domain,
          created_at: new Date(domain.created_at),
        })
      ),
    };
  }

  verify(id: string): Promise<void> {
    return this.resend.post(`${path}/${id}/verify`);
  }

  remove(id: string): Promise<void> {
    return this.resend.remove(`${path}/${id}`);
  }
}
