export type DataConfig = {
	module?: string
} & Record<string, unknown>

export type DataModule = {
	init?: (p?: Record<string, unknown>) => Promise<void>
}
