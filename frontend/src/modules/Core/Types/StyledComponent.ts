export interface StyledComponent {
  className?: string
}

export interface GenericHTMLProps {
  height?: string
  width?: string
  onClick?: () => void
}

export interface Collapsible {
  collapse: boolean
}
