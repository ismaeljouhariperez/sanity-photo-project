declare module '@barba/core' {
  interface BarbaData {
    current: {
      container: HTMLElement
      url: {
        path?: string
      }
    }
    next: {
      container: HTMLElement
      url: {
        path?: string
      }
    }
  }

  interface BarbaTransition {
    name: string
    sync?: boolean
    to?: string
    from?: string
    async(): () => void
    leave(data: BarbaData): Promise<void>
    enter(data: BarbaData): Promise<void>
  }

  interface BarbaOptions {
    transitions: BarbaTransition[]
  }

  const barba: {
    init(options: BarbaOptions): void
    go(url: string): Promise<void>
  }

  export default barba
}
