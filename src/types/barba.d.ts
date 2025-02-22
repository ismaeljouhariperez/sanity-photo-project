declare module '@barba/core' {
  interface BarbaData {
    current: {
      container: HTMLElement
    }
    next: {
      container: HTMLElement
    }
  }

  interface BarbaTransition {
    name: string
    sync?: boolean
    to?: string
    from?: string
    leave(data: BarbaData): Promise<void>
    enter(data: BarbaData): Promise<void>
    async(): () => void
  }

  interface BarbaOptions {
    transitions: BarbaTransition[]
  }

  const barba: {
    init(options: BarbaOptions): void
  }

  export default barba
}
