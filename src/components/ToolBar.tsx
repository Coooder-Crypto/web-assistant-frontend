import type { ApiSettings } from '@src/types'
import { Badge, Button, colors, radius, spacing } from '@src/ui'

interface ToolBarProps {
  providers?: ApiSettings[]
  selectedProvider?: string
  onProviderChange?: (name: string) => Promise<void>
  onClear: () => void
  onRefresh: () => void
  disabled: boolean
  loading: boolean
}

const DEFAULT_PROVIDERS: ApiSettings[] = []

export function ToolBar({
  providers = DEFAULT_PROVIDERS,
  selectedProvider = '',
  onProviderChange,
  onClear,
  onRefresh,
  disabled,
  loading,
}: ToolBarProps) {
  const toolbarStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing[3]} ${spacing[4]}`,
    borderTop: `1px solid ${colors.neutral[700]}`, // Dark border
    backgroundColor: colors.neutral[800], // Dark toolbar bg
    gap: spacing[3],
  }

  const providerSectionStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  }

  const selectStyles = {
    'padding': `${spacing[2]} ${spacing[3]}`,
    'borderRadius': radius.md,
    'border': `1px solid ${colors.neutral[700]}`, // Dark border
    'backgroundColor': colors.neutral[850], // Dark select bg
    'fontSize': '0.875rem',
    'color': colors.neutral[100], // Light text
    'cursor': 'pointer',
    'minWidth': '120px',

    '&:focus': {
      outline: 'none',
      borderColor: colors.primary[500],
      boxShadow: `0 0 0 2px ${colors.ai.accent.glow}`,
    },
  }

  const actionSectionStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  }

  const statusIndicatorStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    fontSize: '0.75rem',
    color: colors.neutral[500],
  }

  const getCurrentProvider = () => {
    const current = providers.find(p => p.name === selectedProvider)
    return current
  }

  const currentProvider = getCurrentProvider()

  return (
    <div style={toolbarStyles}>
      <div style={providerSectionStyles}>
        <span style={{ fontSize: '0.875rem', color: colors.neutral[300] }}>
          AI Provider:
        </span>

        <select
          value={selectedProvider}
          onChange={e => onProviderChange?.(e.target.value)}
          style={selectStyles}
          disabled={loading}
        >
          {providers.map(provider => (
            <option key={provider.name} value={provider.name}>
              {provider.name}
              {' '}
              (
              {provider.provider}
              )
            </option>
          ))}
        </select>

        {currentProvider && (
          <Badge
            variant={
              currentProvider.provider === 'openai'
                ? 'primary'
                : currentProvider.provider === 'deepseek' || currentProvider.provider === 'siliconflow'
                  ? 'ai'
                  : 'secondary'
            }
            size="sm"
          >
            {currentProvider.provider.toUpperCase()}
          </Badge>
        )}
      </div>

      <div style={actionSectionStyles}>
        <div style={statusIndicatorStyles}>
          {loading && (
            <>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: colors.ai.processing,
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              Processing...
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh page content"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={disabled || loading}
          title="Clear conversation"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H3.862a2 2 0 01-1.995-1.858L1 7m3 4v6m4-6v6m4-6v6m5-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1H4a1 1 0 00-1 1v2m13 0H2" />
          </svg>
          Clear
        </Button>
      </div>
    </div>
  )
}
