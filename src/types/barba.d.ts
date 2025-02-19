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
    leave: (data: BarbaData) => Promise<void>
    enter: (data: BarbaData) => Promise<void>
  }

  interface BarbaInit {
    transitions: BarbaTransition[]
  }

  const barba: {
    init: (options: BarbaInit) => void
  }

  export default barba
}
