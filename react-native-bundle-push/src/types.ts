export interface BundlePushConfig {
  serverURL: string;
}

export interface UpdateResponse {
  status: number;
  url?: string;
}

export interface BundlePushProps {
  config: BundlePushConfig;
}