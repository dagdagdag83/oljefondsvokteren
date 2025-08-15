export function getBackendBaseUrl(): string {
	const runtime = (window as any).RUNTIME_CONFIG?.BACKEND_URL as string | undefined
	if (runtime && runtime.length > 0) return runtime
	const env = (import.meta as any).env?.VITE_BACKEND_URL as string | undefined
	return env && env.length > 0 ? env : '/api'
}

export function useApiBase(): string {
	return getBackendBaseUrl()
}


