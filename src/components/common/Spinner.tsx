interface SpinnerProps {
  size?: number
}

export default function Spinner({ size = 24 }: SpinnerProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className="animate-spin rounded-full border-2 border-sap-border border-t-sap-primary"
    />
  )
}